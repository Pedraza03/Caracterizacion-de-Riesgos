// ActivosCarousel.jsx
import React from "react";
import getIconForAsset from "../../utils/iconMap";
import { getRiskColor } from "../../utils/risks";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
  const totalPages = Math.max(1, Math.ceil(activos.length / itemsPerPage));
  const activosVisibles = activos.slice(carouselIndex * itemsPerPage, (carouselIndex + 1) * itemsPerPage);

  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border p-6 relative">
      <h2 className="text-white text-xl font-bold mb-4">Seleccionar Activo para Análisis</h2>

      <button
        onClick={prevPage}
        disabled={totalPages <= 1}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-zinc-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-600 text-white"
      >
        <FaChevronLeft />
      </button>

      <div className="mx-12 grid grid-cols-4 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {activosVisibles.map((activo) => (
          <div
            key={activo.id}
            onClick={() => { setSelectedActivo(activo.id); }}
            className={`cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 ${
              selectedActivo === activo.id ? "border-blue-500" : "border-gray-500"
            }`}
          >
            <div className="text-center">
              <div>{getIconForAsset(activo.name || activo.nombre)}</div>
              <h3 className=" text-white font-semibold text-xl sm:text-xl mb-1">{activo.name || activo.nombre}</h3>
              <div className="flex justify-center mb-1">
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRiskColor(activo.criticality || activo.criticidad || "Medio").bg} ${getRiskColor(activo.criticality || activo.criticidad || "Medio").text}`}>
                  {activo.criticality || activo.criticidad || "Medio"}
                </span>
              </div>
              <p className="text-sm text-gray-500">{activo.type_ || activo.tipo || activo.category || ""}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={nextPage}
        disabled={totalPages <= 1}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-zinc-800 w-10 h-10 flex items-center justify-center rounded-full shadow-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-600 text-white"
      >
        <FaChevronRight />
      </button>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCarouselIndex(i)}
              className={`w-2 h-2 rounded-full ${i === carouselIndex ? "bg-blue-500" : "bg-gray-300"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
