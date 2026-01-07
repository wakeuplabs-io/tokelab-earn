/**
 * usePagination Hook
 * Manages pagination state with automatic reset on filter changes
 */

import { useState, useCallback } from "react";

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface UsePaginationOptions {
  /** Items per page */
  limit?: number;
  /** Initial page */
  initialPage?: number;
}

export interface UsePaginationReturn {
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Set page number */
  setPage: (page: number) => void;
  /** Reset page to 1 (call when filters change) */
  resetPage: () => void;
  /** Get pagination object from API response or default */
  getPagination: (data: { pagination?: Pagination } | undefined) => Pagination;
}

const DEFAULT_PAGINATION: Pagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
};

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { limit = 10, initialPage = 1 } = options;
  const [page, setPageState] = useState(initialPage);

  const setPage = useCallback((newPage: number) => {
    setPageState(newPage);
  }, []);

  const resetPage = useCallback(() => {
    setPageState(1);
  }, []);

  const getPagination = useCallback(
    (data: { pagination?: Pagination } | undefined): Pagination => {
      return data?.pagination ?? { ...DEFAULT_PAGINATION, limit };
    },
    [limit]
  );

  return {
    page,
    limit,
    setPage,
    resetPage,
    getPagination,
  };
}
