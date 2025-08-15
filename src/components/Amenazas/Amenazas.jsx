import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { invoke } from "@tauri-apps/api/core";
import NuevaAmenaza from '../Amenazas/NuevaAmenaza.jsx';
import DetalleAmenaza from '../Amenazas/DetalleAmenaza.jsx';

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 }
  }),
};

const Amenazas = ({ user, activos,  reloadActivos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [amenazas, setAmenazas] = useState([]);
  const [showNueva, setShowNueva] = useState(false);
  const [detalleAmenaza, setDetalleAmenaza] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Crítico": return "bg-red-100 text-red-800 border-red-200";
      case "Alto": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Medio": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Bajo": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getFrecuenciaColor = (frecuencia) => {
    switch (frecuencia) {
      case "Crítico": return "bg-red-100 text-red-800 border-red-200";
      case "Alto": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Medio": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Bajo": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredAmenazas = amenazas.filter(threat =>
    threat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportarExcel = () => {
    const data = filteredAmenazas.map(threat => ({
      Nombre: threat.name,
      Descripción: threat.description || "No especificada",
      Tipo: threat.type,
      Severidad: threat.severity,
      frecuencia: threat.frecuencia,
      "Activo Asociado": activos.find(a => Number(a.id) === Number(threat.assetId))?.name || "Desconocido",
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Amenazas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "amenazas.xlsx");
  };

  useEffect(() => {
    if (user && activos.length > 0) {
      Promise.all(
        activos.map(activo =>
          invoke("obtener_amenazas_por_activo", { assetId: activo.id })
            .then(res => (res || []).map(threat => ({
              ...threat,
              type: threat.type_ || "",
              assetId: threat.asset_id || threat.assetId,
            })))
            .catch(() => [])
        )
      ).then(results => {
        const allThreats = results.flat();
        setAmenazas(allThreats);
      });
    } else {
      setAmenazas([]);
    }
  }, [user, activos]);

  return (
    <motion.div className="max-w-8xl mx-auto space-y-6" initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={fadeIn} custom={0}>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">Gestión de Amenazas</h1>
          <p className="text-white">Identificación y evaluación de amenazas de seguridad.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeIn} custom={1}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-zinc-800 border rounded-xl p-6 text-blue-400 bg-blue-500/10 border-blue-500/20">
            <h3 className="text-zinc-400 text-sm font-medium">Total Amenazas</h3>
            <p className="text-white text-3xl font-bold">{amenazas.length}</p>
          </div>
          <div className="bg-zinc-800 border rounded-xl p-6 text-red-400 bg-red-500/10 border-red-500/20">
            <h3 className="text-zinc-400 text-sm font-medium">Críticas</h3>
            <p className="text-white text-3xl font-bold">{amenazas.filter(a => a.severity === "Crítico").length}</p>
          </div>
          <div className="bg-zinc-800 border rounded-xl p-6 text-yellow-400 bg-yellow-500/10 border-yellow-500/20">
            <h3 className="text-zinc-400 text-sm font-medium">Emergentes</h3>
            <p className="text-white text-3xl font-bold">{amenazas.filter(a => a.severity === "Alto").length}</p>
          </div>
          <div className="bg-zinc-800 border rounded-xl p-6 text-green-400 bg-green-500/10 border-green-500/20">
            <h3 className="text-zinc-400 text-sm font-medium">Mitigadas</h3>
            <p className="text-white text-3xl font-bold">{[...new Set(amenazas.map(a => a.assetId))].length}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Table */}
      <motion.div variants={fadeIn} custom={2}>
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 shadow-sm">
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Lista de Amenazas</h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Todas las amenazas registradas para los activos del usuario
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-zinc-200 bg-zinc-700 hover:bg-zinc-600"
                  onClick={exportarExcel}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </button>
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNueva(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Amenaza
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-6">
            <motion.div variants={fadeIn} custom={3}>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar amenazas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-zinc-600 rounded-md leading-5 bg-zinc-900 text-white"
                  />
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-zinc-600 text-sm leading-4 font-medium rounded-md text-zinc-200 bg-zinc-700 hover:bg-zinc-600">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </button>
              </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={fadeIn} custom={4}>
              <div className="overflow-hidden shadow ring-1 ring-zinc-700 md:rounded-lg">
                <table className="min-w-full divide-y divide-zinc-700">
                  <thead className="bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Activo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Severidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Frecuencia</th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-zinc-400 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-800 divide-y divide-zinc-700">
                    {filteredAmenazas.map((threat, idx) => (
                      <tr key={idx} className="hover:bg-zinc-700">
                        <td className="px-6 py-4 text-sm text-white">{threat.name}</td>
                        <td className="px-6 py-4 text-sm text-zinc-200">{threat.type}</td>
                        <td className="px-6 py-4 text-sm text-zinc-200">
                          {activos.find(a => Number(a.id) === Number(threat.assetId))?.name || "Desconocido"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getSeverityColor(threat.severity)}`}>
                            {threat.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getFrecuenciaColor(threat.frecuencia)}`}>
                            {threat.frecuencia}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200"
                            onClick={() => {
                              setDetalleAmenaza(threat);
                              setShowDetalle(true);
                            }}
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {showNueva && (
        <NuevaAmenaza
          user={user}
          open={showNueva}
          onClose={() => setShowNueva(false)}
          onSave={(newThreat) => {
            setAmenazas([...amenazas, newThreat]);
            reloadActivos();  // <- Recarga los activos
          }}
        />
      )}

      {showDetalle && (
        <DetalleAmenaza
          amenaza={detalleAmenaza}
          activos={activos}
          open={showDetalle}
          onClose={() => setShowDetalle(false)}
          onSaveEdit={(updatedThreat) => {
            setAmenazas(amenazas.map(a => (a.id === updatedThreat.id ? updatedThreat : a)));
            setShowDetalle(false);
          }}
          onDelete={(id) => {
            setAmenazas(amenazas.filter(a => a.id !== id));
            setShowDetalle(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default Amenazas;
