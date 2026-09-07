import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";

const root = new URL("./public/", import.meta.url);
const pages = ["index.html", "connect.html"];
async function readPublic(name) {
  return readFile(new URL(name, root), "utf8");
}

test("Gossip availability is local development metadata powered by Sherwood", async () => {
  const availability = JSON.parse(await readPublic("availability.json"));
  assert.equal(availability.brand, "Gossip");
  assert.equal(availability.engine, "Sherwood");
  assert.equal(availability.status, "local-development");
  assert.equal(availability.endpoint, null);
  assert.equal(availability.productionVerified, false);
  assert.equal(availability.developmentTarget, "https://localhost/mcp");
  assert.equal(availability.developmentTargetVerified, false);
  assert.equal(availability.authentication, "sherwood-eip191-personal-sign-v1");
  assert.equal(availability.walletType, "eoa");
  assert.equal(availability.chainId, 4663);
  assert.deepEqual(availability.tools, [
    "agent_access",
    "agent_consult",
    "gossip_submit",
    "gossip_receipt",
  ]);
  const guide = await readPublic("connect.html");
  const recordMatch = guide.match(
    /<pre id="connection-record">([\s\S]*?)<\/pre\s*>/,
  );
  assert.ok(recordMatch, "guide connection record is missing");
  const record = JSON.parse(recordMatch[1]);
  assert.equal(record.endpoint, availability.developmentTarget);
  assert.equal(record.transport, availability.transport);
  assert.equal(record.authentication, availability.authentication);
  assert.equal(record.wallet_type, availability.walletType);
  assert.equal(record.chain_id, availability.chainId);
  assert.match(guide, /EOA personal_sign/i);
  assert.match(guide, /no public\s+deployment is configured/i);
});

test("public pages contain no intake or private route and internal links resolve", async () => {
  const htmlByPage = Object.fromEntries(
    await Promise.all(
      pages.map(async (page) => [page, await readPublic(page)]),
    ),
  );
  const files = new Set([
    "/",
    "/connect.html",
    "/styles.css",
    "/guide.js",
    "/availability.json",
    "/gossip-mark.svg",
    "/gossip-signal.png",
    "/gossip-floating.png",
    "/fonts/bricolage-grotesque.ttf",
  ]);
  for (const [page, html] of Object.entries(htmlByPage)) {
    assert.doesNotMatch(
      html,
      /<form\b|<input\b|name=["'](?:token|password|private)/i,
    );
    assert.doesNotMatch(html, /(?:\/intake|\/private|\/api\/)/i);
    for (const [, href] of html.matchAll(/href=["']([^"']+)["']/gi)) {
      if (/^(?:https?:|mailto:|javascript:)/i.test(href)) continue;
      const [path, fragment] = href.split("#");
      const resolved = new URL(path || page, "http://public.test/").pathname;
      const filePath = resolved === "/index.html" ? "/" : resolved;
      assert.ok(
        files.has(filePath),
        `${page} references missing file ${resolved}`,
      );
      if (fragment) {
        const targetHtml =
          htmlByPage[filePath === "/" ? "index.html" : filePath.slice(1)];
        assert.ok(
          targetHtml && new RegExp(`id=["']${fragment}["']`).test(targetHtml),
          `${page} references missing anchor #${fragment}`,
        );
      }
    }
  }
});

test("preview serves only the public allowlist with restrictive headers", async () => {
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: new URL(".", import.meta.url),
    env: { ...process.env, PORT: "0" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  try {
    const [chunk] = await once(child.stdout, "data");
    const url = String(chunk).match(/http:\/\/127\.0\.0\.1:\d+/)[0];
    for (const path of [
      "/",
      "/connect.html",
      "/styles.css",
      "/guide.js",
      "/availability.json",
      "/gossip-mark.svg",
      "/gossip-signal.png",
      "/gossip-floating.png",
      "/fonts/bricolage-grotesque.ttf",
    ]) {
      const response = await fetch(url + path);
      assert.equal(response.status, 200, path);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.match(
        response.headers.get("content-security-policy"),
        /connect-src 'none'/,
      );
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
    }
    for (const path of [
      "/server.mjs",
      "/.env",
      "/%2e%2e/README.md",
      "/mcp",
      "/intake",
      "/private",
      "/api/health",
    ]) {
      assert.equal((await fetch(url + path)).status, 404, path);
    }
    for (const method of ["POST", "PUT", "DELETE"]) {
      assert.equal(
        (await fetch(url + "/", { method, body: "no intake" })).status,
        404,
        method,
      );
    }
  } finally {
    const exited = once(child, "exit");
    child.kill();
    await exited;
  }
});

test("guide script has no network, credential, or storage behavior", async () => {
  const script = await readPublic("guide.js");
  assert.doesNotMatch(
    script,
    /\b(fetch|XMLHttpRequest|WebSocket|localStorage|sessionStorage)\b/,
  );
  assert.doesNotMatch(script, /privateKey|seedPhrase|password|credential/i);
});

test("floating sculpture has alpha and the display font is self-hosted", async () => {
  const image = await readFile(new URL("gossip-floating.png", root));
  assert.equal(image.subarray(1, 4).toString(), "PNG");
  assert.equal(image[25], 6, "sculpture must retain its RGBA channel");
  const font = await readFile(new URL("fonts/bricolage-grotesque.ttf", root));
  assert.equal(font.readUInt32BE(0), 0x00010000);
  assert.match(await readPublic("fonts/OFL.txt"), /SIL OPEN FONT LICENSE/);
});
