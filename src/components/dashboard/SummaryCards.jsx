// src/components/dashboard/SummaryCards.jsx
import React from 'react';
import { Shield, AlertTriangle, Activity, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20'
  };

  const changeColor = change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-zinc-400';
  const changeSymbol = change > 0 ? '+' : '';

  return (
    <div className={`bg-zinc-800 border rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
        <p className="text-white text-3xl font-bold">{value}</p>
        <p className={`text-sm ${changeColor}`}>
          {changeSymbol}{change} vs mes anterior
        </p>
      </div>
      {/* Progress bar */}
      <div className="mt-4 w-full bg-zinc-700 rounded-full h-1">
        <div className={`h-1 rounded-full bg-current`} style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default function SummaryCards() {
  const stats = {
    totalActivos: 59,
    amenazasActivas: 43,
    riesgosCriticos: 5,
    controlesActivos: 28,
    changes: {
      totalActivos: 12,
      amenazasActivas: -8,
      riesgosCriticos: -2,
      controlesActivos: 5
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Activos"
        value={stats.totalActivos}
        change={stats.changes.totalActivos}
        icon={Shield}
        color="blue"
      />
      <StatCard
        title="Amenazas Activas"
        value={stats.amenazasActivas}
        change={stats.changes.amenazasActivas}
        icon={AlertTriangle}
        color="orange"
      />
      <StatCard
        title="Riesgos Críticos"
        value={stats.riesgosCriticos}
        change={stats.changes.riesgosCriticos}
        icon={Activity}
        color="red"
      />
      <StatCard
        title="Controles Activos"
        value={stats.controlesActivos}
        change={stats.changes.controlesActivos}
        icon={CheckCircle}
        color="green"
      />
    </div>
  );
}