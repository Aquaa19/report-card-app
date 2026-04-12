// File: lib/parse-responses.ts

// Import the centralized types instead of duplicating them
import { FormResponse, DashboardRow } from './types';

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
    douts: row[9] || '',
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
 * Matches: Name(0), Latest(1), Previous(2), Improvement(3), Days(4), Hours(5), WeakTopic(6), Status(7)
 */
export function parseDashboardData(rows: string[][]): DashboardRow[] {
  if (!rows || rows.length <= 1) return [];

  const dataRows = rows.slice(1);

  return dataRows.map((row) => ({
    studentName: row[0] || '',
    latestScore: parseFloat(row[1]) || 0,
    previousScore: parseFloat(row[2]) || 0,
    scoreImprovement: parseFloat(row[3]) || 0,
    avgStudyDays: parseFloat(row[4]) || 0,
    avgStudyHours: parseFloat(row[5]) || 0,
    weakTopic: row[6] || '',
    status: row[7] || '',
    batch: 'Standard', // Fallback since it was removed from the sheet columns
  }));
}