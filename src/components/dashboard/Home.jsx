import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import SummaryCards from "../dashboard/SummaryCards";
import RiskPieChart from "../dashboard/RiskPieChart";
import QuickActions from "../dashboard/QuickActions";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 }
  }),
};

export default function Home({ user }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!user) return;

    invoke("obtener_resumen_dashboard", { userId: user.id })
      .then((res) => {
        console.log("✅ Resumen recibido:", res);
        setData(res); // 🔹 aquí res ya debe traer summary, activos, riesgos, controles
      })
      .catch((error) => console.error("Error al obtener resumen:", error));
  }, [user]);

  return (
    <motion.div
      className="flex flex-col gap-6"
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeIn} custom={0}>
        <h1 className="text-3xl font-bold text-white">Dashboard de Riesgos</h1>
        <p className="text-white">Monitoreo integral de la seguridad de su emprendimiento digital</p>
      </motion.div>

      {user ? (
        <motion.div variants={fadeIn} custom={1}>
          <SummaryCards user={user} />
        </motion.div>
      ) : (
        <p className="text-gray-400">Inicia sesión para ver el resumen.</p>
      )}

      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={fadeIn} custom={2}>
        <RiskPieChart
          riesgos={{
            critico: data?.riesgos_critico ?? 0,
            alto: data?.riesgos_alto ?? 0,
            medio: data?.riesgos_medio ?? 0,
            bajo: data?.riesgos_bajo ?? 0,
          }}
        />
        <QuickActions data={data} />
      </motion.div>
    </motion.div>
  );
}
