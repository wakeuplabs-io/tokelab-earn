/**
 * Investment History Page
 * Admin page for viewing all investments with filters and pagination
 */

import { useState } from "react";
import { useInvestments } from "../../hooks/api/useInvestments";
import { usePagination } from "../../hooks/utils";
import { SearchInput } from "../../components/ui/search-input";
import { SelectFilter } from "../../components/ui/select-filter";
import { DataTable, type DataTableColumn } from "../../components/ui/data-table";
import { StatusBadge, type DotColor } from "../../components/ui/status-badge";
import { DateRangeFilter, type DateRange } from "../../components/ui/date-range-filter";
import { formatDate, formatNumber } from "../../lib/format";
import type {
  InvestmentStatus,
  InvestmentModelType,
  Investment,
} from "../../domain/entities/investment";

/**
 * Get status badge config
 */
function getStatusConfig(status: InvestmentStatus): { label: string; dotColor: DotColor } {
  const statusMap: Record<InvestmentStatus, { label: string; dotColor: DotColor }> = {
    ACTIVE: { label: "Activo", dotColor: "success" },
    COMPLETED: { label: "Finalizado", dotColor: "neutral" },
    CANCELLED: { label: "Cancelado", dotColor: "error" },
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
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<InvestmentStatus | "">("");
  const [modelType, setModelType] = useState<InvestmentModelType | "">("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const { page, limit, setPage, resetPage, getPagination } = usePagination({ limit: 10 });

  const handleSearch = (value: string) => {
    setSearch(value);
    resetPage();
  };

  const { data, isLoading, error, refetch } = useInvestments({
    page,
    limit,
    search: search || undefined,
    status: status || undefined,
    modelType: modelType || undefined,
    dateFrom: dateRange.from || undefined,
    dateTo: dateRange.to || undefined,
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    resetPage();
  };

  const handleStatusChange = (value: InvestmentStatus | "") => {
    setStatus(value);
    resetPage();
  };

  const handleModelTypeChange = (value: InvestmentModelType | "") => {
    setModelType(value);
    resetPage();
  };

  const investments = data?.data ?? [];
  const pagination = getPagination(data);

  const columns: DataTableColumn<Investment>[] = [
    {
      key: "userEmail",
      header: "Usuario",
      render: (inv) => inv.userEmail,
    },
    {
      key: "status",
      header: "Estado",
      render: (inv) => {
        const config = getStatusConfig(inv.status);
        return <StatusBadge dotColor={config.dotColor} label={config.label} />;
      },
    },
    {
      key: "modelType",
      header: "Modelo",
      render: (inv) => getModelTypeLabel(inv.modelType),
    },
    {
      key: "startDate",
      header: "Inicio",
      render: (inv) => formatDate(inv.startDate),
    },
    {
      key: "endDate",
      header: "Fin",
      render: (inv) => formatDate(inv.endDate),
    },
    {
      key: "currentAPR",
      header: "APR/RM",
      render: (inv) => (inv.currentAPR ? `${inv.currentAPR}%` : "-"),
    },
    {
      key: "initialAmount",
      header: "Invertido",
      align: "right",
      render: (inv) => formatNumber(inv.initialAmount),
    },
    {
      key: "accruedYield",
      header: (
        <>
          <span className="block">Ganancia</span>
          <span className="block">Acumulada</span>
        </>
      ),
      align: "right",
      render: (inv) => formatNumber(inv.accruedYield),
    },
    {
      key: "daysToCollect",
      header: (
        <>
          <span className="block">Días para</span>
          <span className="block">cobrar</span>
        </>
      ),
      align: "right",
      render: (inv) => inv.daysToCollect,
    },
    {
      key: "availableToClaim",
      header: (
        <>
          <span className="block">Disponible</span>
          <span className="block">para reclamar</span>
        </>
      ),
      align: "right",
      render: (inv) => formatNumber(inv.availableToClaim),
    },
    {
      key: "totalClaimed",
      header: (
        <>
          <span className="block">Total</span>
          <span className="block">Reclamado</span>
        </>
      ),
      align: "right",
      render: (inv) => formatNumber(inv.totalClaimed),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-[280px]">
          <SearchInput
            placeholder="Buscar..."
            onSearch={handleSearch}
            debounceDelay={500}
          />
        </div>

        <div className="flex items-center gap-3">
          <DateRangeFilter
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Filtrar por fecha"
          />

          <SelectFilter<InvestmentStatus>
            value={status}
            onChange={handleStatusChange}
            placeholder="Filtrar por estado"
            options={[
              { value: "ACTIVE", label: "Activo" },
              { value: "COMPLETED", label: "Finalizado" },
              { value: "CANCELLED", label: "Cancelado" },
            ]}
          />

          <SelectFilter<InvestmentModelType>
            value={modelType}
            onChange={handleModelTypeChange}
            placeholder="Filtrar por modelo"
            options={[
              { value: "FIXED", label: "Fijo" },
              { value: "VARIABLE", label: "Variable" },
            ]}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={investments}
        keyExtractor={(inv) => inv.id}
        isLoading={isLoading}
        loadingMessage="Cargando inversiones..."
        error={error}
        onRetry={() => refetch()}
        emptyMessage="No se encontraron inversiones"
        pagination={pagination}
        onPageChange={setPage}
      />
    </div>
  );
}
