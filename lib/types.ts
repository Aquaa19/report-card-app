// File: lib/types.ts

// 1. Google Sheets Raw Data Types (Moved from parse-responses.ts)
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