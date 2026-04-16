// File: lib/parse-responses.ts

import { FormResponse, DashboardRow } from './types';

/**
 * Normalizes the raw 2D array from 'Form responses 1' sheet into typed objects.
 * Assumes the first row (index 0) contains headers and skips it.
 */
export function parseFormResponses(rows: string[][]): FormResponse[] {
  if (!rows || rows.length <= 1) return [];

  const dataRows = rows.slice(1);

  return dataRows.map((row) => ({
    timestamp: row[0] || '',
    studentName: (row[1] || '').trim(),
    batch: (row[2] || '').trim(),
    date: row[3] || '',
    studyDays: parseInt(row[4], 10) || 0,
    avgStudyHours: parseFloat(row[5]) || 0,
    topicsCovered: row[6] || '',
    understandingLevel: parseInt(row[7], 10) || 0,
    difficultTopic: row[8] || '',
    douts: row[9] || '',
    // Convert 'Yes'/'No' strings to actual booleans
    attendedTest: String(row[10]).toLowerCase().trim() === 'yes',
    // Handle empty test scores safely
    testScore: row[11] && !isNaN(parseFloat(row[11])) ? parseFloat(row[11]) : null,
    satisfaction: row[12] || '',
    improvementPlan: row[13] || '',
  }));
}

/**
 * Calculates dashboard metrics from raw form responses.
 * Groups responses by student and computes their latest stats.
 */
export function calculateDashboardMetrics(responses: FormResponse[]): DashboardRow[] {
  const studentMap = new Map<string, FormResponse[]>();

  // Group by student name
  responses.forEach(res => {
    if (!res.studentName) return;
    const existing = studentMap.get(res.studentName) || [];
    existing.push(res);
    studentMap.set(res.studentName, existing);
  });

  const dashboardRows: DashboardRow[] = [];

  studentMap.forEach((studentResponses, name) => {
    // Sort chronologically by timestamp
    const sortedResponses = studentResponses.sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    
    const latestResponse = sortedResponses[sortedResponses.length - 1];
    
    // Find last two test scores to calculate improvement
    const testsAttended = sortedResponses.filter(r => r.attendedTest && r.testScore !== null);
    const latestScore = testsAttended.length > 0 ? testsAttended[testsAttended.length - 1].testScore! : 0;
    const previousScore = testsAttended.length > 1 ? testsAttended[testsAttended.length - 2].testScore! : latestScore;
    
    const scoreImprovement = latestScore - previousScore;

    // Averages
    const totalDays = sortedResponses.reduce((sum, r) => sum + r.studyDays, 0);
    const totalHours = sortedResponses.reduce((sum, r) => sum + r.avgStudyHours, 0);
    const avgStudyDays = parseFloat((totalDays / sortedResponses.length).toFixed(1));
    const avgStudyHours = parseFloat((totalHours / sortedResponses.length).toFixed(1));

    // Status logic based on the latest score
    let status = "Average";
    if (latestScore >= 85) status = "Excellent";
    else if (latestScore >= 70) status = "Good";
    else if (latestScore < 50) status = "Needs Attention";

    dashboardRows.push({
      studentName: name,
      latestScore,
      previousScore,
      scoreImprovement,
      avgStudyDays,
      avgStudyHours,
      weakTopic: latestResponse.difficultTopic || 'None',
      status,
      batch: latestResponse.batch || 'Standard'
    });
  });

  return dashboardRows;
}