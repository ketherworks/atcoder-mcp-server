# AtCoder MCP Server

Find and read past AtCoder problems through MCP, locally or over hosted HTTP.

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

Try it with:

```text
Fetch AtCoder problem abc086_a and show its samples.
```

## Tools

- `oj_capabilities`
- `oj_health`
- `oj_fetch_problem`
- `oj_search_problems`

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

## Source

This standalone release is generated from the reviewed
[Competitive Programming MCP source](https://github.com/ketherworks/competitive-programming-mcp/tree/7f636969f183b1fe09d2c2111a095b1b80fb8a16/packages/atcoder).
The release package bundles the shared OJ contract implementation, so its runtime does not depend
on unpublished workspace packages.

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

Find and read past AtCoder problems from an MCP client. The server returns the statement, samples, limits, sanitized HTML, and source metadata for an exact task URL or contest/task id.

## Quick Start

Use the hosted endpoint without an API key:

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

Then ask:

```text
Fetch AtCoder problem abc086_a and show its samples.
```

For local stdio, build the workspace with Node.js 22 or newer and run `npm start` from this package.

## Tools

- `oj_capabilities`: describes the available AtCoder read operations.
- `oj_health`: reports local readiness and the latest upstream read.
- `oj_fetch_problem`: fetches one canonical task URL or exact contest/task pair.
- `oj_search_problems`: resolves an exact task URL or contest/task identifier.

`oj_fetch_problem` accepts either:

```json
{ "url": "https://atcoder.jp/contests/abc086/tasks/abc086_a?lang=ja" }
```

or:

```json
{ "contestId": "abc086", "taskId": "abc086_a", "locale": "en" }
```

## Practice Use

This project is intended for past-problem practice. Do not use this server during ongoing ABC, ARC, or AGC contests; AtCoder's current [generative-AI rules](https://info.atcoder.jp/entry/llm-rules-en) generally prohibit that use apart from narrowly defined translation.

The adapter is community maintained, unofficial and is not affiliated with or endorsed by AtCoder Inc. Its MIT license covers the adapter source; AtCoder content remains subject to the [AtCoder Terms of Use](https://atcoder.jp/tos?lang=en).

## Implementation

Under the hood, this is an anonymous read-only adapter. The server reads canonical HTTPS task pages on `atcoder.jp`, applies bounded HTML parsing, removes executable markup, and returns structured MCP output. No authentication, code execution, or submission tools are exposed.

The package also includes a stateless Streamable HTTP Worker entrypoint at `/mcp`. Browser origins are denied unless listed in `ATCODER_MCP_ALLOWED_ORIGINS`.

## Security Bounds

- Requests are limited to canonical HTTPS task pages on `atcoder.jp`.
- Redirects stay on the same task and locale and are capped at two.
- Upstream reads have an 8-second timeout and a 2,000,000-byte response limit.
- Worker requests reject JSON-RPC batches and bodies above 65,536 bytes.
- HTML parsing and returned text are bounded; executable markup and unsafe content URLs are removed.
- Unknown page structures fail with `upstream.schema_changed` instead of returning partial statements.

## Development

```sh
npm test
npm run build
npm pack --dry-run --json
wrangler deploy --dry-run
```

Fixture tests do not contact AtCoder or deploy a Worker.

## License

MIT. See `LICENSE`.
