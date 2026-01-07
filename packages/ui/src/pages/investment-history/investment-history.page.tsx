/**
 * Investment History Page
 * Admin page for viewing all investments with filters and pagination
 */

import { useState, useEffect } from "react";
import { useInvestments } from "../../hooks/api/useInvestments";
import { Input } from "../../components/ui/input";
import { DataTable, type DataTableColumn } from "../../components/ui/data-table";
import { StatusBadge, type DotColor } from "../../components/ui/status-badge";
import { DateRangeFilter, type DateRange } from "../../components/ui/date-range-filter";
import { HiOutlineSearch } from "react-icons/hi";
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<InvestmentStatus | "">("");
  const [modelType, setModelType] = useState<InvestmentModelType | "">("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

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
    dateFrom: dateRange.from || undefined,
    dateTo: dateRange.to || undefined,
  });

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setPage(1);
  };

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
          <Input
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            iconLeft={<HiOutlineSearch className="w-5 h-5" />}
          />
        </div>

        <div className="flex items-center gap-3">
          <DateRangeFilter
            value={dateRange}
            onChange={handleDateRangeChange}
            placeholder="Filtrar por fecha"
          />

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
