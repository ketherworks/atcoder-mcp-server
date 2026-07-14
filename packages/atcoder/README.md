# AtCoder Read-Only MCP Server

Audited read-only MCP server for exact AtCoder problem statements and samples.

This is a standalone release workspace generated from the audited
[Kether Works OJ adapter source](https://github.com/ketherworks/oj-mcp-adapters/tree/3f7ee0e040d76f6dd5460d5926d8504c8cb20256/packages/atcoder).
The release package bundles the shared OJ contract implementation, so its runtime does not depend
on unpublished workspace packages.

## Tools

- `oj_capabilities`
- `oj_health`
- `oj_fetch_problem`
- `oj_search_problems`

## Hosted Endpoint

The public anonymous read-only endpoint is:

```json
{
  "servers": {
    "atcoder": {
      "type": "http",
      "url": "https://api.ksrnyx.top/oj-mcp/atcoder/mcp"
    }
  }
}
```

No end-user API key, cookie, or account credential is accepted.

## Local Stdio

Requires Node.js 22 or newer.

```bash
npm ci
npm run check
npm run build
node packages/atcoder/dist/index.js
```

MCP client configuration from a source checkout:

```json
{
  "servers": {
    "atcoder": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/packages/atcoder/dist/index.js"]
    }
  }
}
```

Tagged GitHub releases attach a standalone npm tarball. npm Registry and official MCP Registry
publication are intentionally separate steps and are not claimed until their ownership checks pass.

## Policy

Do not use this server during ongoing ABC, ARC, or AGC contests. AtCoder's current
[generative-AI rules](https://info.atcoder.jp/entry/llm-rules-en) generally prohibit that use.
This project is intended for practice with past problems. It is unofficial and is not affiliated
with or endorsed by AtCoder Inc. Problem content remains subject to the
[AtCoder Terms of Use](https://atcoder.jp/tos?lang=en).

The server exposes no run or submit tool. It accepts no judge account credentials. See
[SECURITY.md](SECURITY.md) for the security boundary and [PROVENANCE.md](PROVENANCE.md) for the
canonical source revision.

## Development

```bash
npm ci
npm run check
npm run pack:check
npm run deploy:dry
```

## License

Adapter source code is MIT licensed. Judge problem content and trademarks are not relicensed by
this repository.


## Provider Implementation Details

An honest, anonymous read-only MCP adapter for public problem pages on the official
`https://atcoder.jp` host. It parses AtCoder HTML rather than pretending the site
offers a problem API.

No authentication, code execution, or submission tools are exposed. The adapter
does not run solutions, read profiles, list submissions, or send code to AtCoder.

## Contest And Content Policy

Do not use this server during ongoing ABC, ARC, or AGC contests. AtCoder's current
[rules against generative AI](https://info.atcoder.jp/entry/llm-rules-en) generally
prohibit generative-AI use during those contests, apart from narrowly defined
translation. This server is intended for practice with past problems.

This adapter is unofficial and is not affiliated with or endorsed by AtCoder Inc.
The MIT license covers this adapter's source code only. AtCoder problem statements
and other service content remain subject to the rights and conditions described in
the [AtCoder Terms of Use](https://atcoder.jp/tos?lang=en).

## Tools

- `oj_capabilities`: reports the audited read surface and unsupported operations.
- `oj_health`: reports local readiness and the latest observed upstream read.
- `oj_fetch_problem`: fetches one canonical task URL or exact contest/task pair.
- `oj_search_problems`: resolves only an exact task URL or contest/task identifier.

`oj_fetch_problem` accepts either:

```json
{ "url": "https://atcoder.jp/contests/abc086/tasks/abc086_a?lang=ja" }
```

or:

```json
{ "contestId": "abc086", "taskId": "abc086_a", "locale": "en" }
```

Exact URL lookup preserves `?lang=ja` unless an explicit locale overrides it.
Free-text search and catalog crawling are intentionally unsupported.

## Runtime

Node.js 22 or newer is required. After installing and building the package, start
the stdio server with:

```sh
npm start
```

The Cloudflare Worker entry is the shipped `dist/worker.js`. `wrangler.jsonc` is
included in the package and configures a stateless Streamable HTTP endpoint at
`/mcp`. Browser origins are denied unless listed in the optional
`ATCODER_MCP_ALLOWED_ORIGINS` comma-separated environment variable.

## Security Bounds

- Upstream requests allow only canonical HTTPS task paths on `atcoder.jp`.
- Redirects remain on the same task and locale and are capped at two.
- Upstream reads time out after 8 seconds and are capped at 2,000,000 bytes.
- Inbound Worker JSON is capped at 65,536 bytes; JSON-RPC batches are rejected.
- Worker admission is capped at eight concurrent MCP requests per isolate.
- A linear preflight bounds potential nodes, depth, and 1,500,000 text bytes before HTML5 DOM allocation;
  the parsed tree is checked again at 25,000 nodes, depth 256, and 1,500,000 decoded characters.
- Executable markup and unsafe content URLs are removed before content is returned.
- Ordinary tasks fail closed when audited statement sections, samples, constraints,
  or complete time and memory limits are missing.

AtCoder can change its page markup. Unknown structures and unknown special-task
notices deliberately return `upstream.schema_changed` instead of partial data.

## Development

```sh
npm test
npm run build
npm pack --dry-run --json
wrangler deploy --dry-run
```

Tests use checked-in fixtures. They do not make live AtCoder requests or deploy a
Worker.

## License

MIT. See `LICENSE`.
