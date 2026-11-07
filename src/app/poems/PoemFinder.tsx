"use client";

import { useRouter } from "next/navigation";
import { YuktaiGrid, type GridColumn } from "@yuktishaalaa/yuktai";

export type Row = { id: string; book: string; bookTitle: string; title: string; first: string };

const columns: GridColumn<Row>[] = [
  { key: "title", label: "శీర్షిక", sortable: true },
  { key: "first", label: "మొదటి పాదం", hiddenOnMobile: true },
  { key: "bookTitle", label: "సంపుటి", type: "badge", sortable: true },
];

/** Every poem in one searchable list (YuktaiGrid). Enter or a click opens the poem. */
export default function PoemFinder({ rows }: { rows: Row[] }) {
  const router = useRouter();
  return (
    <div lang="te">
      <YuktaiGrid<Row>
        data={rows}
        columns={columns}
        rowKey="id"
        search
        locale="te-IN"
        pagination={{ pageSize: 10 }}
        onRowClick={(row) => router.push(`/poems/${row.book}/#${row.id}`)}
      />
    </div>
  );
}
