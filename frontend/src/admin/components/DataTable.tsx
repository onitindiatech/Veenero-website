import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  emptyMessage = 'No records found.',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/30 bg-card/40">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow className="hover:bg-transparent border-b border-border/30">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn(
                  "h-10 text-xs font-bold text-muted-foreground uppercase tracking-wider font-sans whitespace-nowrap py-3 px-4",
                  column.className
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground font-sans"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  "border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors duration-150",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column, colIdx) => {
                  const val = column.accessorKey.includes('.')
                    ? undefined // simple support for nested properties if needed, else raw
                    : row[column.accessorKey as keyof T];

                  return (
                    <TableCell
                      key={colIdx}
                      className={cn(
                        "py-3 px-4 text-sm font-sans font-medium text-foreground whitespace-nowrap",
                        column.className
                      )}
                    >
                      {column.cell ? column.cell(row) : (val as React.ReactNode)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
export default DataTable;
