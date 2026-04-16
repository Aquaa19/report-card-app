// File: app/api/dashboard/route.ts
import { NextResponse } from 'next/server';
import { sheets } from '@/lib/google-sheets';
import { parseFormResponses, calculateDashboardMetrics } from '@/lib/parse-responses';

// Cache this route for 60 seconds to avoid hitting Google Sheets API rate limits
export const revalidate = 60;

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Missing GOOGLE_SHEET_ID in environment variables' },
        { status: 500 }
      );
    }

    // Fetch data from the 'Form responses 1' sheet (Columns A to N)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Form responses 1!A:N',
    });

    const rows = response.data.values;

    // Handle empty states gracefully
    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Clean and parse the raw 2D array into structured JSON using our new helpers
    const parsedResponses = parseFormResponses(rows);
    const dashboardData = calculateDashboardMetrics(parsedResponses);

    return NextResponse.json({ data: dashboardData });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance dashboard data' },
      { status: 500 }
    );
  }
}