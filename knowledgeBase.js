// knowledgeBase.js
// Loads all knowledge-base/*.md files and concatenates them into a single
// string for "context stuffing" into the system prompt.
//
// FUTURE UPGRADE PATH: when the knowledge base grows too large to fit in one
// prompt (books, OCR'd scans, many documents), replace loadKnowledgeBase()
// with a function that embeds these same .md files into a vector database
// and retrieves only the top-k relevant chunks per query. Nothing else in
// the app (system prompt structure, API contract, frontend) needs to change.

import { readdirSync, readFileSync } from "fs";
import path from "path";

const KB_DIR = path.join(process.cwd(), "knowledge-base");

export function loadKnowledgeBase() {
  const files = readdirSync(KB_DIR).filter((f) => f.endsWith(".md"));

  if (files.length === 0) {
    throw new Error("No knowledge base files found in /knowledge-base");
  }

  const sections = files.map((filename) => {
    const content = readFileSync(path.join(KB_DIR, filename), "utf-8");
    return `--- FILE: ${filename} ---\n${content.trim()}\n`;
  });

  return sections.join("\n\n");
}
