// File: lib/parse-responses.ts

// These types will eventually be moved to a central lib/types.ts file
export interface FormResponse {
    timestamp: string;
    studentName: string;
    batch: string;
    date: string;
    studyDays: number;
    avgStudyHours: number;
    topicsCovered: string;
    understandingLevel: number;
    difficultTopic: string;
    doubts: string;
    attendedTest: boolean;
    testScore: number | null;
    satisfaction: string;
    improvementPlan: string;
  }
  
  export interface DashboardRow {
    studentName: string;
    batch: string;
    status: string;
    latestScore: number;
    scoreImprovement: number;
    avgStudyDays: number;
    avgStudyHours: number;
    weakTopic: string;
  }
  
  /**
   * Normalizes the raw 2D array from 'Form responses' sheet into typed objects.
   * Assumes the first row (index 0) contains headers and skips it.
   */
  export function parseFormResponses(rows: string[][]): FormResponse[] {
    if (!rows || rows.length <= 1) return [];
  
    const dataRows = rows.slice(1);
  
    return dataRows.map((row) => ({
      timestamp: row[0] || '',
      studentName: row[1] || '',
      batch: row[2] || '',
      date: row[3] || '',
      studyDays: parseInt(row[4], 10) || 0,
      avgStudyHours: parseFloat(row[5]) || 0,
      topicsCovered: row[6] || '',
      understandingLevel: parseInt(row[7], 10) || 0,
      difficultTopic: row[8] || '',
      doubts: row[9] || '',
      // Convert 'Yes'/'No' strings to actual booleans
      attendedTest: String(row[10]).toLowerCase() === 'yes',
      // Handle empty test scores safely
      testScore: row[11] ? parseFloat(row[11]) : null,
      satisfaction: row[12] || '',
      improvementPlan: row[13] || '',
    }));
  }
  
  /**
   * Normalizes the raw 2D array from 'Performance Dashboard' sheet.
   */
  export function parseDashboardData(rows: string[][]): DashboardRow[] {
    if (!rows || rows.length <= 1) return [];
  
    const dataRows = rows.slice(1);
  
    return dataRows.map((row) => ({
      studentName: row[0] || '',
      batch: row[1] || '',
      status: row[2] || '',
      latestScore: parseFloat(row[3]) || 0,
      scoreImprovement: parseFloat(row[4]) || 0,
      avgStudyDays: parseFloat(row[5]) || 0,
      avgStudyHours: parseFloat(row[6]) || 0,
      weakTopic: row[7] || '',
    }));
  }