// src/components/ui/table.tsx
import React from "react";

type RowData = Record<string, unknown>;

export type Column<T extends RowData = RowData> = {
  key: string;
  header?: React.ReactNode;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type TableProps<T extends RowData = RowData> = {
  columns: Column<T>[];
  data: T[];
  className?: string;
};

/* -----------------------
   Main Table component
   ----------------------- */
export function Table<T extends RowData = RowData>({
  columns,
  data,
  className = "",
}: TableProps<T>) {
  return (
    <div className={`overflow-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.key} className="px-4 py-2 text-left text-sm font-medium">
                {col.header ?? col.key}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.key} className="px-4 py-2 text-sm">
                  {col.render ? col.render(row) : (row as any)[col.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>
    </div>
  );
}

export default Table;

/* -----------------------
   Small subcomponents
   ----------------------- */

export const TableHeader: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <thead className={`bg-zinc-900 text-white ${className}`}>{children}</thead>;

export const TableHead = TableHeader;

export const TableBody: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>{children}</tbody>;

export const TableRow: React.FC<{ children?: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => <tr className={`${className}`}>{children}</tr>;

export const TableCell: React.FC<
  React.TdHTMLAttributes<HTMLTableCellElement> & { children?: React.ReactNode }
> = ({ children, ...rest }) => <td {...rest}>{children}</td>;
