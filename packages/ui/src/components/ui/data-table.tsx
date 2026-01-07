/**
 * DataTable Component
 * A reusable table component with headers, rows, loading, error and empty states
 */

import { ReactNode } from "react";
import { Button } from "./button";
import { Card, CardBody } from "./card";
import { Loading } from "../feedback/loading";
import { ErrorMessage } from "../feedback/error-message";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

export interface DataTableColumn<T> {
  /** Unique key for the column */
  key: string;
  /** Header label */
  header: ReactNode;
  /** Whether the column content should be right-aligned */
  align?: "left" | "center" | "right";
  /** Render function for the cell content */
  render: (item: T) => ReactNode;
}

export interface DataTablePagination {
  page: number;
  pages: number;
  total: number;
  limit: number;
}

export interface DataTableProps<T> {
  /** Array of column definitions */
  columns: DataTableColumn<T>[];
  /** Array of data items */
  data: T[];
  /** Unique key extractor for each row */
  keyExtractor: (item: T) => string;
  /** Loading state */
  isLoading?: boolean;
  /** Loading message */
  loadingMessage?: string;
  /** Error object */
  error?: Error | null;
  /** Retry callback for error state */
  onRetry?: () => void;
  /** Empty state message */
  emptyMessage?: string;
  /** Pagination configuration */
  pagination?: DataTablePagination;
  /** Callback when page changes */
  onPageChange?: (page: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  loadingMessage = "Cargando...",
  error,
  onRetry,
  emptyMessage = "No se encontraron resultados",
  pagination,
  onPageChange,
}: DataTableProps<T>) {
  const getAlignmentClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      default:
        return "";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardBody className="p-0">
        {isLoading ? (
          <div className="p-8">
            <Loading message={loadingMessage} />
          </div>
        ) : error ? (
          <div className="p-8">
            <ErrorMessage error={error} onRetry={onRetry} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-300">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3 ${getAlignmentClass(column.align)}`}
                    >
                      {column.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center py-8 text-base-content/60"
                    >
                      {emptyMessage}
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={keyExtractor(item)}
                      className="border-b border-base-200 hover:bg-base-50"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`text-sm px-4 py-4 ${getAlignmentClass(column.align)}`}
                        >
                          {column.render(item)}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && onPageChange && (
          <div className="flex items-center justify-center p-4 border-t border-base-300">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </Button>
              {generatePageNumbers(pagination.page, pagination.pages).map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-2 text-base-content/60">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-200 text-base-content"
                    }`}
                    onClick={() => onPageChange(p as number)}
                  >
                    {p}
                  </button>
                )
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="gap-1"
              >
                Siguiente
                <HiOutlineChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

/**
 * Generate page numbers for pagination
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number
): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];

  // Always show first page
  pages.push(1);

  if (currentPage > 3) {
    pages.push("...");
  }

  // Show pages around current
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("...");
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}
