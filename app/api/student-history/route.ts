// app/api/student-history/route.ts
import { NextResponse } from "next/server";
import { sheets } from "@/lib/google-sheets";
import { parseFormResponses, calculateDashboardMetrics } from "@/lib/parse-responses";
import type { DashboardRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export type StudentHistory = DashboardRow;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedName = searchParams.get("name");

    if (!requestedName || requestedName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const cleanQuery = requestedName.trim().toLowerCase();

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Missing GOOGLE_SHEET_ID in environment variables");
    }

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Form responses 1!A:N',
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const parsedResponses = parseFormResponses(rows);
    const allDashboardData = calculateDashboardMetrics(parsedResponses);

    const filteredHistory = allDashboardData.filter(
      (row) =>
        row.studentName &&
        row.studentName.toLowerCase().includes(cleanQuery)
    );

    return NextResponse.json(
      { success: true, data: filteredHistory },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student history:", error);

    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}