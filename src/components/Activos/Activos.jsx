import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import NuevoActivo from './NuevoActivo';
import DetalleActivo from './DetalleActivo';
import { invoke } from "@tauri-apps/api/core";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 }
  }),
};

const Activos = ({ user, reloadActivos }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activos, setActivos] = useState([]);
  const [showNuevo, setShowNuevo] = useState(false);
  const [detalleActivo, setDetalleActivo] = useState(null);
  const [showDetalle, setShowDetalle] = useState(false);

  const getCriticalityColor = (criticality) => {
    switch (criticality) {
      case "Crítico":
        return "bg-red-100 text-red-800 border-red-200";
      case "Alto":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Medio":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Bajo":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const StatCard = ({ title, value, change, color }) => {
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
        <div className="space-y-2">
          <h3 className="text-zinc-400 text-sm font-medium">{title}</h3>
          <p className="text-white text-3xl font-bold">{value}</p>
          <p className={`text-sm ${changeColor}`}>
            {changeSymbol}{change} vs mes anterior
          </p>
        </div>
        <div className="mt-4 w-full bg-zinc-700 rounded-full h-1">
          <div className={`h-1 rounded-full bg-current`} style={{ width: '100%' }}></div>
        </div>
      </div>
    );
  };

  // Filtrado por búsqueda
  const filteredActivos = activos.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportarExcel = () => {
    // Prepara los datos para exportar
    const data = filteredActivos.map(asset => ({
      Nombre: asset.name,
      Tipo: asset.type_,
      Categoría: asset.category,
      Propietario: asset.owner,
      Criticidad: asset.criticality,
      "Última Actualización": asset.last_update,
      Estado: asset.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Activos");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "activos.xlsx");
  };

  useEffect(() => {
    console.log("Usuario recibido en Activos:", user);
    if (user) {
      invoke("get_activos_by_user", { userId: user.id })
        .then(setActivos)
        .catch(console.error);
    } else {
      setActivos([]); // Si no hay usuario, no mostrar activos
    }
  }, [user]);

  return (
    <motion.div
      className="max-w-8xl mx-auto space-y-6"
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeIn} custom={0}>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Gestión de Activos
          </h1>
          <p className="text-white">
            Administre y monitoree todos los activos de su organización
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={fadeIn} custom={1}>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Activos" value={activos.length} change={0} color="blue" />
          <StatCard title="Críticos" value={activos.filter(a => a.criticality === "Crítico").length} change={0} color="red" />
          <StatCard title="Activos Digitales" value={activos.filter(a => a.type_ === "Digital").length} change={0} color="green" />
          <StatCard title="Activos Físicos" value={activos.filter(a => a.type_ === "Físico").length} change={0} color="orange" />
        </div>
      </motion.div>

      {/* Main Content Card */}
      <motion.div variants={fadeIn} custom={2}>
        <div className="bg-zinc-800 rounded-lg border border-zinc-700 shadow-sm">
          {/* Card Header */}
          <div className="p-6 border-b border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Inventario de Activos
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Lista completa de todos los activos registrados
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-zinc-200 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={exportarExcel}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </button>
                <button
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setShowNuevo(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Activo
                </button>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Search and Filter Bar */}
            <motion.div variants={fadeIn} custom={3}>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Buscar activos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-9 pr-3 py-2 border border-zinc-600 rounded-md leading-5 bg-zinc-900 text-white placeholder-zinc-400 focus:outline-none focus:placeholder-zinc-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button className="inline-flex items-center px-3 py-2 border border-zinc-600 shadow-sm text-sm leading-4 font-medium rounded-md text-zinc-200 bg-zinc-700 hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </button>
              </div>
            </motion.div>

            {/* Table */}
            <motion.div variants={fadeIn} custom={4}>
              <div className="overflow-hidden shadow ring-1 ring-zinc-700 ring-opacity-50 md:rounded-lg">
                <table className="min-w-full divide-y divide-zinc-700">
                  <thead className="bg-zinc-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Propietario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Criticidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Última Actualización
                      </th>
                      <th className="px-2 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-zinc-800 divide-y divide-zinc-700">
                    {filteredActivos.map((asset, idx) => (
                      <tr key={idx} className="hover:bg-zinc-700">
                        <td className="px-6 py-4 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis text-sm font-medium text-white">
                          {asset.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-200">
                          {asset.type_}
                        </td>
                        <td className="px-6 py-4 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis text-sm text-zinc-200">
                          {asset.category}
                        </td>
                        <td className="px-6 py-4 max-w-[180px] whitespace-nowrap overflow-hidden text-ellipsis text-sm text-zinc-200">
                          {asset.owner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getCriticalityColor(asset.criticality)}`}>
                            {asset.criticality}
                          </span>
                        </td>
                        <td className="px-6 py-4 max-w-[130px] whitespace-nowrap overflow-hidden text-ellipsis text-sm text-zinc-200">
                          {asset.last_update}
                        </td>
                        <td className="px-2 py-5 whitespace-nowrap">
                          <button
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full border bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200 transition"
                            onClick={() => {
                              setDetalleActivo(asset);
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
      {/* Modal Nuevo Activo */}
      <NuevoActivo
        user={user}
        reloadActivos={reloadActivos}
        open={showNuevo}
        onClose={() => setShowNuevo(false)}
        onSave={nuevo => {
          setActivos(prev => [...prev, nuevo]);
          setShowNuevo(false);
        }}
      />
      {/* Modal Detalle Activo */}
      <DetalleActivo
        activo={detalleActivo}
        open={showDetalle}
        onClose={() => setShowDetalle(false)}
        onDelete={(idEliminado) => {
          setActivos(prev => prev.filter(a => a.id !== idEliminado));
          setShowDetalle(false);
        }}

        onSaveEdit={editado => {
          setActivos(prev => prev.map(a => a === detalleActivo ? { ...editado, lastUpdate: new Date().toISOString().slice(0, 10) } : a));
          setShowDetalle(false);
        }}
      />
    </motion.div>
  );
};

export default Activos;