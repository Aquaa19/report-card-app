// file: lib/get-student-list.ts

import { sheets } from "@/lib/google-sheets";
import { parseFormResponses, calculateDashboardMetrics } from "@/lib/parse-responses";
import type { DashboardRow } from "@/lib/types";

export async function getStudentList(): Promise<DashboardRow[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID in environment variables");
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Form responses 1!A:N",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  const parsedResponses = parseFormResponses(rows);
  return calculateDashboardMetrics(parsedResponses);
}