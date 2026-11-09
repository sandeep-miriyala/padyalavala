"use client";

import { useRouter } from "next/navigation";
import { YuktaiGrid, type GridColumn, type YuktaiGridRule } from "@yuktishaalaa/yuktai";
import config from "@config";

export type Row = { id: string; book: string; bookTitle: string; title: string; first: string; lines: number };

const columns: GridColumn<Row>[] = [
  { key: "title", label: "శీర్షిక", sortable: true },
  { key: "first", label: "మొదటి పాదం", hiddenOnMobile: true },
  { key: "bookTitle", label: "సంపుటి", type: "badge", sortable: true, filterable: true },
  { key: "lines", label: "పాదాలు", type: "number", sortable: true, align: "right" },
];

// The Grid AI Assistant understands these Telugu (and English) phrases. Each one runs the
// grid's own tools (filter, sort, count…): no server, no API key, everything in the browser.
const rules: YuktaiGridRule<Row>[] = [
  {
    name: "mira",
    phrases: ["మిరా పద్యాలు", "మిరా", "mira"],
    description: "Only మిరా పద్యాలు",
    execute: async ({ executeTool }) => (await executeTool("filter", { key: "bookTitle", operator: "contains", value: "మిరా" })).message,
  },
  {
    name: "ratnalabala",
    phrases: ["రత్నాలబాల", "జ్ఞానమాల", "ratnalabala"],
    description: "Only రత్నాలబాల",
    execute: async ({ executeTool }) => (await executeTool("filter", { key: "bookTitle", operator: "contains", value: "రత్నాలబాల" })).message,
  },
  {
    name: "long",
    phrases: ["పెద్ద పద్యాలు", "పొడవైన", "long poems"],
    description: "Longest poems first",
    execute: async ({ executeTool }) => (await executeTool("sort", { key: "lines", direction: "desc" })).message,
  },
  {
    name: "short",
    phrases: ["చిన్న పద్యాలు", "short poems"],
    description: "Shortest poems first",
    execute: async ({ executeTool }) => (await executeTool("sort", { key: "lines", direction: "asc" })).message,
  },
  {
    name: "count",
    phrases: ["ఎన్ని పద్యాలు", "ఎన్ని", "how many"],
    description: "How many poems",
    execute: async ({ executeTool }) => (await executeTool("count")).message,
  },
  {
    name: "all",
    phrases: ["అన్ని పద్యాలు", "అన్నీ", "show all"],
    description: "Remove filters",
    execute: async ({ executeTool }) => (await executeTool("clear_filters")).message,
  },
];

/**
 * Every poem in one YuktaiGrid: search and sort run in Rust (WebAssembly), the Grid AI
 * Assistant takes typed or spoken Telugu, and browser AI agents can use the grid's tools (WebMCP).
 * Enter or a click opens the poem.
 */
export default function PoemFinder({ rows }: { rows: Row[] }) {
  const router = useRouter();
  return (
    <div lang="te">
      <YuktaiGrid<Row>
        data={rows}
        columns={columns}
        rowKey="id"
        search
        showSearchTime
        engine="rust"
        locale="te-IN"
        inputLanguage="te-IN"
        ai={{ search: true, summary: true, anomaly: true, suggest: true }}
        voice={{ control: true, language: "te-IN" }}
        customRules={rules}
        webmcp={config.grid.webmcp}
        toolName="padyalu"
        pagination={{ pageSize: 10 }}
        onRowClick={(row) => router.push(`/poems/${row.book}/#${row.id}`)}
      />
    </div>
  );
}
