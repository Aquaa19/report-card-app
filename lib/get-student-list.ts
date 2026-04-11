import { sheets } from "@/lib/google-sheets";
import { parseDashboardData, type DashboardRow } from "@/lib/parse-responses";

/**
 * Loads rows from the Performance Dashboard sheet (same range as /api/dashboard).
 */
export async function getStudentList(): Promise<DashboardRow[]> {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing GOOGLE_SHEET_ID in environment variables");
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Performance Dashboard!A:H",
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  return parseDashboardData(rows);
}
