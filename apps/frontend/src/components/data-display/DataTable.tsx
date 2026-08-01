import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../ui/table.js';
import { Input } from '../ui/input.js';
import { Button } from '../ui/button.js';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { TableSkeleton } from '../feedback/Skeletons.js';
import { EmptyState } from '../feedback/EmptyState.js';

export interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => React.ReactNode);
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
}

export function DataTable<T extends { id?: string | number }>({
  data,
  columns,
  isLoading = false,
  searchPlaceholder = 'Search records...',
  pageSize = 10,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumnIndex, setSortColumnIndex] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  if (isLoading) {
    return <TableSkeleton rows={pageSize} />;
  }

  // Search filtering logic
  const filteredData = data.filter((item) => {
    if (!searchTerm) return true;
    return Object.values(item as Record<string, unknown>).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting logic
  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumnIndex === null) return 0;
    const col = columns[sortColumnIndex];
    let valA: unknown = typeof col.accessorKey === 'function' ? col.accessorKey(a) : a[col.accessorKey];
    let valB: unknown = typeof col.accessorKey === 'function' ? col.accessorKey(b) : b[col.accessorKey];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if ((valA ?? '') < (valB ?? '')) return sortDirection === 'asc' ? -1 : 1;
    if ((valA ?? '') > (valB ?? '')) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (index: number) => {
    if (sortColumnIndex === index) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumnIndex(index);
      setSortDirection('asc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={index}>
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(index)}
                      className="flex items-center gap-1.5 hover:text-foreground font-semibold transition-colors"
                    >
                      {col.header}
                      <ArrowUpDown className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span>{col.header}</span>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 text-center">
                  <EmptyState
                    title="No records found"
                    description="No matching records match your filter criteria."
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow key={row.id ?? rowIndex}>
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {typeof col.accessorKey === 'function'
                        ? col.accessorKey(row)
                        : (row[col.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
          <span>
            Page {currentPage} of {totalPages} ({sortedData.length} records)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
