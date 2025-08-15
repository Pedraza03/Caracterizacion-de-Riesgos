
import { motion } from 'framer-motion';
import SummaryCards from "@/components/dashboard/SummaryCards";
import RiskPieChart from "@/components/dashboard/RiskPieChart";
import QuickActions from "@/components/dashboard/QuickActions";
import IndicatorsGrid from "@/components/dashboard/IndicatorsGrid";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 }
  }),
};

export default function Home() {
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
      <motion.div variants={fadeIn} custom={1}>
        <SummaryCards />
      </motion.div>
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={fadeIn} custom={2}>
        <RiskPieChart />
        <QuickActions />
      </motion.div>
      <motion.div variants={fadeIn} custom={3}>
        <IndicatorsGrid />
      </motion.div>
    </motion.div>
  );
}