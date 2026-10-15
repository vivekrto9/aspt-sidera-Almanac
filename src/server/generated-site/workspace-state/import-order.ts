import type { Row, Table } from './domains.ts';
import { fail } from './validation.ts';

/** Order only the authored allowlist; deferred NO ACTION cycles stay atomic. */
export const authoredImportOrder = (selected: Table[], foreignKeys: Row[][]): Table[] => {
  const names = new Set(selected.map(table => table.name));
  if (names.size !== selected.length || foreignKeys.length !== selected.length) fail('Authored table dependency metadata is incomplete or duplicated.');
  const dependencies = new Map(selected.map(table => [table.name, new Set<string>()]));
  const edges: Array<{ child: string; parent: string; action: string }> = [];
  selected.forEach((table, index) => {
    for (const foreignKey of foreignKeys[index]) {
      const parent = String(foreignKey.table);
      if (!names.has(parent)) continue; // Other tables remain outside the authored allowlist.
      const action = String(foreignKey.on_delete).toUpperCase();
      if (!['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT'].includes(action)) fail('Unsupported authored foreign-key action.');
      if (parent === table.name) {
        if (action === 'RESTRICT' || (action !== 'NO ACTION' && table.where)) fail('Unsafe immediate authored foreign-key cycle.');
        continue; // Whole-table self actions cannot change rows outside this deletion.
      }
      dependencies.get(table.name)!.add(parent);
      edges.push({ child: table.name, parent, action });
    }
  });
  const reaches = (from: string, target: string, visited = new Set<string>()): boolean => {
    if (from === target) return true;
    if (visited.has(from)) return false;
    visited.add(from);
    return [...dependencies.get(from)!].some(parent => reaches(parent, target, visited));
  };
  const groups: Table[][] = [];
  for (const table of selected) {
    if (groups.some(group => group.includes(table))) continue;
    groups.push(selected.filter(other => reaches(table.name, other.name) && reaches(other.name, table.name)));
  }
  const groupFor = new Map(groups.flatMap((group, index) => group.map(table => [table.name, index] as const)));
  if (edges.some(edge => groupFor.get(edge.child) === groupFor.get(edge.parent) && edge.action !== 'NO ACTION')) fail('Unsafe immediate authored foreign-key cycle.');
  const ordered: Table[] = [];
  const visited = new Set<number>();
  const visit = (index: number) => {
    if (visited.has(index)) return;
    visited.add(index);
    for (const table of groups[index]) for (const parent of dependencies.get(table.name)!) {
      const parentGroup = groupFor.get(parent)!;
      if (parentGroup !== index) visit(parentGroup);
    }
    ordered.push(...groups[index]);
  };
  groups.forEach((_, index) => visit(index));
  return ordered;
};
