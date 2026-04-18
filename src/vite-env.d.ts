/// <reference types="vite/client" />

// Ensures import.meta.env is typed (provided by vite/client above).
// Also silences TS2882 for plain CSS side-effect imports.
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
