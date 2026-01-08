/**
 * E2E Tests for User Investment Endpoints
 * - GET /api/investments
 * - GET /api/investments/summary
 *
 * Uses DEV_USER_ID which maps to USER_INVESTOR1 in test mode
 * USER_INVESTOR1 has 9 investments: 5 ACTIVE, 3 COMPLETED, 1 CANCELLED
 */

import { describe, it, expect } from "vitest";
import { get } from "../helpers/test-app";
import type {
  GetUserInvestmentsResult,
  UserInvestmentSummary,
} from "../../src/domain/entities/investment";

const ENDPOINT = "/api/investments";
const SUMMARY_ENDPOINT = "/api/investments/summary";

describe("GET /api/investments", () => {
  describe("Paginación", () => {
    it("retorna máximo N items con limit=N", async () => {
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "3",
      });

      expect(response.status).toBe(200);
      expect(data.data.length).toBeLessThanOrEqual(3);
      expect(data.pagination.limit).toBe(3);
    });

    it("retorna página 2 correctamente", async () => {
      // First get page 1 with limit 2
      const page1 = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "2",
        page: "1",
      });

      // Then get page 2
      const page2 = await get<GetUserInvestmentsResult>(ENDPOINT, {
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
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "2",
      });

      const expectedPages = Math.ceil(data.pagination.total / 2);
      expect(data.pagination.pages).toBe(expectedPages);
    });
  });

  describe("Filtros", () => {
    it("filtra por status=ACTIVE", async () => {
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        status: "COMPLETED",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("COMPLETED");
      });
    });

    it("filtra por status=CANCELLED", async () => {
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        status: "CANCELLED",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("CANCELLED");
      });
    });

    it("filtra por modelType=FIXED", async () => {
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        modelType: "VARIABLE",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.modelType).toBe("VARIABLE");
      });
    });

    it("filtra por dateFrom", async () => {
      // Get all investments first to know the date range
      const all = await get<GetUserInvestmentsResult>(ENDPOINT, { limit: "100" });
      if (all.data.data.length === 0) return;

      // Sort by start date and pick a middle date
      const sorted = [...all.data.data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
      const midDate = sorted[Math.floor(sorted.length / 2)].startDate;
      const dateFrom = midDate.split("T")[0];

      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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
      const all = await get<GetUserInvestmentsResult>(ENDPOINT, { limit: "100" });
      if (all.data.data.length === 0) return;

      const sorted = [...all.data.data].sort(
        (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
      const midDate = sorted[Math.floor(sorted.length / 2)].startDate;
      const dateTo = midDate.split("T")[0];

      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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

    it("combina múltiples filtros (status + modelType)", async () => {
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        status: "ACTIVE",
        modelType: "FIXED",
        limit: "10",
      });

      expect(response.status).toBe(200);
      data.data.forEach((inv) => {
        expect(inv.status).toBe("ACTIVE");
        expect(inv.modelType).toBe("FIXED");
      });
    });
  });

  describe("Estructura de Response", () => {
    it("retorna todos los campos del DTO", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "1",
      });

      expect(data.data.length).toBeGreaterThan(0);
      const inv = data.data[0];

      // Check all required fields exist
      expect(inv).toHaveProperty("id");
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
      expect(inv).toHaveProperty("claimStatus");
    });

    it("startDate y endDate son ISO strings", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      const validStatuses = ["ACTIVE", "COMPLETED", "CANCELLED"];
      data.data.forEach((inv) => {
        expect(validStatuses).toContain(inv.status);
      });
    });

    it("modelType es FIXED o VARIABLE", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      const validTypes = ["FIXED", "VARIABLE"];
      data.data.forEach((inv) => {
        expect(validTypes).toContain(inv.modelType);
      });
    });

    it("currentAPR es número o null", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        expect(typeof inv.currentAPR === "number" || inv.currentAPR === null).toBe(true);
      });
    });

    it("daysToCollect es número >= 0", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        expect(typeof inv.daysToCollect).toBe("number");
        expect(inv.daysToCollect).toBeGreaterThanOrEqual(0);
      });
    });

    it("amounts son strings numéricos", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
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

    it("claimStatus es uno de los valores válidos", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      const validStatuses = ["Disponible", "Pendiente", "Completado"];
      data.data.forEach((inv) => {
        expect(validStatuses).toContain(inv.claimStatus);
      });
    });

    it("NO incluye campo userEmail (diferencia con admin)", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "1",
      });

      expect(data.data.length).toBeGreaterThan(0);
      const inv = data.data[0];

      // userEmail should NOT exist in user endpoint (only in admin)
      expect(inv).not.toHaveProperty("userEmail");
    });

    it("availableToClaim y totalClaimed son >= 0", async () => {
      const { data } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "100",
      });

      data.data.forEach((inv) => {
        const availableToClaim = parseFloat(inv.availableToClaim);
        const totalClaimed = parseFloat(inv.totalClaimed);

        expect(availableToClaim).toBeGreaterThanOrEqual(0);
        expect(totalClaimed).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe("Edge Cases", () => {
    it("usa defaults cuando no se pasan parámetros", async () => {
      const { response, data } = await get<GetUserInvestmentsResult>(ENDPOINT);

      expect(response.status).toBe(200);
      expect(data.pagination.page).toBe(1);
      expect(data.pagination.limit).toBe(20); // Default limit
    });

    it("limita máximo a 100 items", async () => {
      const { response } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "999",
      });

      // Based on schema: z.coerce.number().int().positive().max(100).default(20)
      expect(response.status).toBe(400);
    });

    it("rechaza page negativo", async () => {
      const { response } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        page: "-1",
      });

      expect(response.status).toBe(400);
    });

    it("rechaza limit negativo", async () => {
      const { response } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        limit: "-1",
      });

      expect(response.status).toBe(400);
    });

    it("rechaza status inválido", async () => {
      const { response } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        status: "INVALID_STATUS",
      });

      expect(response.status).toBe(400);
    });

    it("rechaza modelType inválido", async () => {
      const { response } = await get<GetUserInvestmentsResult>(ENDPOINT, {
        modelType: "INVALID_TYPE",
      });

      expect(response.status).toBe(400);
    });
  });
});

describe("GET /api/investments/summary", () => {
  describe("Response Structure", () => {
    it("retorna totalAvailableToClaim como string numérico", async () => {
      const { response, data } = await get<UserInvestmentSummary>(SUMMARY_ENDPOINT);

      expect(response.status).toBe(200);
      expect(typeof data.totalAvailableToClaim).toBe("string");
      expect(isNaN(parseFloat(data.totalAvailableToClaim))).toBe(false);
    });

    it("retorna currency como USDT", async () => {
      const { response, data } = await get<UserInvestmentSummary>(SUMMARY_ENDPOINT);

      expect(response.status).toBe(200);
      expect(data.currency).toBe("USDT");
    });

    it("totalAvailableToClaim es >= 0", async () => {
      const { response, data } = await get<UserInvestmentSummary>(SUMMARY_ENDPOINT);

      expect(response.status).toBe(200);
      const amount = parseFloat(data.totalAvailableToClaim);
      expect(amount).toBeGreaterThanOrEqual(0);
    });

    it("retorna estructura correcta con ambos campos", async () => {
      const { response, data } = await get<UserInvestmentSummary>(SUMMARY_ENDPOINT);

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("totalAvailableToClaim");
      expect(data).toHaveProperty("currency");
      expect(Object.keys(data).length).toBe(2);
    });
  });
});
