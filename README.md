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
