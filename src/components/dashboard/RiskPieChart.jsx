// src/components/dashboard/RiskPieChart.jsx
import React from 'react';

export default function RiskPieChart({ riesgos }) {
  // Si no hay datos, muestra loading o cero
  const riskData = [
    { name: 'Crítico', value: riesgos?.critico ?? 0, color: '#ef4444' },
    { name: 'Alto', value: riesgos?.alto ?? 0, color: '#f97316' },
    { name: 'Medio', value: riesgos?.medio ?? 0, color: '#3b82f6' },
    { name: 'Bajo', value: riesgos?.bajo ?? 0, color: '#10b981' }
  ];

  const total = riskData.reduce((sum, item) => sum + item.value, 0);

  // Calcula el porcentaje de cada riesgo
  const riskDataWithPercent = riskData.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0
  }));

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Distribución de Riesgos</h3>
        <p className="text-zinc-400 text-sm">Análisis de riesgos por nivel de criticidad</p>
      </div>

      <div className="flex items-center justify-between">
        {/* Chart Area */}
        <div className="relative w-32 h-32">
          {/* Aquí podrías agregar un gráfico real si lo deseas */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-orange-500 via-blue-500 to-green-500 opacity-80"></div>
          <div className="absolute inset-4 bg-zinc-800 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-xl font-bold">{total}</div>
              <div className="text-zinc-400 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 ml-8 space-y-3">
          {riskDataWithPercent.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-zinc-300 text-sm font-medium">{item.name}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold">{item.value}</div>
                <div className="text-zinc-400 text-xs">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}