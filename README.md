# AtCoder MCP Server

[简体中文](README.zh-CN.md)

Find and read past AtCoder problems through MCP, locally or over hosted HTTP.

## Quick Start

Add the hosted server to your MCP configuration:

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

The endpoint accepts anonymous read requests. It does not need an API key, Cookie, or judge account.

Then ask:

```text
Fetch AtCoder problem abc086_a and show its samples.
```

## What It Can Do

| Tool | Purpose |
| --- | --- |
| `oj_capabilities` | Report the available AtCoder read operations and transport. |
| `oj_health` | Report process readiness and the latest upstream read. |
| `oj_fetch_problem` | Fetch one past problem by canonical URL or contest/task id. |
| `oj_search_problems` | Resolve an exact task URL or contest/task identifier. |

## Run Locally

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

Tagged GitHub releases attach a standalone npm tarball.

## Availability

- Hosted MCP: `https://api.ksrnyx.top/oj-mcp/atcoder/mcp`
- Official MCP Registry: `io.github.ketherworks/atcoder`, described by [`server.json`](server.json)
- Health status: see the repository homepage or call `oj_health`

## Source and Safety

This standalone release is generated from the reviewed
[Competitive Programming MCP source](https://github.com/ketherworks/competitive-programming-mcp/tree/a63a43780d866804c88a938849f92558f08fe403/packages/atcoder).
The release package bundles the shared OJ contract implementation, so its runtime does not depend
on unpublished workspace packages.

## Platform Rules

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
