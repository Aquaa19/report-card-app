// File: components/report/WeakTopicBadge.tsx
import React from 'react';

interface WeakTopicBadgeProps {
  topic: string;
  understandingLevel: number; // Scale of 1-10
}

export default function WeakTopicBadge({ topic, understandingLevel }: WeakTopicBadgeProps) {
  // Logic to determine severity based on understanding level
  const getSeverity = (level: number) => {
    if (level <= 3) return {
      color: 'text-status-error',
      bg: 'bg-status-error/10',
      border: 'border-status-error/20',
      icon: 'dangerous',
      label: 'Critical'
    };
    if (level <= 6) return {
      color: 'text-status-warning',
      bg: 'bg-status-warning/10',
      border: 'border-status-warning/20',
      icon: 'warning',
      label: 'Needs Review'
    };
    return {
      color: 'text-status-success',
      bg: 'bg-status-success/10',
      border: 'border-status-success/20',
      icon: 'check_circle',
      label: 'Minor Doubt'
    };
  };

  const severity = getSeverity(understandingLevel);

  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${severity.bg} ${severity.border} glass-panel transition-all duration-300 hover:scale-[1.02]`}>
      {/* Severity Icon */}
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-background/50 ${severity.color}`}>
        <span className="material-symbols-outlined text-[20px]">
          {severity.icon}
        </span>
      </div>

      {/* Topic Information */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-text-primary leading-tight">
          {topic}
        </h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] uppercase tracking-wider font-bold ${severity.color}`}>
            {severity.label}
          </span>
          <span className="text-text-muted text-[10px]">•</span>
          <span className="text-text-muted text-[10px]">
            Level: {understandingLevel}/10
          </span>
        </div>
      </div>

      {/* Progress Indicator (Mini Bar) */}
      <div className="w-12 h-1.5 bg-background/40 rounded-full overflow-hidden hidden sm:block">
        <div 
          className={`h-full rounded-full ${severity.color.replace('text', 'bg')}`}
          style={{ width: `${understandingLevel * 10}%` }}
        />
      </div>
    </div>
  );
}