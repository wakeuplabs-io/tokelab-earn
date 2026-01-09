import { createFileRoute } from "@tanstack/react-router";
import { MyInvestmentsPage } from "../../pages/my-investments/my-investments.page";

export const Route = createFileRoute("/my-investments/")({
  component: MyInvestmentsPage,
});
