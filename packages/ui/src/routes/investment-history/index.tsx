import { createFileRoute } from "@tanstack/react-router";
import { InvestmentHistoryPage } from "../../pages/investment-history/investment-history.page";

export const Route = createFileRoute("/investment-history/")({
  component: InvestmentHistoryPage,
});
