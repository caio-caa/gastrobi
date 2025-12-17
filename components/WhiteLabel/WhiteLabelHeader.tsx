'use client';

import React from 'react';
import { ChefHat } from 'lucide-react';
import { useWhiteLabel } from '@/contexts/WhiteLabelContext';

interface WhiteLabelHeaderProps {
  className?: string;
}

function WhiteLabelHeader({ className = '' }: WhiteLabelHeaderProps) {
  const { config } = useWhiteLabel();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {config.logo ? (
        <img
          src={config.logo}
          alt={`${config.brandName} Logo`}
          className="w-8 h-8 object-contain"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: config.primaryColor }}
        >
          <ChefHat className="w-5 h-5 text-white" />
        </div>
      )}
      <span className="text-xl font-bold text-gray-900">
        {config.brandName}
      </span>
    </div>
  );
}

export default WhiteLabelHeader;
