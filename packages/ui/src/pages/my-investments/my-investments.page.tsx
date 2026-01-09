/**
 * My Investments Page
 * User page for viewing their own investments with filters and pagination
 */

import { useState } from "react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useUserInvestments, useUserInvestmentsSummary } from "../../hooks/api/useUserInvestments";
import { usePagination } from "../../hooks/utils";
import { SearchInput } from "../../components/ui/search-input";
import { SelectFilter } from "../../components/ui/select-filter";
import { DataTable, type DataTableColumn } from "../../components/ui/data-table";
import { StatusBadge } from "../../components/ui/status-badge";
import { DateRangeFilter, type DateRange } from "../../components/ui/date-range-filter";
import { Button } from "../../components/ui/button";
import {
  formatDate,
  formatNumber,
  getInvestmentStatusConfig,
  getModelTypeLabel,
} from "../../lib/format";
import type { InvestmentStatus, InvestmentModelType } from "../../domain/entities/investment";
import type { UserInvestment } from "../../domain/entities/user-investment";

export function MyInvestmentsPage() {
  const [status, setStatus] = useState<InvestmentStatus | "">("");
  const [modelType, setModelType] = useState<InvestmentModelType | "">("");
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });

  const { page, limit, setPage, resetPage, getPagination } = usePagination({ limit: 10 });

  const { data, isLoading, error, refetch } = useUserInvestments({
    page,
    limit,
    status: status || undefined,
    modelType: modelType || undefined,
    dateFrom: dateRange.from || undefined,
    dateTo: dateRange.to || undefined,
  });

  const { data: summary } = useUserInvestmentsSummary();

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

  const columns: DataTableColumn<UserInvestment>[] = [
    {
      key: "status",
      header: "Estado",
      render: (inv) => {
        const config = getInvestmentStatusConfig(inv.status);
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
      key: "currentAPR",
      header: "APR/RM",
      render: (inv) => (inv.currentAPR ? `${inv.currentAPR}%` : "-"),
    },
    {
      key: "endDate",
      header: "Fin",
      render: (inv) => formatDate(inv.endDate),
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
      key: "claimStatus",
      header: (
        <>
          <span className="block">Estado de</span>
          <span className="block">reclamo</span>
        </>
      ),
      render: (inv) => inv.claimStatus,
    },
    {
      key: "action",
      header: "",
      render: (inv) => {
        const isDisabled = inv.status !== "ACTIVE";
        return (
          <button
            disabled={isDisabled}
            className={`px-4 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              isDisabled
                ? "border-base-300 text-base-300 cursor-not-allowed"
                : "border-primary text-primary hover:bg-primary/10 cursor-pointer"
            }`}
          >
            Cancelar
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-[280px]">
          <SearchInput placeholder="Buscar..." debounceDelay={500} />
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

      {/* Summary Card */}
      <div className="bg-white rounded-2xl p-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-base-content/70">
            Disponible para Reclamar
            <div
              className="tooltip tooltip-right"
              data-tip="Fondos disponibles para retirar o reinvertir. Incluye rendimientos disponibles y capital recuperado de inversiones finalizadas."
            >
              <HiOutlineInformationCircle className="w-4 h-4 cursor-help" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {summary ? formatNumber(summary.totalAvailableToClaim) : "0"}{" "}
            {summary?.currency ?? "USDT"}
          </div>
        </div>
        <Button variant="primary" size="sm">
          Reclamar
        </Button>
      </div>

      {/* Table */}
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
