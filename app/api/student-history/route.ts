// app/api/student-history/route.ts
import { NextResponse } from "next/server";
import { sheets } from "@/lib/google-sheets";
import { parseFormResponses, calculateDashboardMetrics } from "@/lib/parse-responses";
import type { DashboardRow, FormResponse } from "@/lib/types";

export const dynamic = "force-dynamic";

// We extend the standard DashboardRow to include the raw history array for the table
export type StudentHistoryProfile = DashboardRow & { history: FormResponse[] };

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

    // 1. Get the raw parsed responses and the aggregated dashboard summary
    const parsedResponses = parseFormResponses(rows);
    const allDashboardData = calculateDashboardMetrics(parsedResponses);

    // 2. Find the summary for the specific requested student
    const filteredSummary = allDashboardData.filter(
      (row) =>
        row.studentName &&
        row.studentName.toLowerCase().includes(cleanQuery)
    );

    // If no student matched, return empty data
    if (filteredSummary.length === 0) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    // Get the exact student name from our summary to ensure perfect matching
    const actualStudentName = filteredSummary[0].studentName.toLowerCase();

    // 3. Extract the weekly history for this specific student and sort newest first
    const rawHistory = parsedResponses
      .filter((res) => res.studentName && res.studentName.toLowerCase() === actualStudentName)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // 4. Combine the top-level metrics with the detailed history
    const enhancedData: StudentHistoryProfile = {
      ...filteredSummary[0],
      history: rawHistory,
    };

    // Return inside an array to maintain compatibility with the frontend's current logic
    return NextResponse.json(
      { success: true, data: [enhancedData] },
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