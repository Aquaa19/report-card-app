// File: app/api/sheet-data/route.ts
import { NextResponse } from 'next/server';
import { sheets } from '@/lib/google-sheets';
import { parseFormResponses } from '@/lib/parse-responses';

export async function GET() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      return NextResponse.json(
        { error: 'Missing GOOGLE_SHEET_ID in environment variables' },
        { status: 500 }
      );
    }

    // Fetch data from the 'Form responses 1' sheet (Columns A to N to cover all 14 fields)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Form responses 1!A:N',
    });

    const rows = response.data.values;

    // Handle empty states gracefully
    if (!rows || rows.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Clean and parse the raw 2D array into structured JSON using our helper
    const parsedData = parseFormResponses(rows);

    return NextResponse.json({ data: parsedData });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Google Sheets' },
      { status: 500 }
    );
  }
}