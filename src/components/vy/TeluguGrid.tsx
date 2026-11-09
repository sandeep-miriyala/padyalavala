"use client";

import { YuktaiGrid, type GridColumn, type YuktaiGridRule } from "@yuktishaalaa/yuktai";
import config from "@config";

// ప్రతి గ్రిడ్‌లోనూ పనిచేసే మాటలు: "అన్నీ", "ఎన్ని".
export function commonRules<T>(noun: string): YuktaiGridRule<T>[] {
  return [
    {
      name: "all",
      phrases: ["అన్నీ", "అన్ని", `అన్ని ${noun}`, "మొత్తం", "show all", "clear"],
      description: "ఫిల్టర్లు తీసేస్తుంది",
      execute: async ({ executeTool }) => (await executeTool("clear_filters")).message,
    },
    {
      name: "count",
      phrases: ["ఎన్ని", `ఎన్ని ${noun}`, "లెక్క", "how many", "count"],
      description: "ఎన్ని ఉన్నాయో చెబుతుంది",
      execute: async ({ executeTool }) => (await executeTool("count")).message,
    },
  ];
}

/** "క తో మొదలయ్యే…" లాంటి మాటల కోసం: ఇచ్చిన అక్షరాలు ఒక్కొక్కటికీ ఒక rule. */
export function startsWithRules<T>(letters: string[], key: keyof T & string, noun: string): YuktaiGridRule<T>[] {
  return letters.map((l) => ({
    name: `starts-${l}`,
    phrases: [`${l} తో మొదలయ్యే ${noun}`, `${l} తో మొదలయ్యేవి`, `${l} తో`, `${l} ${noun}`],
    description: `${l} తో మొదలయ్యేవి`,
    execute: async ({ executeTool }) => (await executeTool("filter", { key, operator: "startsWith", value: l })).message,
  }));
}

type Props<T> = {
  rows: T[];
  columns: GridColumn<T>[];
  rowKey: keyof T & string;
  rules: YuktaiGridRule<T>[];
  toolName: string;
  pageSize?: number;
  onRowClick?: (row: T) => void;
};

/**
 * YuktaiGrid, తెలుగుకి సిద్ధం: వెతుకులాట, వరుస Rust (WebAssembly) లో; గ్రిడ్ AI సహాయకుడు తెలుగు
 * మాటలు అర్థం చేసుకుంటాడు (టైప్ చేసినా, 🎤 తో చెప్పినా); బ్రౌజర్ AI ఏజెంట్లకు గ్రిడ్ పనిముట్లు (WebMCP).
 * అంతా సందర్శకుడి బ్రౌజర్‌లోనే: సర్వర్ లేదు, API key లేదు.
 */
export default function TeluguGrid<T extends Record<string, unknown>>({ rows, columns, rowKey, rules, toolName, pageSize = 10, onRowClick }: Props<T>) {
  return (
    <div lang="te" className="vy-grid">
      <YuktaiGrid<T>
        data={rows}
        columns={columns}
        rowKey={rowKey}
        search
        showSearchTime
        engine={config.engine}
        locale="te-IN"
        inputLanguage="te-IN"
        ai={config.grid.assistant ? { search: true, summary: true, anomaly: true, suggest: true } : false}
        voice={config.grid.voice ? { control: true, language: config.grid.language } : false}
        customRules={rules}
        webmcp={config.grid.webmcp}
        toolName={toolName}
        pagination={{ pageSize }}
        onRowClick={onRowClick}
      />
    </div>
  );
}
