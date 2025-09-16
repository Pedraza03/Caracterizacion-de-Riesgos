// src/components/dashboard/QuickActions.jsx
import React from 'react';
import { AlertTriangle, Activity, Info } from 'lucide-react';

export default function QuickActions({ data }) {
  if (!data) {
    return (
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
        <h3 className="text-white text-lg font-semibold mb-2">Acciones Rápidas</h3>
        <p className="text-zinc-400 text-sm">Cargando datos...</p>
      </div>
    );
  }


  const actions = [
    { 
      type: 'critical', 
      count: data.riesgos_critico ?? 0,
      text: 'riesgos críticos',
      subtext: 'Requieren atención inmediata',
      icon: AlertTriangle,
      color: 'border-red-500/20 bg-red-500/10 text-red-400'
    },
    { 
      type: 'warning', 
      count: data.controles_pendientes ?? 0, // <-- solo pendientes
      text: 'controles Pendientes', 
      subtext: 'Necesitan revisión periódica',
      icon: Activity,
      color: 'border-orange-500/20 bg-orange-500/10 text-orange-400'
    },
    { 
      type: 'info', 
      count: data.activos_sin_controles ?? 0, // <-- usa el nuevo campo
      text: 'activos sin controles',
      subtext: 'Pendientes de evaluación',
      icon: Info,
      color: 'border-blue-500/20 bg-blue-500/10 text-blue-400'
    }
  ];

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">Acciones Rápidas</h3>
        <p className="text-zinc-400 text-sm">Tareas pendientes y alertas importantes</p>
      </div>

      <div className="space-y-4">
        {actions.map((action, index) => (
          <div 
            key={index} 
            className={`border rounded-lg p-4 cursor-pointer hover:scale-[1.02] transition-all ${action.color}`}
          >
            <div className="flex items-center gap-4">
              <action.icon className="w-5 h-5" />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-lg">{action.count}</span>
                  <span className="text-zinc-300">{action.text}</span>
                </div>
                <p className="text-zinc-400 text-sm mt-1">{action.subtext}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
