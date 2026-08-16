import { detectWorkflowMode, workflowPaths } from "./generated-site-contract-assertions.mjs";

export { detectWorkflowMode, workflowPaths };

export const isGeneratedSiteMode = (root) => detectWorkflowMode(root) === "generated-site";
export const isTemplateSourceMode = (root) => detectWorkflowMode(root) === "template-source";
