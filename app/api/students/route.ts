//file: app/api/students/route.ts

import { NextResponse } from "next/server";
import { getStudentList } from '@/lib/get-student-list';

// PRODUCTION STANDARD: Cache Busting
// This forces Next.js to run this route dynamically every single time it's called.
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const studentList = await getStudentList();

        return NextResponse.json(
            { success: true, data: studentList },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching student list:', error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch student list" },
            { status: 500 }
        );
    }
}
