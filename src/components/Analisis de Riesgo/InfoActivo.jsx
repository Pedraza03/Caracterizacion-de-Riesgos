// InfoActivo.jsx
import React from "react";
import { getRiskColor } from "../../utils/risks";

export default function InfoActivo({ activo }) {
  if (!activo) return null;
  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border p-6">
      <h3 className="text-white text-lg font-bold mb-4">🖥️ Información del Activo</h3>
      <div className="bg-[#111827] from-blue-50 to-indigo-50 rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-white">Nombre</p>
            <p className="text-white font-semibold">{activo.name || activo.nombre}</p>
          </div>
          <div>
            <p className="text-sm text-white">Categoría</p>
            <p className="text-white font-semibold">{activo.category || activo.categoria || activo.type_}</p>
          </div>
          <div>
            <p className="text-sm text-white">Criticidad</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(activo.criticality || activo.criticidad).bg} ${getRiskColor(activo.criticality || activo.criticidad).text}`}>
              {activo.criticality || activo.criticidad || "Medio"}
            </span>
          </div>
          <div>
            <p className="text-sm text-white">Propietario</p>
            <p className="font-semibold text-white">{activo.owner || activo.propietario || "Desconocido"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
