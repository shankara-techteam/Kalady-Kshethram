// scripts/dev-server.js
// Lightweight LOCAL-ONLY dev server that mimics Vercel's behavior:
// serves static files from the repo root AND routes POST /api/chat to the
// real api/chat.js handler, exactly as Vercel would in production.
//
// This file is NOT used in production — Vercel handles routing automatically
// when deployed. This exists purely so you can test the whole site (widget +
// real backend) locally with one command, no Vercel CLI or login required.
//
// Run from the repo root with: node scripts/dev-server.js
// Then open: http://localhost:3000
 
import http from "http";
import fs from "fs";
import path from "path";
import { readFileSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
 
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, ".."); // repo root (one level up from /scripts)
 
// Load .env.local manually, same approach as test-local.js
try {
  const envFile = readFileSync(path.join(ROOT, ".env.local"), "utf-8");
  for (const line of envFile.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  console.warn("Warning: .env.local not found at repo root. GROQ_API_KEY may be missing.");
}
 
const PORT = 3000;
 
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};
 
const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/chat") {
      return handleApiChat(req, res);
    }
    return serveStatic(req, res);
  } catch (err) {
    console.error("Dev server error:", err);
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error");
  }
});
 
async function handleApiChat(req, res) {
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", async () => {
    let parsedBody = {};
    try {
      parsedBody = JSON.parse(body || "{}");
    } catch {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ error: "Invalid JSON body" }));
    }
 
    // Adapt plain Node req/res into the minimal Vercel-style interface
    // api/chat.js expects: req.body, and res.status(code).json(obj).
    const vercelReq = { method: req.method, body: parsedBody };
    const vercelRes = {
      status(code) {
        this._statusCode = code;
        return this;
      },
      json(obj) {
        res.writeHead(this._statusCode || 200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(obj));
      },
    };
 
    const handlerModule = await import(pathToFileURL(path.join(ROOT, "api", "chat.js")).href);
    await handlerModule.default(vercelReq, vercelRes);
  });
}
 
function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
 
  const filePath = path.join(ROOT, urlPath);
 
  // Basic safety: prevent escaping the repo root via ../
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
 
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 Not Found: " + urlPath);
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}
 
server.listen(PORT, () => {
  console.log(`\nLocal dev server running: http://localhost:${PORT}`);
  console.log(`Serving static files from: ${ROOT}`);
  console.log(`API endpoint available at: http://localhost:${PORT}/api/chat\n`);
  console.log("Press Ctrl+C to stop.\n");
});
 