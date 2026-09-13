# Historical v1 contract and Gossip v2 handoff

This document originally captured the website's second design revision against
the Gossip v1 wire contract. It is retained for history and must not be used as
the current setup contract. The current copy-paste setup prompt is in
[`public/connect.html`](../public/connect.html), and its machine-readable pins are
in [`public/availability.json`](../public/availability.json).

The current candidate uses the public Gossip Agent Kit source commit
`79475467ce9d412b7d3f47792af96d6e23a395b9`, installed in source-pinned mode,
and the deployed Sherwood engine revision
`rev-2eddeb5d5f03317f411f8a096ba37085b57f3b5f`. The public endpoint is
`https://api.gossip-protocol.xyz/mcp`, its capabilities endpoint is
`https://api.gossip-protocol.xyz/v2/gossip/capabilities`, and its exact
audience is `https://api.gossip-protocol.xyz/`. Diagnostic capabilities and
MCP initialize/tools-list checks returned 200; replay and invalid-signature
checks returned 401. Signed capabilities and MCP acceptance were recorded at
`2026-09-13T16:25:47.977Z`. The live capability record verifies atomic
consultation, durable operations, signed receipts and evidence, with each
feature's evidence revision matching the deployed engine revision. Production
and host acceptance remain false; public and private submissions remain blocked.
The submission persistence check found 0 operations and 0 receipts.

The Grok Bot prompt uses the host's additive `AddMcpServer` agent tool only
after `gossip connect` succeeds. It consumes the exact payload emitted by
`host-config --host grok-bot`, then requires `RestartMcpServers`,
`GetMcpServerStatus`, and `GetDynamicTools` checks. This avoids a guessed Node
path or settings file and does not convert configuration into host acceptance.

## Historical v1 reference

This section records the public Gossip product language and the historical
Sherwood v1 integration contract. **Gossip** is the public brand for the
contribution and agent experience. **Sherwood** is the intelligence engine behind
it: it indexes Robinhood Chain (chain ID `4663`) and supplies the analysis,
readiness, evidence, and privacy boundary.

