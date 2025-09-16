// src/components/dashboard/SummaryCards.jsx
import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Activity, CheckCircle } from 'lucide-react';
import { invoke } from '@tauri-apps/api/core';

const StatCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20'
  };

  const changeColor =
    change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-zinc-400';
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
          {changeSymbol}
        </p>
      </div>
      <div className="mt-4 w-full bg-zinc-700 rounded-full h-1">
        <div className={`h-1 rounded-full bg-current`} style={{ width: '75%' }}></div>
      </div>
    </div>
  );
};

export default function SummaryCards({ user }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;
      try {
        const resumen = await invoke('obtener_resumen_dashboard', { userId: user.id });
        console.log('Resumen recibido:', resumen);

        // ✅ Valores por defecto (si viene null o undefined → 0)
        setStats({
          total_activos: resumen.total_activos ?? 0,
          cambio_activos: resumen.cambio_activos ?? 0,
          total_amenazas: resumen.total_amenazas ?? 0,
          cambio_amenazas: resumen.cambio_amenazas ?? 0,
          total_riesgos: resumen.total_riesgos ?? 0,
          cambio_riesgos: resumen.cambio_riesgos ?? 0,
          total_controles: resumen.total_controles ?? 0,
          cambio_controles: resumen.cambio_controles ?? 0
        });
      } catch (err) {
        console.error('Error cargando resumen:', err);

        // 🚨 Si hay error, mostramos todo en 0
        setStats({
          total_activos: 0,
          cambio_activos: 0,
          total_amenazas: 0,
          cambio_amenazas: 0,
          total_riesgos: 0,
          cambio_riesgos: 0,
          total_controles: 0,
          cambio_controles: 0
        });
      }
    }
    fetchStats();
  }, [user]);

  if (!stats) {
    return <p className="text-white">Cargando resumen...</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Activos"
        value={stats.total_activos}
        change={stats.cambio_activos}
        icon={Shield}
        color="blue"
      />
      <StatCard
        title="Amenazas Activas"
        value={stats.total_amenazas}
        change={stats.cambio_amenazas}
        icon={AlertTriangle}
        color="orange"
      />
      <StatCard
        title="Riesgos Críticos"
        value={stats.total_riesgos}
        change={stats.cambio_riesgos}
        icon={Activity}
        color="red"
      />
      <StatCard
        title="Controles Activos"
        value={stats.total_controles}
        change={stats.cambio_controles}
        icon={CheckCircle}
        color="green"
      />
    </div>
  );
}
