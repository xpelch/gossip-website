import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { once } from "node:events";

const root = new URL("./public/", import.meta.url);
const pages = ["index.html", "connect.html"];
const canonicalOrigin = "https://gossip-website.vercel.app";
const agentKitRepository = "https://github.com/gossip-dev/gossip";
const engineRepository = "https://github.com/xpelch/sherwood";
const agentKitRevision = "7fa6e4efaa262cd8180ab2a434300c9d61a13809";
const canonicalPages = [
  {
    file: "index.html",
    path: "/",
    title: "Gossip — Good intel travels.",
    description:
      "Gossip connects AI agents to onchain intelligence. Ask better questions, contribute private observations and earn deeper analysis. Powered by Sherwood.",
  },
  {
    file: "connect.html",
    path: "/connect.html",
    title: "Connect your agent — Gossip",
    description:
      "Connect your AI agent to the Gossip v2 preview with protected wallet signing and explicit production acceptance status.",
  },
];
const previewFiles = [
  ["/", "text/html"],
  ["/connect.html", "text/html"],
  ["/styles.css", "text/css"],
  ["/guide.js", "text/javascript"],
  ["/availability.json", "application/json"],
  ["/site.webmanifest", "application/manifest+json"],
  ["/robots.txt", "text/plain"],
  ["/sitemap.xml", "application/xml"],
  ["/gossip-mark.svg", "image/svg+xml"],
  ["/gossip-signal.png", "image/png"],
  ["/gossip-floating.png", "image/png"],
  ["/assets/gossip-social.jpg", "image/jpeg"],
  ["/assets/gossip-hero.webp", "image/webp"],
  ["/assets/gossip-hero-small.webp", "image/webp"],
  ["/favicon.ico", "image/x-icon"],
  ["/favicon-32.png", "image/png"],
  ["/apple-touch-icon.png", "image/png"],
  ["/icon-192.png", "image/png"],
  ["/icon-512.png", "image/png"],
  ["/fonts/bricolage-grotesque.ttf", "font/ttf"],
];
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
const expectedContentSecurityPolicy =
  "default-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'";

async function readPublic(name) {
  return readFile(new URL(name, root), "utf8");
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match?.[2] ?? null;
}

function getMetaContent(html, name) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => {
    const property = getAttribute(candidate, "property");
    const named = getAttribute(candidate, "name");
    return property === name || named === name;
  });
  return tag ? getAttribute(tag, "content") : null;
}

function getLinkHref(html, rel) {
  return getLinkHrefs(html, rel)[0] ?? null;
}

function getLinkHrefs(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  return tags
    .filter((candidate) =>
      (getAttribute(candidate, "rel") ?? "")
        .toLowerCase()
        .split(/\s+/)
        .includes(rel),
    )
    .map((candidate) => getAttribute(candidate, "href"))
    .filter((href) => href !== null);
}

function resolvePublicPath(href, pagePath) {
  return new URL(href, `${canonicalOrigin}${pagePath}`).pathname;
}

function readPngDimensions(image) {
  assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(image.subarray(12, 16).toString("ascii"), "IHDR");
  return { width: image.readUInt32BE(16), height: image.readUInt32BE(20) };
}

