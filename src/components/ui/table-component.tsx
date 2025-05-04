"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JSX } from "react";
import { Loader2 } from "lucide-react";

type Column<T> = {
  header: string | JSX.Element;
  accessor: keyof T | string;
  sortable?: boolean;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | any;
  sortConfig?: { key: string; direction: "asc" | "desc" | undefined };
  isLoading?: boolean;
}

export function DataTable<
  T extends Record<string, string | number | boolean | JSX.Element>
>({ columns, data, isLoading }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col, i) => (
            <TableHead key={i} onClick={() => col.sortable}>
              <div className="flex gap-1 items-center cursor-pointer">
                <span>{col.header}</span>
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-6">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="animate-spin w-6 h-6" />
                <span className="text-sm">Loading data...</span>
              </div>
            </TableCell>
          </TableRow>
        ) : data?.length == 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-6">
              <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <span className="text-sm font-normal text-black">
                  Data Tidak Tersedia
                </span>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          data?.map((row: any, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {columns.map((col, colIndex) => (
                <TableCell key={colIndex}>
                  {row[col.accessor as keyof T] ?? "-"}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
