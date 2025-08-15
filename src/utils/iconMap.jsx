// src/utils/iconMap.js
import {
  FaDesktop, FaMobileAlt, FaFolder, FaShieldAlt, FaGlobe, FaMicrochip,
  FaDatabase, FaNetworkWired, FaServer, FaFileAlt, FaCloud,
  FaUserShield, FaUsers, FaLock, FaKey, FaCamera, FaBalanceScale,
  FaBug, FaLaptopCode, FaBuilding, FaFireAlt, FaBatteryFull
} from "react-icons/fa";

const iconMap = [
  // Equipos y hardware
  { keywords: ["pc", "computador", "desktop", "equipo"], icon: <FaDesktop className="w-6 h-6 text-blue-400" /> },
  { keywords: ["celular", "phone", "móvil", "smartphone"], icon: <FaMobileAlt className="w-6 h-6 text-green-400" /> },
  { keywords: ["procesador", "cpu", "micro"], icon: <FaMicrochip className="w-6 h-6 text-purple-400" /> },
  { keywords: ["servidor", "server"], icon: <FaServer className="w-6 h-6 text-gray-400" /> },
  { keywords: ["red", "network", "router"], icon: <FaNetworkWired className="w-6 h-6 text-orange-400" /> },
  { keywords: ["batería", "energia", "power"], icon: <FaBatteryFull className="w-6 h-6 text-lime-400" /> },

  // Software y datos
  { keywords: ["carpeta", "folder", "archivo"], icon: <FaFolder className="w-6 h-6 text-yellow-400" /> },
  { keywords: ["base de datos", "database", "sql"], icon: <FaDatabase className="w-6 h-6 text-pink-400" /> },
  { keywords: ["documento", "file", "text"], icon: <FaFileAlt className="w-6 h-6 text-teal-400" /> },
  { keywords: ["nube", "cloud", "saas"], icon: <FaCloud className="w-6 h-6 text-sky-400" /> },
  { keywords: ["web", "internet", "online", "página"], icon: <FaGlobe className="w-6 h-6 text-indigo-400" /> },
  { keywords: ["app", "aplicación", "software"], icon: <FaLaptopCode className="w-6 h-6 text-cyan-400" /> },

  // Seguridad
  { keywords: ["seguridad", "security", "protección"], icon: <FaShieldAlt className="w-6 h-6 text-red-400" /> },
  { keywords: ["usuario seguro", "user", "auth", "autenticación"], icon: <FaUserShield className="w-6 h-6 text-emerald-400" /> },
  { keywords: ["usuarios", "empleados", "equipo humano"], icon: <FaUsers className="w-6 h-6 text-purple-300" /> },
  { keywords: ["clave", "contraseña", "password", "key"], icon: <FaKey className="w-6 h-6 text-amber-400" /> },
  { keywords: ["lock", "cerrar", "bloquear", "encriptar"], icon: <FaLock className="w-6 h-6 text-gray-300" /> },

  // Auditoría y legal
  { keywords: ["ley", "legal", "compliance", "norma"], icon: <FaBalanceScale className="w-6 h-6 text-yellow-500" /> },
  { keywords: ["auditoría", "inspección", "política"], icon: <FaFileAlt className="w-6 h-6 text-blue-500" /> },

  // Amenazas y riesgos
  { keywords: ["bug", "vulnerabilidad", "fallo"], icon: <FaBug className="w-6 h-6 text-rose-400" /> },
  { keywords: ["incendio", "fuego"], icon: <FaFireAlt className="w-6 h-6 text-red-500" /> },
  { keywords: ["cámara", "video", "vigilancia"], icon: <FaCamera className="w-6 h-6 text-gray-200" /> },

  // Infraestructura física
  { keywords: ["oficina", "empresa", "edificio"], icon: <FaBuilding className="w-6 h-6 text-slate-400" /> },
];

export default function getIconForAsset(name) {
  if (!name) return <FaDesktop className="w-6 h-6 text-blue-400" />; // Ícono por defecto
  const lowerName = name.toLowerCase();

  for (const { keywords, icon } of iconMap) {
    if (keywords.some(keyword => lowerName.includes(keyword))) {
      return icon;
    }
  }

  return <FaDesktop className="w-6 h-6 text-red-400" />; // Si no coincide, usa el default
}
