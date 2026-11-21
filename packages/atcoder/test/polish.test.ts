import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { describe, expect, test } from "vitest";
import { AtCoderHtmlClient } from "../src/client.js";
import { AtCoderProvider } from "../src/provider.js";
import { ATCODER_MCP_TOOL_NAMES, createAtCoderMcpServer } from "../src/server.js";

describe("AtCoder standalone polish & hardening", () => {
  test("returns actionable schema validation and exact-lookup microcopy without echoing raw values", async () => {
    const server = createAtCoderMcpServer({ transport: "local_stdio" });
    const client = new Client({ name: "atcoder-validation-test", version: "0.1.0" });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await server.connect(serverTransport);
    await client.connect(clientTransport);

    try {
      const badFetch = await client.callTool({
        name: "oj_fetch_problem",
        arguments: { contestId: "ABC086", taskId: "abc086_a" }
      });
      const badFetchError = badFetch.structuredContent as { code: string; message: string };
      expect(badFetch.isError).toBe(true);
      expect(badFetchError.code).toBe("request.invalid");
      expect(badFetchError.message).toContain("oj_fetch_problem");
      expect(badFetchError.message).toContain("abc086_a");

      const freeTextSearch = await client.callTool({
        name: "oj_search_problems",
        arguments: {
          schemaVersion: "oj.search-request/v1",
          requestId: "req-free-text",
          platform: "atcoder",
          query: "abc086_a",
          limit: 5
        }
      });
      const freeTextError = freeTextSearch.structuredContent as { code: string; message: string };
      expect(freeTextError.code).toBe("request.invalid");
      expect(freeTextError.message).toContain("abc086/abc086_a");
      expect(freeTextError.message).toContain("Free-text keyword search is not supported on AtCoder");

      const badCursor = await client.callTool({
        name: "oj_search_problems",
        arguments: {
          schemaVersion: "oj.search-request/v1",
          requestId: "req-cursor",
          platform: "atcoder",
          query: "abc086/abc086_a",
          limit: 5,
          cursor: "secret-cursor-value"
        }
      });
      const badCursorError = badCursor.structuredContent as { code: string; message: string };
      expect(badCursorError.code).toBe("request.invalid");
      expect(badCursorError.message).toContain("cursor");
      expect(badCursorError.message).not.toContain("secret-cursor-value");

      const unknown = await client.callTool({ name: "unknown_tool", arguments: {} });
      const unknownError = unknown.structuredContent as { code: string; message: string };
      for (const name of ATCODER_MCP_TOOL_NAMES) {
        expect(unknownError.message).toContain(name);
      }
    } finally {
      await client.close();
      await server.close();
    }
  });

  test("enforces timeoutMs even when a response body stream stalls without listening to init.signal", async () => {
    const client = new AtCoderHtmlClient({
      timeoutMs: 25,
      fetchImpl: async () =>
        new Response(
          new ReadableStream({
            start() {
              // Stalled body stream that ignores fetch init.signal.
            }
          }),
          { status: 200, headers: { "Content-Type": "text/html" } }
        )
    });

    await expect(
      client.fetchTask({ contestId: "abc086", taskId: "abc086_a", locale: "en" })
    ).rejects.toMatchObject({
      code: "network.timeout",
      transportCause: "timeout"
    });
  });

  test("honors caller AbortSignal during a stalled response body read without degrading health", async () => {
    const provider = new AtCoderProvider({
      client: new AtCoderHtmlClient({
        timeoutMs: 10_000,
        fetchImpl: async () =>
          new Response(
            new ReadableStream({
              start() {
                // Stalled body stream that never resolves.
              }
            }),
            { status: 200, headers: { "Content-Type": "text/html" } }
          )
      })
    });
    const controller = new AbortController();
    const pending = provider.fetchProblem(
      { contestId: "abc086", taskId: "abc086_a", locale: "en" },
      controller.signal
    );
    setTimeout(() => controller.abort(new DOMException("Cancelled by caller", "AbortError")), 15);

    await expect(pending).rejects.toMatchObject({
      code: "network.timeout",
      transportCause: "consumer_cancelled"
    });
    await expect(provider.getHealth()).resolves.toMatchObject({ overall: "healthy" });
  });

  test("rejects non-positive client timeoutMs and maxResponseBytes bounds", () => {
    expect(() => new AtCoderHtmlClient({ timeoutMs: 0 })).toThrow(RangeError);
    expect(() => new AtCoderHtmlClient({ maxResponseBytes: -1 })).toThrow(RangeError);
  });
});
