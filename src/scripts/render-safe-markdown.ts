const safeLink = (value: string) => {
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol)
      ? url.href
      : "";
  } catch {
    return "";
  }
};

const appendInline = (target: HTMLElement, source: string) => {
  const token = /(`[^`\n]+`|\*\*[^*\n]+\*\*|__[^_\n]+__|~~[^~\n]+~~|\[[^\]\n]+\]\([^\s)]+\)|\*[^*\n]+\*|_[^_\n]+_)/g;
  let cursor = 0;
  for (const match of source.matchAll(token)) {
    const index = match.index ?? 0;
    if (index > cursor) target.append(document.createTextNode(source.slice(cursor, index)));
    const value = match[0];
    let element: HTMLElement | null = null;
    let content = "";
    if (value.startsWith("`")) {
      element = document.createElement("code");
      content = value.slice(1, -1);
    } else if (value.startsWith("**") || value.startsWith("__")) {
      element = document.createElement("strong");
      content = value.slice(2, -2);
    } else if (value.startsWith("~~")) {
      element = document.createElement("del");
      content = value.slice(2, -2);
    } else if (value.startsWith("[")) {
      const parts = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const href = safeLink(parts?.[2] ?? "");
      if (parts && href) {
        const link = document.createElement("a");
        link.href = href;
        link.rel = "noopener noreferrer";
        if (link.protocol === "http:" || link.protocol === "https:") link.target = "_blank";
        appendInline(link, parts[1]);
        element = link;
      } else {
        content = parts?.[1] ?? value;
      }
    } else {
      element = document.createElement("em");
      content = value.slice(1, -1);
    }
    if (element) {
      if (!element.hasChildNodes()) appendInline(element, content);
      target.append(element);
    } else {
      target.append(document.createTextNode(content));
    }
    cursor = index + value.length;
  }
  if (cursor < source.length) target.append(document.createTextNode(source.slice(cursor)));
};

const normalizeCompactMarkdown = (source: string) =>
  source
    .replace(/\r\n?/g, "\n")
    .replace(/\s+(?=\*\*[^*\n]{2,80}\*\*\s*:)/g, "\n\n")
    .replace(/(\*\*[^*\n]{2,80}\*\*\s*:)\s*-\s+/g, "$1\n- ")
    .replace(/([.!?])\s+-\s+(?=[A-Z])/g, "$1\n- ")
    .trim();

const isBlockStart = (line: string, next = "") =>
  /^(#{1,6})\s+/.test(line) ||
  /^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line) ||
  /^\s*([-+*]|\d+[.)])\s+/.test(line) ||
  /^>\s?/.test(line) ||
  /^```/.test(line) ||
  (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(next));

const tableCells = (line: string) =>
  line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());

export const renderSafeMarkdown = (target: HTMLElement, markdown: string) => {
  const lines = normalizeCompactMarkdown(markdown).split("\n");
  const fragment = document.createDocumentFragment();
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      continue;
    }

    const fence = line.match(/^```([\w-]*)\s*$/);
    if (fence) {
      const codeLines: string[] = [];
      index += 1;
      while (index < lines.length && !/^```\s*$/.test(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      if (fence[1]) code.dataset.language = fence[1];
      code.textContent = codeLines.join("\n");
      pre.append(code);
      fragment.append(pre);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const level = Math.min(6, Number(heading[1].length) + 2);
      const element = document.createElement(`h${level}`);
      appendInline(element, heading[2]);
      fragment.append(element);
      index += 1;
      continue;
    }

    if (/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line)) {
      fragment.append(document.createElement("hr"));
      index += 1;
      continue;
    }

    if (line.includes("|") && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1] ?? "")) {
      const table = document.createElement("table");
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      for (const value of tableCells(line)) {
        const cell = document.createElement("th");
        appendInline(cell, value);
        headRow.append(cell);
      }
      head.append(headRow);
      table.append(head);
      index += 2;
      const body = document.createElement("tbody");
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        const row = document.createElement("tr");
        for (const value of tableCells(lines[index])) {
          const cell = document.createElement("td");
          appendInline(cell, value);
          row.append(cell);
        }
        body.append(row);
        index += 1;
      }
      table.append(body);
      fragment.append(table);
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote = document.createElement("blockquote");
      const values: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        values.push(lines[index].replace(/^>\s?/, ""));
        index += 1;
      }
      appendInline(quote, values.join("\n"));
      fragment.append(quote);
      continue;
    }

    const listItem = line.match(/^\s*([-+*]|\d+[.)])\s+(.+)$/);
    if (listItem) {
      const ordered = /^\d/.test(listItem[1]);
      const list = document.createElement(ordered ? "ol" : "ul");
      while (index < lines.length) {
        const item = lines[index].match(/^\s*([-+*]|\d+[.)])\s+(.+)$/);
        if (!item || /^\d/.test(item[1]) !== ordered) break;
        const li = document.createElement("li");
        const task = item[2].match(/^\[([ xX])\]\s+(.+)$/);
        if (task) {
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = task[1].toLowerCase() === "x";
          checkbox.disabled = true;
          li.append(checkbox, document.createTextNode(" "));
          appendInline(li, task[2]);
        } else {
          appendInline(li, item[2]);
        }
        list.append(li);
        index += 1;
      }
      fragment.append(list);
      continue;
    }

    const paragraphLines = [line.trim()];
    index += 1;
    while (
      index < lines.length &&
      lines[index].trim() &&
      !isBlockStart(lines[index], lines[index + 1] ?? "")
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }
    const paragraph = document.createElement("p");
    paragraphLines.forEach((value, lineIndex) => {
      if (lineIndex) paragraph.append(document.createElement("br"));
      appendInline(paragraph, value);
    });
    fragment.append(paragraph);
  }

  target.replaceChildren(fragment);
};

