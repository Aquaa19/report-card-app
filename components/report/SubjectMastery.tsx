// File: components/report/SubjectMastery.tsx
'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from 'recharts';
import { SubjectMasteryData } from '@/lib/types';

interface SubjectMasteryProps {
  data: SubjectMasteryData[];
}

// Custom tooltip defined outside to maintain performance and satisfy ESLint
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-border-light shadow-glass">
        <p className="text-text-secondary text-sm font-medium mb-1">
          {payload[0].payload.subject}
        </p>
        <p className="text-primary-400 font-bold">
          Mastery: <span className="text-text-primary">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function SubjectMastery({ data }: SubjectMasteryProps) {
  return (
    <div className="w-full h-[350px] flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          {/* Subtle hexagonal grid lines */}
          <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
          
          {/* Subject labels on the outer corners */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }}
          />
          
          {/* Invisible radius axis to define the 0-100 scale */}
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          {/* The primary mastery area with gradient-like fill */}
          <Radar
            name="Student Mastery"
            dataKey="score"
            stroke="#818CF8"
            strokeWidth={2}
            fill="#6366F1"
            fillOpacity={0.3}
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}