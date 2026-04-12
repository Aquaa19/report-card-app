// File: components/report/WeeklyActivity.tsx
'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts';
import { WeeklyActivityData } from '@/lib/types';

interface WeeklyActivityProps {
  data: WeeklyActivityData[];
}

// Tooltip defined outside to prevent re-renders and fix ESLint errors
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 rounded-lg border border-border-light shadow-glass">
        <p className="text-text-secondary text-sm font-medium mb-1">{label}</p>
        <p className="text-secondary-400 font-bold">
          Study: <span className="text-text-primary">{payload[0].value} hrs</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function WeeklyActivity({ data }: WeeklyActivityProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
          barGap={8}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.03)" 
            vertical={false} 
          />
          
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
            dx={-5}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255, 255, 255, 0.05)', radius: 8 }} 
          />
          
          <Bar 
            dataKey="hours" 
            radius={[6, 6, 0, 0]}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? '#A855F7' : '#6366F1'} 
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}