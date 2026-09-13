import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

import setupPrompt from "./api/setup-prompt.js";

const publicRoot = new URL("./public/", import.meta.url);
const files = new Map([
  ["/", ["index.html", "text/html"]],
  ["/connect.html", ["connect.html", "text/html"]],
  ["/styles.css", ["styles.css", "text/css"]],
  ["/guide.js", ["guide.js", "text/javascript"]],
  ["/availability.json", ["availability.json", "application/json"]],
  ["/site.webmanifest", ["site.webmanifest", "application/manifest+json"]],
  ["/robots.txt", ["robots.txt", "text/plain"]],
  ["/sitemap.xml", ["sitemap.xml", "application/xml"]],
  ["/gossip-mark.svg", ["gossip-mark.svg", "image/svg+xml"]],
  ["/gossip-signal.png", ["gossip-signal.png", "image/png"]],
  ["/gossip-floating.png", ["gossip-floating.png", "image/png"]],
  ["/assets/gossip-social.jpg", ["assets/gossip-social.jpg", "image/jpeg"]],
  ["/assets/gossip-hero.webp", ["assets/gossip-hero.webp", "image/webp"]],
  [
    "/assets/gossip-hero-small.webp",
    ["assets/gossip-hero-small.webp", "image/webp"],
  ],
  ["/favicon.ico", ["favicon.ico", "image/x-icon"]],
  ["/favicon-32.png", ["favicon-32.png", "image/png"]],
  ["/apple-touch-icon.png", ["apple-touch-icon.png", "image/png"]],
  ["/icon-192.png", ["icon-192.png", "image/png"]],
  ["/icon-512.png", ["icon-512.png", "image/png"]],
  [
    "/fonts/bricolage-grotesque.ttf",
    ["fonts/bricolage-grotesque.ttf", "font/ttf"],
  ],
]);
const textMimeTypes = new Set([
  "text/html",
  "text/css",
  "text/javascript",
  "text/plain",
  "application/json",
  "application/manifest+json",
  "application/xml",
  "image/svg+xml",
]);
const port = Number(process.env.PORT || 43848);

function createApiResponse(response) {
  return {
    setHeader(name, value) {
      response.setHeader(name, value);
    },
    status(statusCode) {
      response.statusCode = statusCode;
      return this;
    },
    json(body) {
      response.end(JSON.stringify(body));
    },
  };
}

async function readJsonBody(request) {
  const chunks = [];
  let length = 0;

  for await (const chunk of request) {
    length += chunk.length;
    if (length > 1024) {
      return null;
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  );
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Cache-Control", "no-store");
  const pathname = new URL(request.url, "http://localhost").pathname;
  if (pathname === "/api/setup-prompt") {
    request.body = await readJsonBody(request);
    setupPrompt(request, createApiResponse(response));
    return;
  }

  const file = files.get(pathname);
  if (!file || !["GET", "HEAD"].includes(request.method)) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const content = await readFile(new URL(file[0], publicRoot));
    const contentType = textMimeTypes.has(file[1])
      ? `${file[1]}; charset=utf-8`
      : file[1];
    response.writeHead(200, { "Content-Type": contentType });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(500).end("Page unavailable");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Gossip preview: http://127.0.0.1:${server.address().port}`),
);
