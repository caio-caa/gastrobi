'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
}

function MetricCard({
  title,
  value,
  change,
  changePositive,
  icon: Icon,
  iconColor = 'text-blue-600',
}: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {value}
          </p>
          {change && (
            <p
              className={`text-sm mt-2 flex items-center ${
                changePositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-gray-50 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

export default MetricCard;