The historical public agent contract was pinned to immutable Gossip commit
[`067ee0ffc0753bdd0e408931576059075c8cdaf7`](https://github.com/gossip-dev/gossip/tree/067ee0ffc0753bdd0e408931576059075c8cdaf7).
The user reports that MCP and Gossip are plugged in. That report does not by
itself establish the approved public HTTPS origin, audience, deployment flags,
or a live production demonstration; those values must come from deployment
configuration and an authenticated client check.

## Agent connection

For this historical v1 contract, Sherwood exposes a stateless Streamable HTTP MCP
endpoint at `/mcp`. The same wallet request authentication protects `/mcp` and
the REST routes under `/v1/me/agent/`. For local development, the site may show
`https://localhost/mcp` as an unverified target; the actual HTTPS port, trusted
certificate, and configured audience are still required. This is not a detected
production endpoint, and no public production domain exists in the verified
sources.

The implemented route uses a Sherwood-specific EIP-191 `personal_sign` proof for
an externally owned account (EOA), once per HTTP request. It requires:

- `X-Sherwood-Public-Key`: `0x` followed by 65 bytes for an uncompressed secp256k1 public key (`04 || X || Y`).
- `X-Sherwood-Signature`: `r || s || v`, with recovery byte `27` or `28`.
- `X-Sherwood-Nonce`: a fresh lowercase-D GUID.
- `X-Sherwood-Expires`: a future Unix timestamp no more than five minutes ahead.

The signed UTF-8 message is, in order: `Sherwood request v1`, configured
audience, uppercase method, path and query, lowercase SHA-256 body hash, nonce,
and expiry. The EIP-191 Ethereum Signed Message prefix is applied before the
Keccak-256 signature. The exact bytes sent on the wire matter. A transport retry
gets a fresh nonce; a retry of the same logical operation reuses its durable
`client_id`.

This route proves control of the signing address for the configured audience.
It does not approve spending, execute trades, provide custody, or prove that a
Gossip is true. The private key remains with the agent's signer. The implementation
does not claim ERC-8128, OAuth, smart-account, delegated-account, or ERC-8004
compatibility; ERC-8004 registration is optional and is not an entry requirement.

## Implemented MCP tools

Wallet-authenticated callers can use these four contribution tools:

| Tool             | Purpose                                                                                            |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `agent_access`   | Read standard/enriched balances, UTC reset, and `monetary_enabled`.                                |
| `agent_consult`  | Read indexed Token analysis with Readiness; enriched responses may include indexed `early_buyers`. |
| `gossip_submit`  | Submit one private typed Gossip v1 and receive a durable receipt.                                  |
| `gossip_receipt` | Read the contributor's outcome, policy version, allowance, and correction links.                   |

Wallet callers are restricted to these tools so consultation metering cannot be
bypassed through legacy analytics tools. There is no agent-readable raw-Gossip
listing or search tool. The public implementation and its current acceptance
boundaries are documented in the
[Gossip agent kit](https://github.com/gossip-dev/gossip/blob/067ee0ffc0753bdd0e408931576059075c8cdaf7/docs/acceptance.md).

## Gossip v1

`gossip_submit` accepts a snake_case object with required fields
`schema_version: 1`, `client_id`, `chain_id: 4663`, `subject`, `kind`,
`observed_at`, and `provenance`. Supported kinds are:

- `token_discovery`
- `pool_discovery`
- `external_event`
- `trading_experience`

Supported provenance values are `observed`, `relayed`, and `inferred`. Optional
fields are `source`, `transaction_hash`, `claim`, `follows_receipt_id`, and
`follow_up_kind` (`evidence` or `correction`). External events require `source`
and `claim`; trading experience requires `transaction_hash` and `claim`.
Unknown JSON properties are rejected. Subjects are 20-byte addresses, except a
pool subject may also be a 32-byte pool ID. HTTPS sources cannot include user
information.

The implementation bounds a request body at 64 KiB, client IDs at 64
characters, sources at 512 characters, and claims at 2,000 characters. An
observation may be at most 30 days old and five minutes in the future. REST
batch submission accepts one to five entries. A client ID is idempotent for the
same contributor and content; changed content with that ID conflicts. A receipt
is durable and includes status, reason, `policy_version`, earned consultations,
expiry, execution-verification status, and correction/supersession links.

## Access policy and privacy

The current implementation starts each UTC day with five standard
consultations. A useful independently corroborated Gossip can earn up to three
enriched consultations per receipt, capped at fifteen earned consultations per
wallet per day. Enriched analysis adds actual indexed early-buyer data. If that
evidence is unavailable, the response falls back to standard analysis without
spending an earned consultation. `agent_access` is the runtime authority for
the current balance, reset time, and monetary flag; website copy must not turn
these implementation values into an independent quota promise.

Raw Gossip payloads are private to owner-authorized administration and the
personal Telegram bot. A contributor can read its own receipt and outcome, but
not raw content through MCP. Other agents cannot enumerate or read the private
collection. Derived analysis must not expose contributor identity, private
strategy, or identifying excerpts. The current slice makes no monetary payment
or token promise, does not fetch submitted URLs, and does not execute trades.

## Deployment and validation boundary

Source documents the implemented route, headers, wire schema, limits,
authorization boundary, privacy behavior, and implementation policy described
above. Runtime deployment validation must
still prove the approved HTTPS domain/audience, `AgentAccess:Enabled=true`,
operator controls, TLS termination, rate/load limits, and the exact client or
adapter version that can sign these requests. A clean client run must perform a
harmless authenticated query and record the account, capabilities, freshness,
source block, cohort, and Token Readiness.

No real client run or production validation was recorded for this historical
contract. Telegram channel and personal-bot destinations are also deployment
values; test URLs such as `sherwood_test_bot` are fixtures and are not public
Gossip links. Disconnecting a per-request signer means removing its local signing
authorization. Server-side revocation is available only if a deployment adds and
verifies such a mechanism; clearing website state alone is not revocation.
