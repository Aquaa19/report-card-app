// File: lib/types.ts

// 1. Google Sheets Raw Data Types
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
  douts: string;
  attendedTest: boolean;
  testScore: number | null;
  satisfaction: string;
  improvementPlan: string;
}

export interface DashboardRow {
  studentName: string;
  latestScore: number;
  previousScore: number;
  scoreImprovement: number;
  avgStudyDays: number;
  avgStudyHours: number;
  weakTopic: string;
  status: string;
  batch: string; // Kept so the UI doesn't break, even if missing from the sheet
}

// 2. Recharts Specific Data Types
export interface ScoreTrendData {
  name: string; // The X-axis label (e.g., "Week 1" or a date)
  score: number; // The Y-axis value
}

export interface WeeklyActivityData {
  name: string; // The X-axis label (e.g., "Mon", "Tue")
  hours: number; // The Y-axis value
}

export interface SubjectMasteryData {
  subject: string; // The outer points of the radar chart
  score: number; // The student's score
  fullMark: number; // The maximum possible score boundary
}