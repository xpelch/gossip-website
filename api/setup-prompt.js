import { createHash, timingSafeEqual } from "node:crypto";

const PROMPT_NAMES = ["general", "grok", "hermes", "openclaw"];
const MAX_PASSWORD_LENGTH = 256;
const MAX_PROMPT_CONFIGURATION_BYTES = 64 * 1024;
const ETHEREUM_ADDRESS_PATTERN = /^0x[0-9a-f]{40}$/iu;

function sendJson(response, status, body) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.status(status).json(body);
}

function readPassword(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return null;
  }

  const { password } = body;
  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > MAX_PASSWORD_LENGTH
  ) {
    return null;
  }

  return password;
}

function passwordMatchesHash(password, expectedHash) {
  if (!/^[0-9a-f]{64}$/iu.test(expectedHash)) {
    return false;
  }

  const normalizedPassword = normalizeAddressPassword(password);
  const actualBytes = createHash("sha256").update(normalizedPassword).digest();
  const expectedBytes = Buffer.from(expectedHash, "hex");

  return timingSafeEqual(actualBytes, expectedBytes);
}

function normalizeAddressPassword(password) {
  const trimmedPassword = password.trim();

  return ETHEREUM_ADDRESS_PATTERN.test(trimmedPassword)
    ? trimmedPassword.toLowerCase()
    : password;
}

function parsePrompts(serializedPrompts) {
  try {
    const prompts = JSON.parse(serializedPrompts);
    const hasEveryPrompt = PROMPT_NAMES.every(
      (name) => typeof prompts[name] === "string" && prompts[name].trim(),
    );

    return hasEveryPrompt ? prompts : null;
  } catch {
    return null;
  }
}

function readPromptConfiguration() {
  const encodedPrompts = process.env.GOSSIP_PROMPTS_BASE64?.trim();
  if (encodedPrompts) {
    try {
      const decoded = Buffer.from(encodedPrompts, "base64");
      const isCanonicalBase64 =
        decoded.length <= MAX_PROMPT_CONFIGURATION_BYTES &&
        decoded.toString("base64") === encodedPrompts;

      return isCanonicalBase64 ? decoded.toString("utf8") : null;
    } catch {
      return null;
    }
  }

  return process.env.GOSSIP_PROMPTS_JSON ?? null;
}

export default function setupPrompt(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, { error: "method_not_allowed" });
    return;
  }

  const expectedPasswordHash = process.env.GOSSIP_PROMPT_PASSWORD_SHA256;
  const serializedPrompts = readPromptConfiguration();
  if (!expectedPasswordHash || !serializedPrompts) {
    sendJson(response, 503, { error: "prompt_access_unavailable" });
    return;
  }

  const password = readPassword(request.body);
  if (!password || !passwordMatchesHash(password, expectedPasswordHash)) {
    sendJson(response, 401, { error: "invalid_password" });
    return;
  }

  const prompts = parsePrompts(serializedPrompts);
  if (!prompts) {
    sendJson(response, 503, { error: "prompt_access_unavailable" });
    return;
  }

  sendJson(response, 200, { prompts });
}
