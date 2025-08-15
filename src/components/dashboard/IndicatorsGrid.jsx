// src/components/dashboard/IndicatorsGrid.jsx
import React from 'react';

export default function IndicatorsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Indicador de Cumplimiento */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#10b981"
                strokeWidth="8"
                fill="none"
                strokeDasharray="251.2"
                strokeDashoffset="20.1"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-bold">92%</span>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">Cumplimiento General</p>
        </div>
      </div>

      {/* Indicador de Tiempo */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray="251.2"
                strokeDashoffset="175.84"
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-bold">2.3h</span>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">Tiempo Promedio de Respuesta</p>
        </div>
      </div>
    </div>
  );
}