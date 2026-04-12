// File: components/ui/StudentSelector.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Temporary mock data - to be replaced by actual Google Sheets data later
interface Student {
  id: string;
  name: string;
}

const MOCK_STUDENTS: Student[] = [
  { id: 'STU001', name: 'Aarav Patel' },
  { id: 'STU002', name: 'Priya Sharma' },
  { id: 'STU003', name: 'Rohan Gupta' },
  { id: 'STU004', name: 'Kavya Singh' },
];

export default function StudentSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Student | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (student: Student) => {
    setSelected(student);
    setIsOpen(false);
    // Push the user to the dynamic route for the selected student
    router.push(`/dashboard/${student.id}`);
  };

  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between glass-panel px-4 py-3 rounded-xl text-left border border-transparent hover:border-primary-500/50 transition-colors input-glow focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-text-secondary text-[20px]">
            person_search
          </span>
          <span className={`font-medium ${selected ? 'text-text-primary' : 'text-text-muted'}`}>
            {selected ? selected.name : 'Search for a student...'}
          </span>
        </div>
        <span 
          className={`material-symbols-outlined text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 glass-panel rounded-xl overflow-hidden z-50 shadow-glass animate-in fade-in slide-in-from-top-2 duration-200 border border-border-light">
          <div className="max-h-60 overflow-y-auto no-scrollbar">
            {MOCK_STUDENTS.map((student) => (
              <button
                key={student.id}
                onClick={() => handleSelect(student)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left bg-transparent hover:bg-primary-500/20 text-text-secondary hover:text-primary-400 transition-colors border-b border-border-light last:border-0"
              >
                <span className="material-symbols-outlined text-[18px]">
                  account_circle
                </span>
                {student.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}