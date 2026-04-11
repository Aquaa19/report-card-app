// app/api/student-history/route.ts
import { NextResponse } from "next/server";
import { getStudentList } from "@/lib/get-student-list";
import type { DashboardRow } from "@/lib/parse-responses";

export const dynamic = "force-dynamic";

/** Same shape as Performance Dashboard rows (sheet-backed). */
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

    const allData = await getStudentList();

    const filteredHistory = allData.filter(
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
