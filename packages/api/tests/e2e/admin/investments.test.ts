/**
 * E2E Tests for GET /api/admin/investments
 *
 * Tests pagination, filtering, and response structure
 * Uses seed data: 6 investments total
 * - 4 ACTIVE, 1 COMPLETED, 1 CANCELLED
 * - 5 FIXED, 1 VARIABLE
 * - investor1@example.com: 5 investments
 * - investor2@example.com: 1 investment
 */

import { describe, it, expect } from "vitest";
import { get } from "../../helpers/test-app";
import type { ListInvestmentsResult } from "../../../src/domain/entities/investment";

const ENDPOINT = "/api/admin/investments";

describe("GET /api/admin/investments", () => {
  describe("Paginación", () => {
    it("retorna máximo 10 items con limit=10", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "10",
      });

      expect(response.status).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(10);
      expect(data.pagination.limit).toBe(10);
    });

    it("retorna página 2 correctamente", async () => {
      // First get page 1 with limit 2
      const page1 = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "2",
        page: "1",
      });

      // Then get page 2
      const page2 = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "2",
        page: "2",
      });

      expect(page1.response.status).toBe(200);
      expect(page2.response.status).toBe(200);
      expect(page1.data.pagination.page).toBe(1);
      expect(page2.data.pagination.page).toBe(2);

      // Ensure different data on each page
      if (page1.data.data.length > 0 && page2.data.data.length > 0) {
        expect(page1.data.data[0].id).not.toBe(page2.data.data[0].id);
      }
    });

    it("retorna estructura de paginación con total, page, limit, pages", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "10",
      });

      expect(data.pagination).toHaveProperty("total");
      expect(data.pagination).toHaveProperty("page");
      expect(data.pagination).toHaveProperty("limit");
      expect(data.pagination).toHaveProperty("pages");

      expect(typeof data.pagination.total).toBe("number");
      expect(typeof data.pagination.page).toBe("number");
      expect(typeof data.pagination.limit).toBe("number");
      expect(typeof data.pagination.pages).toBe("number");
    });

    it("calcula pages correctamente", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "2",
      });

      const expectedPages = Math.ceil(data.pagination.total / 2);
      expect(data.pagination.pages).toBe(expectedPages);
    });
  });

  describe("Filtros", () => {
    it("filtra por status=ACTIVE", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        status: "ACTIVE",
        limit: "10",
      });

      expect(response.status).toBe(200);
      expect(data.data.length).toBeGreaterThan(0);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("ACTIVE");
      });
    });

    it("filtra por status=COMPLETED", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        status: "COMPLETED",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("COMPLETED");
      });
    });

    it("filtra por status=CANCELLED", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        status: "CANCELLED",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("CANCELLED");
      });
    });

    it("filtra por modelType=FIXED", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        modelType: "FIXED",
        limit: "10",
      });

      expect(response.status).toBe(200);
      expect(data.data.length).toBeGreaterThan(0);
      data.data.forEach((inv) => {
        expect(inv.modelType).toBe("FIXED");
      });
    });

    it("filtra por modelType=VARIABLE", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        modelType: "VARIABLE",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.modelType).toBe("VARIABLE");
      });
    });

    it("filtra por search (email parcial)", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        search: "investor1",
        limit: "10",
      });

      expect(response.status).toBe(200);
      expect(data.data.length).toBeGreaterThan(0);
      data.data.forEach((inv) => {
        expect(inv.userEmail.toLowerCase()).toContain("investor1");
      });
    });

    it("filtra por search investor2", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        search: "investor2",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.userEmail.toLowerCase()).toContain("investor2");
      });
    });

    it("filtra por dateFrom", async () => {
      // Get all investments first to know the date range
      const all = await get<ListInvestmentsResult>(ENDPOINT, { limit: "100" });
      if (all.data.data.length === 0) return;

      // Sort by start date and pick a middle date
      const sorted = [...all.data.data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
      const midDate = sorted[Math.floor(sorted.length / 2)].startDate;
      const dateFrom = midDate.split("T")[0];

      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        dateFrom,
        limit: "100",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(new Date(inv.startDate).getTime()).toBeGreaterThanOrEqual(
          new Date(dateFrom).getTime(),
        );
      });
    });

    it("filtra por dateTo", async () => {
      const all = await get<ListInvestmentsResult>(ENDPOINT, { limit: "100" });
      if (all.data.data.length === 0) return;

      const sorted = [...all.data.data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
      const midDate = sorted[Math.floor(sorted.length / 2)].startDate;
      const dateTo = midDate.split("T")[0];

      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        dateTo,
        limit: "100",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        // dateTo should be inclusive, so we check <= end of that day
        const invDate = new Date(inv.startDate);
        const endOfDateTo = new Date(dateTo + "T23:59:59.999Z");
        expect(invDate.getTime()).toBeLessThanOrEqual(endOfDateTo.getTime());
      });
    });

    it("filtra por rango de fechas (dateFrom + dateTo)", async () => {
      const all = await get<ListInvestmentsResult>(ENDPOINT, { limit: "100" });
      if (all.data.data.length < 2) return;

      const sorted = [...all.data.data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );

      const dateFrom = sorted[0].startDate.split("T")[0];
      const dateTo = sorted[sorted.length - 1].startDate.split("T")[0];

      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        dateFrom,
        dateTo,
        limit: "100",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        const invDate = new Date(inv.startDate);
        expect(invDate.getTime()).toBeGreaterThanOrEqual(new Date(dateFrom).getTime());
      });
    });

    it("combina múltiples filtros", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        status: "ACTIVE",
        modelType: "FIXED",
        search: "investor1",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("ACTIVE");
        expect(inv.modelType).toBe("FIXED");
        expect(inv.userEmail.toLowerCase()).toContain("investor1");
      });
    });
  });

  describe("Estructura de Response", () => {
    it("retorna todos los campos del DTO", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "1",
      });

      expect(data.data.length).toBeGreaterThan(0);
      const inv = data.data[0];

      // Check all required fields exist
      expect(inv).toHaveProperty("id");
      expect(inv).toHaveProperty("userEmail");
      expect(inv).toHaveProperty("status");
      expect(inv).toHaveProperty("modelType");
      expect(inv).toHaveProperty("startDate");
      expect(inv).toHaveProperty("endDate");
      expect(inv).toHaveProperty("currentAPR");
      expect(inv).toHaveProperty("initialAmount");
      expect(inv).toHaveProperty("accruedYield");
      expect(inv).toHaveProperty("daysToCollect");
      expect(inv).toHaveProperty("availableToClaim");
      expect(inv).toHaveProperty("totalClaimed");
    });

    it("startDate y endDate son ISO strings", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "1",
      });

      expect(data.data.length).toBeGreaterThan(0);
      const inv = data.data[0];

      // ISO date strings should be parseable
      expect(() => new Date(inv.startDate)).not.toThrow();
      expect(() => new Date(inv.endDate)).not.toThrow();
      expect(new Date(inv.startDate).toISOString()).toBe(inv.startDate);
      expect(new Date(inv.endDate).toISOString()).toBe(inv.endDate);
    });

    it("status es uno de los valores válidos", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      const validStatuses = ["ACTIVE", "COMPLETED", "CANCELLED"];
      data.data.forEach((inv) => {
        expect(validStatuses).toContain(inv.status);
      });
    });

    it("modelType es FIXED o VARIABLE", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      const validTypes = ["FIXED", "VARIABLE"];
      data.data.forEach((inv) => {
        expect(validTypes).toContain(inv.modelType);
      });
    });

    it("currentAPR es número o null", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        expect(typeof inv.currentAPR === "number" || inv.currentAPR === null).toBe(true);
      });
    });

    it("daysToCollect es número >= 0", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        expect(typeof inv.daysToCollect).toBe("number");
        expect(inv.daysToCollect).toBeGreaterThanOrEqual(0);
      });
    });

    it("amounts son strings numéricos", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        expect(typeof inv.initialAmount).toBe("string");
        expect(typeof inv.accruedYield).toBe("string");
        expect(typeof inv.availableToClaim).toBe("string");
        expect(typeof inv.totalClaimed).toBe("string");

        // Should be parseable as numbers
        expect(isNaN(parseFloat(inv.initialAmount))).toBe(false);
        expect(isNaN(parseFloat(inv.accruedYield))).toBe(false);
        expect(isNaN(parseFloat(inv.availableToClaim))).toBe(false);
        expect(isNaN(parseFloat(inv.totalClaimed))).toBe(false);
      });
    });

    it("availableToClaim y totalClaimed son calculados correctamente", async () => {
      const { data } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        const availableToClaim = parseFloat(inv.availableToClaim);
        const totalClaimed = parseFloat(inv.totalClaimed);
        const accruedYield = parseFloat(inv.accruedYield);

        // availableToClaim should be >= 0
        expect(availableToClaim).toBeGreaterThanOrEqual(0);
        // totalClaimed should be >= 0
        expect(totalClaimed).toBeGreaterThanOrEqual(0);
        // Sum of availableToClaim + totalClaimed should be <= accruedYield
        // (there might be pending yields not yet claimable)
        expect(availableToClaim + totalClaimed).toBeLessThanOrEqual(
          accruedYield + 0.001, // Small tolerance for floating point
        );
      });
    });
  });

  describe("Edge Cases", () => {
    it("retorna array vacío con filtro sin resultados", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT, {
        search: "nonexistent_email_xyz123",
        limit: "10",
      });

      expect(response.status).toBe(200);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it("usa defaults cuando no se pasan parámetros", async () => {
      const { response, data } = await get<ListInvestmentsResult>(ENDPOINT);

      expect(response.status).toBe(200);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(20); // Default limit
    });

    it("limita máximo a 100 items", async () => {
      const { response } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "999",
      });

      // Based on schema: z.coerce.number().int().positive().max(100).default(20)
      expect(response.status).toBe(400);
    });

    it("rechaza page negativo", async () => {
      const { response } = await get<ListInvestmentsResult>(ENDPOINT, {
        page: "-1",
      });

      expect(response.status).toBe(400);
    });

    it("rechaza limit negativo", async () => {
      const { response } = await get<ListInvestmentsResult>(ENDPOINT, {
        limit: "-1",
      });

      expect(response.status).toBe(400);
    });

    it("rechaza status inválido", async () => {
      const { response } = await get<ListInvestmentsResult>(ENDPOINT, {
        status: "INVALID_STATUS",
      });

      expect(response.status).toBe(400);
    });

    it("rechaza modelType inválido", async () => {
      const { response } = await get<ListInvestmentsResult>(ENDPOINT, {
        modelType: "INVALID_TYPE",
      });

      expect(response.status).toBe(400);
    });
  });
});
