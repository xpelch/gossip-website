import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const publicRoot = new URL("./public/", import.meta.url);
const files = new Map([
  ["/", ["index.html", "text/html"]],
  ["/connect.html", ["connect.html", "text/html"]],
  ["/styles.css", ["styles.css", "text/css"]],
  ["/guide.js", ["guide.js", "text/javascript"]],
  ["/availability.json", ["availability.json", "application/json"]],
  ["/gossip-mark.svg", ["gossip-mark.svg", "image/svg+xml"]],
  ["/gossip-signal.png", ["gossip-signal.png", "image/png"]],
  ["/gossip-floating.png", ["gossip-floating.png", "image/png"]],
  [
    "/fonts/bricolage-grotesque.ttf",
    ["fonts/bricolage-grotesque.ttf", "font/ttf"],
  ],
]);
const port = Number(process.env.PORT || 43848);
const server = createServer(async (request, response) => {
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  );
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "no-referrer");
  response.setHeader("Cache-Control", "no-store");
  const file = files.get(new URL(request.url, "http://localhost").pathname);
  if (!file || !["GET", "HEAD"].includes(request.method)) {
    response.writeHead(404).end("Not found");
    return;
  }
  try {
    const content = await readFile(new URL(file[0], publicRoot));
    response.writeHead(200, { "Content-Type": `${file[1]}; charset=utf-8` });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch {
    response.writeHead(500).end("Page unavailable");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Gossip preview: http://127.0.0.1:${server.address().port}`),
);