function readJpegDimensions(image) {
  assert.equal(image.subarray(0, 2).toString("hex"), "ffd8");
  let offset = 2;
  while (offset + 9 < image.length) {
    if (image[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = image[offset + 1];
    offset += 2;
    if (marker === 0xd8 || marker === 0xd9) {
      continue;
    }

    const segmentLength = image.readUInt16BE(offset);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return {
        height: image.readUInt16BE(offset + 3),
        width: image.readUInt16BE(offset + 5),
      };
    }
    offset += segmentLength;
  }
  assert.fail("JPEG dimensions are missing");
}

test("Gossip availability exposes the reachable public v2 boundary", async () => {
  const availability = JSON.parse(await readPublic("availability.json"));
  assert.equal(availability.brand, "Gossip");
  assert.equal(availability.engine, "Sherwood");
  assert.equal(availability.agentKitRevision, agentKitRevision);
  assert.equal(availability.agentKitArtifactSha256, null);
  assert.equal(availability.agentKitInstallMode, "source-pinned");
  assert.equal(availability.status, "public-gateway-reachable");
  assert.equal(availability.endpoint, "https://api.gossip-protocol.xyz/mcp");
  assert.equal(
    availability.capabilitiesEndpoint,
    "https://api.gossip-protocol.xyz/v2/gossip/capabilities",
  );
  assert.equal(availability.audience, "https://api.gossip-protocol.xyz/");
  assert.equal(
    availability.sourceRevision,
    "6d08cacab6b436c7574f8dfd5b5b8794eb302aeb",
  );
  assert.equal(availability.diagnosticVerifiedAt, "2026-09-13T03:16:23Z");
  assert.equal(availability.productionVerified, false);
  assert.equal(availability.hostAcceptanceVerified, false);
  assert.equal(availability.developmentTarget, "http://127.0.0.1:18080/mcp");
  assert.equal(
    availability.developmentTargetAudience,
    "http://127.0.0.1:18080/",
  );
  assert.equal(availability.developmentTargetVerified, false);
  assert.equal(availability.protocol, "gossip/2-draft.1");
  assert.equal(availability.schemaRevision, "2026-09-09");
  assert.equal(availability.mcpRevision, "2025-11-25");
  assert.equal(availability.authentication, "gossip-eip191-v2");
  assert.equal(availability.walletType, "eoa");
  assert.equal(availability.chainId, 4663);
  assert.equal(availability.rpc, "https://robinhood-rpc.publicnode.com");
  assert.deepEqual(availability.diagnosticChecks, {
    capabilities: 200,
    mcpInitialize: 200,
    mcpToolsList: 200,
    replay: 401,
    invalidSignature: 401,
    note: "Diagnostic only; tool listing is discovery only.",
  });
  assert.deepEqual(
    Object.fromEntries(
      availability.features.map(({ capability, status }) => [
        capability,
        status,
      ]),
    ),
    {
      http: "installed",
      durable_operations: "installed",
      atomic_consult: "blocked",
      signed_receipts: "blocked",
      evidence: "blocked",
      public_submission: "blocked",
      private_submission: "blocked",
      session_keys: "not_applicable",
      tasks: "not_applicable",
    },
  );
  assert.deepEqual(availability.tools, [
    "gossip_capabilities",
    "gossip_consult_v2",
    "gossip_submit_v2",
    "gossip_operation",
    "gossip_receipt_v2",
    "gossip_feedback",
  ]);
  const guide = await readPublic("connect.html");
  const recordMatch = guide.match(
    /<pre id="connection-record">([\s\S]*?)<\/pre\s*>/,
  );
  assert.ok(recordMatch, "guide connection record is missing");
  const record = JSON.parse(recordMatch[1]);
  assert.equal(record.endpoint, availability.endpoint);
  assert.equal(record.audience, availability.audience);
  assert.equal(record.development_target, availability.developmentTarget);
  assert.equal(
    record.development_target_audience,
    availability.developmentTargetAudience,
  );
  assert.equal(record.developmentTargetVerified, false);
  assert.equal(record.transport, availability.transport);
  assert.equal(record.protocol, availability.protocol);
  assert.equal(record.schema_revision, availability.schemaRevision);
  assert.equal(record.authentication, availability.authentication);
  assert.equal(record.wallet_type, availability.walletType);
  assert.equal(record.chain_id, availability.chainId);
  assert.equal(record.productionVerified, false);
  assert.equal(record.hostAcceptanceVerified, false);
  assert.match(guide, /gossip-eip191-v2/i);
  assert.match(guide, /production\s+acceptance/i);
});

test("installation prompt pins the safe Gossip v2 host and wallet flow", async () => {
  const guide = await readPublic("connect.html");
  const promptMatch = guide.match(
    /<pre\s+id="agent-prompt"[^>]*>([\s\S]*?)<\/pre\s*>/,
  );
  assert.ok(promptMatch, "agent setup prompt is missing");
  const prompt = promptMatch[1];

  assert.match(prompt, /Repository: https:\/\/gossip-protocol\.xyz\/gossip/u);
  assert.doesNotMatch(prompt, /xpelch/iu);
  assert.match(
    prompt,
    new RegExp(`Pinned public source commit: ${agentKitRevision}`),
  );
  assert.match(guide, /prompt-tab-general/u);
  assert.match(guide, /prompt-tab-grok/u);
  assert.match(guide, /prompt-tab-hermes/u);
  assert.match(guide, /prompt-tab-openclaw/u);
  assert.match(prompt, /Existing Gossip identity/u);
  assert.match(prompt, /Existing wallet elsewhere/u);
  assert.match(prompt, /Fresh identity/u);
  assert.match(prompt, /Do not pause for another confirmation/u);
  assert.match(prompt, /--profile gossip-eip191-v2/u);
  assert.match(prompt, /gossip\/2-draft\.1/u);
  assert.match(prompt, /gossip_capabilities/u);
  assert.match(
    prompt,
    /six-tool v2 surface|gossip_capabilities.*gossip_feedback/u,
  );
  assert.match(prompt, /Respect each tool's reported capability state/u);
  assert.match(
    prompt,
    /Public MCP endpoint: https:\/\/api\.gossip-protocol\.xyz\/mcp/u,
  );
  assert.match(
    prompt,
    /Capabilities endpoint: https:\/\/api\.gossip-protocol\.xyz\/v2\/gossip\/capabilities/u,
  );
  assert.match(
    prompt,
    /Exact signing audience: https:\/\/api\.gossip-protocol\.xyz\//u,
  );
  assert.match(prompt, /https:\/\/robinhood-rpc\.publicnode\.com/u);
  assert.match(
    prompt,
    /never print, request, paste or copy a seed phrase, private key/iu,
  );
  assert.match(prompt, /Gossip does not enable trading/u);
  assert.match(
    prompt,
    /productionVerified to false unless a signed production request and clean host acceptance/u,
  );
  assert.doesNotMatch(
    prompt,
    /067ee0|sherwood-eip191-personal-sign-v1|engine-production-c4d8|only after I approve/u,
  );
});

test("prompt tabs keep every host prompt readable without JavaScript", async () => {
  const guide = await readPublic("connect.html");
  const tabs = [...guide.matchAll(/<button\b[^>]*\brole="tab"[^>]*>/gu)];
  assert.equal(tabs.length, 4);
  for (const tab of tabs) {
    assert.match(tab[0], /aria-selected="(?:true|false)"/u);
    assert.match(tab[0], /tabindex="-?\d+"/u);
    assert.match(tab[0], /aria-controls="[^"]+"/u);
  }
  for (const id of [
    "agent-prompt",
    "prompt-panel-grok",
    "prompt-panel-hermes",
    "prompt-panel-openclaw",
  ]) {
    const panel = guide.match(
      new RegExp('<pre\\s+id="' + id + '"[^>]*>([\\s\\S]*?)<\\/pre', "u"),
    );
    assert.ok(panel?.[1].trim(), `${id} must be readable without JavaScript`);
    assert.match(panel[1], /npm ci --ignore-scripts/u);
    assert.match(panel[1], /npm run build/u);
    assert.match(panel[1], /npm run typecheck/u);
    assert.match(panel[1], /node dist\/cli\.js doctor/u);
  }
  assert.match(await readPublic("guide.js"), /activePromptPanel/u);
});

test("public GitHub links stay within the canonical Gossip repository", async () => {
  for (const page of canonicalPages) {
    const html = await readPublic(page.file);
    const githubLinks = [
      ...html.matchAll(/href="(https:\/\/github\.com\/[^\"]+)"/gi),
    ].map((match) => match[1]);

    for (const link of githubLinks) {
      assert.ok(
        link === agentKitRepository ||
          link.startsWith(`${agentKitRepository}/`) ||
          link === engineRepository ||
          link.startsWith(`${engineRepository}/`),
        `${page.file} links outside the Gossip and Sherwood repositories: ${link}`,
      );
    }
  }
});

test("canonical pages expose the required sharing and install metadata", async () => {
  for (const page of canonicalPages) {
    const html = await readPublic(page.file);
    const canonicalUrl = `${canonicalOrigin}${page.path}`;

    assert.equal(getLinkHref(html, "canonical"), canonicalUrl);
    assert.equal(getMetaContent(html, "description"), page.description);
    assert.equal(getMetaContent(html, "theme-color"), "#11100f");
    assert.equal(
      html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim(),
      page.title,
    );

    for (const [property, expected] of [
      ["og:title", page.title],
      ["og:description", page.description],
      ["og:url", canonicalUrl],
      ["og:type", "website"],
      ["og:site_name", "Gossip"],
      ["og:locale", "en_US"],
      ["og:image", `${canonicalOrigin}/assets/gossip-social.jpg`],
      ["og:image:secure_url", `${canonicalOrigin}/assets/gossip-social.jpg`],
      ["og:image:type", "image/jpeg"],
      ["og:image:width", "1200"],
      ["og:image:height", "630"],
    ]) {
      assert.equal(
        getMetaContent(html, property),
        expected,
        `${page.file}: ${property}`,
      );
    }
    assert.ok(
      getMetaContent(html, "og:image:alt"),
      `${page.file}: og:image:alt`,
    );

    for (const [name, expected] of [
      ["twitter:card", "summary_large_image"],
      ["twitter:title", page.title],
      ["twitter:description", page.description],
      ["twitter:image", `${canonicalOrigin}/assets/gossip-social.jpg`],
    ]) {
      assert.equal(
        getMetaContent(html, name),
        expected,
        `${page.file}: ${name}`,
      );
    }
    assert.ok(
      getMetaContent(html, "twitter:image:alt"),
      `${page.file}: twitter:image:alt`,
    );

    for (const [rel, expected] of [
      ["icon", "/favicon.ico"],
      ["apple-touch-icon", "/apple-touch-icon.png"],
      ["manifest", "/site.webmanifest"],
    ]) {
      const href = getLinkHref(html, rel);
      assert.ok(href, `${page.file}: ${rel} link is missing`);
      assert.equal(
        resolvePublicPath(href, page.path),
        expected,
        `${page.file}: ${rel}`,
      );
    }
    assert.deepEqual(
      getLinkHrefs(html, "icon")
        .map((href) => resolvePublicPath(href, page.path))
        .sort(),
      ["/favicon-32.png", "/favicon.ico", "/gossip-mark.svg"].sort(),
      `${page.file}: favicon links`,
    );
  }
});

test("metadata files contain the canonical crawl and install contracts", async () => {
  const manifest = JSON.parse(await readPublic("site.webmanifest"));
  assert.equal(manifest.name, "Gossip");
  assert.equal(manifest.short_name, "Gossip");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.equal(manifest.display, "browser");
  assert.equal(manifest.background_color, "#11100f");
  assert.equal(manifest.theme_color, "#11100f");
  assert.deepEqual(manifest.icons, [
    {
      src: "/icon-192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any",
    },
    {
      src: "/icon-512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any",
    },
  ]);
  assert.doesNotMatch(JSON.stringify(manifest), /maskable/i);

  const robots = await readPublic("robots.txt");
  assert.match(robots, /^User-agent:\s*\*\s*$/m);
  assert.match(robots, /^Allow:\s*\/\s*$/m);
  assert.match(
    robots,
    /^Sitemap:\s*https:\/\/gossip-website\.vercel\.app\/sitemap\.xml\s*$/m,
  );

  const sitemap = await readPublic("sitemap.xml");
  const locations = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(locations, [
    `${canonicalOrigin}/`,
    `${canonicalOrigin}/connect.html`,
  ]);
  assert.equal(locations.length, 2);
  assert.equal((sitemap.match(/<url\b/g) ?? []).length, 2);
});

test("new public assets have expected signatures and dimensions", async () => {
  const pngAssets = [
    ["favicon-32.png", 32, 32],
    ["apple-touch-icon.png", 180, 180],
    ["icon-192.png", 192, 192],
    ["icon-512.png", 512, 512],
  ];
  for (const [name, width, height] of pngAssets) {
    const dimensions = readPngDimensions(await readFile(new URL(name, root)));
    assert.deepEqual(dimensions, { width, height }, name);
  }

  const socialImage = await readFile(new URL("assets/gossip-social.jpg", root));
  assert.deepEqual(readJpegDimensions(socialImage), {
    width: 1200,
    height: 630,
  });
  for (const name of [
    "assets/gossip-hero.webp",
    "assets/gossip-hero-small.webp",
  ]) {
    const image = await readFile(new URL(name, root));
    assert.equal(image.subarray(0, 4).toString("ascii"), "RIFF", name);
    assert.equal(image.subarray(8, 12).toString("ascii"), "WEBP", name);
  }

  const favicon = await readFile(new URL("favicon.ico", root));
  assert.equal(favicon.readUInt16LE(0), 0);
  assert.equal(favicon.readUInt16LE(2), 1);
});

test("public pages contain no intake or private route and internal links resolve", async () => {
  const htmlByPage = Object.fromEntries(
    await Promise.all(
      pages.map(async (page) => [page, await readPublic(page)]),
    ),
  );
  const files = new Set(previewFiles.map(([path]) => path));
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
    for (const [path, expectedType] of previewFiles) {
      const response = await fetch(url + path);
      assert.equal(response.status, 200, path);
      const expectedContentType = textMimeTypes.has(expectedType)
        ? `${expectedType}; charset=utf-8`
        : expectedType;
      assert.equal(
        response.headers.get("content-type"),
        expectedContentType,
        path,
      );
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(
        response.headers.get("content-security-policy"),
        expectedContentSecurityPolicy,
      );
      assert.equal(response.headers.get("x-content-type-options"), "nosniff");
      assert.equal(response.headers.get("referrer-policy"), "no-referrer");
    }
    for (const path of [
      "/server.mjs",
      "/.env",
      "/%2e%2e/README.md",
      "/assets/%2e%2e/server.mjs",
      "/assets/..%2fserver.mjs",
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

test("hero uses responsive mascot artwork and the display font is self-hosted", async () => {
  const home = await readPublic("index.html");
  assert.match(home, /src="assets\/gossip-hero\.webp"/);
  const sourceSet = home.match(/srcset="([^"]+)"/)?.[1];
  assert.equal(
    sourceSet?.trim().replace(/\s+/g, " "),
    "assets/gossip-hero-small.webp 768w, assets/gossip-hero.webp 1536w",
  );
  assert.doesNotMatch(home, /gossip-floating\.png|gossip-signal\.png/);

  const font = await readFile(new URL("fonts/bricolage-grotesque.ttf", root));
  assert.equal(font.readUInt32BE(0), 0x00010000);
  assert.match(await readPublic("fonts/OFL.txt"), /SIL OPEN FONT LICENSE/);
});
