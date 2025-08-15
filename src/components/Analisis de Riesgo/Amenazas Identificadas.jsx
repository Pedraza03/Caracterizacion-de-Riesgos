// AmenazasIdentificadas.jsx
import React from "react";
import { getRiskColor } from "../../utils/risks";

export default function AmenazasIdentificadas({
  amenazas = [],
  calcularRiesgoCualitativo,
  onSelectAmenaza, // <- función para enviar la amenaza seleccionada
  amenazaSeleccionadaId, // <- para marcar cuál está activa
}) {
  const normalizeLevel = (level) => {
    if (!level) return "";
    const val = level.toString().trim().toLowerCase();
    if (["critica", "crítico", "critico"].includes(val)) return "Crítico";
    if (val === "alta" || val === "alto") return "Alto";
    if (val === "media" || val === "medio") return "Medio";
    if (val === "baja" || val === "bajo") return "Bajo";
    return level;
  };

  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border p-6">
      <h3 className="text-white text-lg font-bold mb-4">
        🚨 Amenazas Identificadas ({amenazas.length})
      </h3>

      <div className="space-y-3">
        {amenazas.map((a) => {
          const severidad = normalizeLevel(a.severity);
          const frecuencia = normalizeLevel(a.frecuencia);
          const riesgoFinal = calcularRiesgoCualitativo(severidad, frecuencia);


          const isSelected = a.id === amenazaSeleccionadaId;

          return (
            <div
              key={a.id}
              onClick={() => onSelectAmenaza?.(a)} // <- seleccionar amenaza
              className={`rounded-lg p-4 border cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-400 ring-2 ring-blue-500"
                  : "border-gray-200"
              } bg-[#111827] shadow-sm hover:border-blue-400`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{"⚠️"}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{a.name}</h4>
                  </div>

                  <p className="text-sm text-white mb-3">
                    {a.description || ""}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                      {a.type_}
                    </span>

                    <div className="text-xs text-white">
                      <p className="font-medium mb-1">🔍 Análisis Cualitativo</p>
                      <p className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(frecuencia).bg} ${getRiskColor(frecuencia).text}`}
                        >
                          {frecuencia}
                        </span>
                        x
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(severidad).bg} ${getRiskColor(severidad).text}`}
                        >
                          {severidad}
                        </span>
                        =
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${getRiskColor(riesgoFinal).bg} ${getRiskColor(riesgoFinal).text}`}
                        >
                          {riesgoFinal}
                        </span>
                      </p>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}