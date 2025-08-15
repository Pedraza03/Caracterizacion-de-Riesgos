// src/components/dashboard/RiskPieChart.jsx
import React from 'react';

export default function RiskPieChart() {
  const riskData = [
    { name: 'Crítico', value: 5, percentage: 12, color: '#ef4444' },
    { name: 'Alto', value: 12, percentage: 28, color: '#f97316' },
    { name: 'Medio', value: 18, percentage: 42, color: '#3b82f6' },
    { name: 'Bajo', value: 8, percentage: 19, color: '#10b981' }
  ];

  // Simple donut chart using CSS
  const createDonutSegment = (data, index) => {
    const total = data.reduce((sum, item) => sum + item.percentage, 0);
    let cumulativePercentage = 0;
    
    for (let i = 0; i < index; i++) {
      cumulativePercentage += data[i].percentage;
    }
    
    const startAngle = (cumulativePercentage / 100) * 360;
    const endAngle = ((cumulativePercentage + data[index].percentage) / 100) * 360;
    
    return {
      transform: `rotate(${startAngle}deg)`,
      background: `conic-gradient(${data[index].color} 0deg ${data[index].percentage * 3.6}deg, transparent ${data[index].percentage * 3.6}deg)`
    };
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Distribución de Riesgos</h3>
        <p className="text-zinc-400 text-sm">Análisis de riesgos por nivel de criticidad</p>
      </div>

      <div className="flex items-center justify-between">
        {/* Chart Area */}
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 via-orange-500 via-blue-500 to-green-500 opacity-80">
          </div>
          <div className="absolute inset-4 bg-zinc-800 rounded-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-xl font-bold">43</div>
              <div className="text-zinc-400 text-xs">Total</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 ml-8 space-y-3">
          {riskData.map((item, index) => (
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