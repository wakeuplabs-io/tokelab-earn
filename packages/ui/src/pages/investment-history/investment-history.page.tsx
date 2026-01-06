/**
 * Investment History Page
 * Admin page for viewing all investments with filters and pagination
 */

import { useState, useEffect } from "react";
import { useInvestments } from "../../hooks/api/useInvestments";
import { Button } from "../../components/ui/button";
import { Card, CardBody } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Loading } from "../../components/feedback/loading";
import { ErrorMessage } from "../../components/feedback/error-message";
import { HiOutlineSearch, HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import type { InvestmentStatus, InvestmentModelType, Investment } from "../../domain/entities/investment";

/**
 * Format date to DD/MM/YYYY
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format number with thousand separators
 */
function formatNumber(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

/**
 * Get badge styles for status
 */
function getStatusBadge(status: InvestmentStatus): { label: string; dotColor: string } {
  const statusMap: Record<InvestmentStatus, { label: string; dotColor: string }> = {
    ACTIVE: { label: "Activo", dotColor: "bg-emerald-500" },
    COMPLETED: { label: "Finalizado", dotColor: "bg-slate-400" },
    CANCELLED: { label: "Cancelado", dotColor: "bg-red-500" },
  };
  return statusMap[status];
}

/**
 * Get model type label
 */
function getModelTypeLabel(modelType: InvestmentModelType): string {
  return modelType === "FIXED" ? "Fijo" : "Variable";
}

export function InvestmentHistoryPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<InvestmentStatus | "">("");
  const [modelType, setModelType] = useState<InvestmentModelType | "">("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, refetch } = useInvestments({
    page,
    limit: 10,
    search: debouncedSearch || undefined,
    status: status || undefined,
    modelType: modelType || undefined,
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as InvestmentStatus | "");
    setPage(1);
  };

  const handleModelTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModelType(e.target.value as InvestmentModelType | "");
    setPage(1);
  };

  const investments = data?.data ?? [];
  const pagination = data?.pagination ?? { total: 0, page: 1, limit: 10, pages: 0 };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Search - Left side */}
        <div className="w-[280px]">
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<HiOutlineSearch className="w-5 h-5" />}
          />
        </div>

        {/* Filters - Right side */}
        <div className="flex items-center gap-3">
          {/* Date picker placeholder */}
          <Button variant="outline" size="sm">
            <HiOutlineCalendar className="w-5 h-5 mr-2" />
            Filtrar por fecha
          </Button>

          {/* Status filter */}
          <select
            className="select select-bordered select-sm"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="">Filtrar por estado</option>
            <option value="ACTIVE">Activo</option>
            <option value="COMPLETED">Finalizado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>

          {/* Model type filter */}
          <select
            className="select select-bordered select-sm"
            value={modelType}
            onChange={handleModelTypeChange}
          >
            <option value="">Filtrar por modelo</option>
            <option value="FIXED">Fijo</option>
            <option value="VARIABLE">Variable</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <CardBody className="p-0">
          {isLoading ? (
            <div className="p-8">
              <Loading message="Cargando inversiones..." />
            </div>
          ) : error ? (
            <div className="p-8">
              <ErrorMessage error={error} onRetry={() => refetch()} />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="border-b border-base-300">
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3">Usuario</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3">Estado</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3">Modelo</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3">Inicio</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3">Fin</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase px-4 py-3">APR/RM</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase text-right px-4 py-3">Invertido</th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase text-right px-4 py-3">
                      <span className="block">Ganancia</span>
                      <span className="block">Acumulada</span>
                    </th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase text-right px-4 py-3">
                      <span className="block">Días para</span>
                      <span className="block">cobrar</span>
                    </th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase text-right px-4 py-3">
                      <span className="block">Disponible</span>
                      <span className="block">para reclamar</span>
                    </th>
                    <th className="bg-base-200/50 text-xs font-medium text-base-content/50 uppercase text-right px-4 py-3">
                      <span className="block">Total</span>
                      <span className="block">Reclamado</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {investments.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8 text-base-content/60">
                        No se encontraron inversiones
                      </td>
                    </tr>
                  ) : (
                    investments.map((investment: Investment) => {
                      const statusBadge = getStatusBadge(investment.status);
                      return (
                        <tr key={investment.id} className="border-b border-base-200 hover:bg-base-50">
                          <td className="text-sm px-4 py-4">{investment.userEmail}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border-2 border-base-300 bg-white text-base-content">
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${statusBadge.dotColor}`}></span>
                              {statusBadge.label}
                            </span>
                          </td>
                          <td className="text-sm px-4 py-4">{getModelTypeLabel(investment.modelType)}</td>
                          <td className="text-sm px-4 py-4">{formatDate(investment.startDate)}</td>
                          <td className="text-sm px-4 py-4">{formatDate(investment.endDate)}</td>
                          <td className="text-sm px-4 py-4">{investment.currentAPR ? `${investment.currentAPR}%` : "-"}</td>
                          <td className="text-sm text-right px-4 py-4">{formatNumber(investment.initialAmount)}</td>
                          <td className="text-sm text-right px-4 py-4">{formatNumber(investment.accruedYield)}</td>
                          <td className="text-sm text-right px-4 py-4">{investment.daysToCollect}</td>
                          <td className="text-sm text-right px-4 py-4">{formatNumber(investment.availableToClaim)}</td>
                          <td className="text-sm text-right px-4 py-4">{formatNumber(investment.totalClaimed)}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center p-4 border-t border-base-300">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
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
                      onClick={() => setPage(p as number)}
                    >
                      {p}
                    </button>
                  )
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
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
    </div>
  );
}

/**
 * Generate page numbers for pagination
 */
function generatePageNumbers(currentPage: number, totalPages: number): (number | string)[] {
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
