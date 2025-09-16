// ActivosCarousel.jsx
import React, { useState } from "react";
import getIconForAsset from "../../utils/iconMap";
import { getRiskColor } from "../../utils/risks";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Search, Filter } from "lucide-react"; // 👈 Importar iconos de búsqueda y filtro

export default function ActivosCarousel({
  activos = [],
  selectedActivo,
  setSelectedActivo,
  carouselIndex,
  setCarouselIndex,
  itemsPerPage = 4,
  nextPage,
  prevPage,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // 🔎 Filtrado por búsqueda
  const filteredActivos = activos.filter((asset) =>
    (asset.name || asset.nombre || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredActivos.length / itemsPerPage));

  const activosVisibles = filteredActivos.slice(
    carouselIndex * itemsPerPage,
    (carouselIndex + 1) * itemsPerPage
  );

  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border p-6 relative">
      <h2 className="text-white text-xl font-bold mb-4">
        Seleccionar Activo para Análisis
      </h2>

      {/* 🔍 Search and Filter Bar */}
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
      </div>

      {/* Botón izquierdo */}
      <button
        onClick={prevPage}
        disabled={totalPages <= 1}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-600 text-white"
      >
        <FaChevronLeft />
      </button>

      {/* Grid de activos */}
      <div className="mx-12 grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activosVisibles.length > 0 ? (
          activosVisibles.map((activo) => (
            <div
              key={activo.id}
              onClick={() => setSelectedActivo(activo.id)}
              className={`cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 ${
                selectedActivo === activo.id
                  ? "border-blue-500"
                  : "border-gray-500"
              }`}
            >
              <div className="text-center">
                <div>{getIconForAsset(activo.name || activo.nombre)}</div>
                <h3 className=" text-white font-semibold text-xl sm:text-xl mb-1">
                  {activo.name || activo.nombre}
                </h3>
                <div className="flex justify-center mb-1">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-medium ${
                      getRiskColor(
                        activo.criticality || activo.criticidad || "Medio"
                      ).bg
                    } ${
                      getRiskColor(
                        activo.criticality || activo.criticidad || "Medio"
                      ).text
                    }`}
                  >
                    {activo.criticality || activo.criticidad || "Medio"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {activo.type_ || activo.tipo || activo.category || ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-4 text-center text-gray-400">
            No se encontraron activos
          </p>
        )}
      </div>

      {/* Botón derecho */}
      <button
        onClick={nextPage}
        disabled={totalPages <= 1}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-600 text-white"
      >
        <FaChevronRight />
      </button>

      {/* Indicadores de paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2 h-2 rounded-full ${
                i === carouselIndex ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
