import type { Event } from "@/types/events";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Event>[] = [
  {
    accessorKey: "title",
    header: "Event Name",
    cell: ({ row }) => {
      return <span className="font-semibold">{row.original.title}</span>;
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Date & Time",
    cell: ({ row }) => {
      const dateTime = row.original.start_time;
      return new Date(dateTime).toLocaleString();
    },
  },
  {
    accessorKey: "end_time",
    header: "End Date & Time",
    cell: ({ row }) => {
      const dateTime = row.original.end_time;
      return new Date(dateTime).toLocaleString();
    },
  },
  {
    accessorKey: "summary",
    header: "Description",
    cell: ({ row }) => {
      const summary = row.original.summary;
      return <div className="line-clamp-3">{summary || "-"}</div>;
    },
  },
];
