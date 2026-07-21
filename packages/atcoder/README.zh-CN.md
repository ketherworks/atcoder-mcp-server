# AtCoder MCP Server

[English](README.md)

通过 MCP 查找并读取 AtCoder 历史题目，可直接连接公共服务，也可以在本地运行。

## 快速开始

把公共服务加入 MCP 配置：

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

配置后可以直接说：

```text
获取 AtCoder abc086_a 的题面、样例和限制。
```

该地址只处理匿名读取，不需要 API Key、Cookie 或 OJ 账号。

## 能做什么

| 工具 | 用途 |
| --- | --- |
| `oj_capabilities` | 报告当前可用的 AtCoder 读取能力和传输方式。 |
| `oj_health` | 报告进程状态和最近一次上游读取结果。 |
| `oj_fetch_problem` | 按规范 URL 或比赛号/题号读取一道历史题目。 |
| `oj_search_problems` | 解析准确的题目 URL 或比赛号/题号。 |

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm ci
npm run check
npm run build
node packages/atcoder/dist/index.js
```

从源码目录启动时的 MCP 配置：

```json
{
  "servers": {
    "atcoder": {
      "type": "stdio",
      "command": "node",
      "args": ["C:/替换为实际路径/packages/atcoder/dist/index.js"]
    }
  }
}
```

带版本号的 GitHub Release 会附带独立 npm 压缩包。

## 服务地址

- 公共 MCP：`https://api.ksrnyx.top/oj-mcp/atcoder/mcp`
- 官方 MCP Registry：`io.github.ketherworks/atcoder`，定义见 [`server.json`](../../server.json)
- 健康状态：查看仓库主页，或调用 `oj_health`

## 来源与安全

该独立仓库由经过审阅的
[Competitive Programming MCP 源码](https://github.com/ketherworks/competitive-programming-mcp/tree/a63a43780d866804c88a938849f92558f08fe403/packages/atcoder)
生成。发布包内含统一 OJ 契约的运行代码，不依赖未发布的工作区包。

服务不提供运行或提交工具，也不接收 OJ 登录凭据。安全边界见
[`SECURITY.md`](../../SECURITY.md)，对应的源代码版本见 [`PROVENANCE.md`](../../PROVENANCE.md)。

## 平台规则

请勿在正在进行的 ABC、ARC 或 AGC 比赛中使用。AtCoder 当前的
[生成式 AI 规则](https://info.atcoder.jp/entry/llm-rules)通常禁止这类使用。
本项目用于历史题目练习，与 AtCoder Inc. 无隶属或背书关系；题目内容遵循
[AtCoder 使用条款](https://atcoder.jp/tos)。

## 开发

```bash
npm ci
npm run check
npm run pack:check
npm run deploy:dry
```

## 许可证

适配器源码使用 MIT 许可证。题目内容和平台商标不因本仓库重新授权。
