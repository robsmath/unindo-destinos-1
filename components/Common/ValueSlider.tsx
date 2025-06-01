"use client";

import React from 'react';

interface ValueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
}

const ValueSlider: React.FC<ValueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  className = ""
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const formatValue = (val: number) => {
    if (val >= 1000) {
      return `R$ ${(val / 1000).toFixed(0)}k`;
    }
    return `R$ ${val.toLocaleString("pt-BR")}`;
  };

  const percentage = ((value - min) / (max - min)) * 100;
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-700 block">
          {label}: <span className="text-primary font-semibold">{formatValue(value)}</span>
        </label>
      )}
      
      <div className="relative h-8 flex items-center">
        {/* Track Background */}
        <div className="w-full h-2 bg-gray-200 rounded-full absolute">
          {/* Progress Fill */}
          <div 
            className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-200"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Input Range - positioned above track for proper interaction */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="range-slider w-full h-8 bg-transparent cursor-pointer relative z-10"
          style={{
            background: 'transparent',
          }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span className="font-medium">{formatValue(min)}</span>
        <span className="font-medium">{formatValue(max)}</span>
      </div>
      
      <style jsx>{`
        .range-slider {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          outline: none;
        }
        
        .range-slider::-webkit-slider-track {
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          height: 8px;
          border-radius: 4px;
        }
        
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #f97316;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        
        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2), 0 0 0 2px rgba(249, 115, 22, 0.2);
        }
        
        .range-slider::-webkit-slider-thumb:active {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 0 3px rgba(249, 115, 22, 0.3);
        }
        
        .range-slider::-moz-range-track {
          background: transparent;
          height: 8px;
          border-radius: 4px;
          border: none;
        }
        
        .range-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: white;
          border: 3px solid #f97316;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.2s ease;
        }
        
        .range-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        
        .range-slider::-moz-range-thumb:active {
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }
        
        /* Firefox specific styles */
        .range-slider::-moz-range-progress {
          background: linear-gradient(to right, #f97316, #ea580c);
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ValueSlider;