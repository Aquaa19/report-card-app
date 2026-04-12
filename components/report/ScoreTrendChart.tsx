// File: components/report/ScoreTrendChart.tsx
'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { ScoreTrendData } from '@/lib/types';

interface ScoreTrendChartProps {
  data: ScoreTrendData[];
}

// Moved outside the main component to prevent recreation on every render
// Added proper TooltipProps from recharts to replace 'any'
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-border-light shadow-glass">
        <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
        <p className="text-primary-400 font-bold">
          Score: <span className="text-text-primary">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function ScoreTrendChart({ data }: ScoreTrendChartProps) {
  return (
    <div className="w-full h-[300px] sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          {/* Subtle grid lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          
          {/* Axis styling */}
          <XAxis 
            dataKey="name" 
            stroke="#64748B" 
            tick={{ fill: '#94A3B8', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#64748B" 
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            dx={-10}
            domain={[0, 100]} // Assuming scores are percentages
          />
          
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(99, 102, 241, 0.2)', strokeWidth: 2 }} />
          
          {/* The glowing gradient line */}
          <Line
            type="monotone"
            dataKey="score"
            stroke="#818CF8" // primary-400
            strokeWidth={3}
            dot={{ r: 4, fill: '#0B0524', stroke: '#818CF8', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: '#6366F1', stroke: '#0B0524', strokeWidth: 2 }}
            animationDuration={1500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}