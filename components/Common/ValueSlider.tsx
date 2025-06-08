"use client";

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ValueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  className?: string;
}

const ValueSlider: React.FC<ValueSliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 20000,
  step = 100,
  label,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  }, [onChange]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const formatValue = (val: number): string => {
    if (val === 0) return "Sem limite";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      <label className="text-sm font-medium text-gray-700 block mb-2">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Display do valor */}
        <motion.div 
          className="text-center"
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ duration: 0.1 }}
        >
          <span className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
            value > 0 
              ? 'bg-gradient-to-r from-primary to-orange-500 text-white shadow-md' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {formatValue(value)}
          </span>
        </motion.div>

        {/* Slider customizado */}
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full transition-all duration-200"
              style={{ width: `${percentage}%` }}
              animate={{ opacity: value > 0 ? 1 : 0.3 }}
            />
          </div>
          
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleChange}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute top-0 left-0 w-full h-2 opacity-0 cursor-pointer"
            style={{
              background: 'transparent',
              outline: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
          />
          
          {/* Thumb customizado */}
          <motion.div
            className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all duration-200 ${
              value > 0 
                ? 'bg-gradient-to-r from-primary to-orange-500' 
                : 'bg-gray-400'
            }`}
            style={{ left: `calc(${percentage}% - 10px)` }}
            animate={{ 
              scale: isDragging ? 1.2 : 1,
              boxShadow: isDragging 
                ? '0 4px 20px rgba(234, 88, 12, 0.4)' 
                : '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Labels de min/max */}
        <div className="flex justify-between text-xs text-gray-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
};

export default ValueSlider;