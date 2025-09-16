// ControlesAplicados.jsx
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

export default function ControlesAplicados({ amenaza, activo }) {
  const [controlesDisponibles, setControlesDisponibles] = useState([]);
  const [controlesAplicados, setControlesAplicados] = useState([]);

  // 📌 Cargar controles disponibles por tipo de amenaza
  useEffect(() => {
    if (!amenaza) return;

    invoke("obtener_controles_por_tipo", { threatType: amenaza.type_ })
      .then((res) => setControlesDisponibles(res || []))
      .catch((err) => console.error("Error cargando controles:", err));

    cargarControlesAplicados();
  }, [amenaza]);

  // 📌 Cargar controles ya aplicados
  const cargarControlesAplicados = () => {
    if (!amenaza) return;
    invoke("obtener_controles_aplicados", { threatId: amenaza.id })
      .then((res) => setControlesAplicados(res || []))
      .catch((err) => console.error("Error cargando controles aplicados:", err));
  };

  // 📌 Aplicar un nuevo control
  const aplicarControl = (controlId) => {
    if (!amenaza || !activo) return;

    invoke("aplicar_control", {
      controlId,
      threatId: amenaza.id,
      assetId: activo.id,
    })
      .then(() => {
        cargarControlesAplicados();
      })
      .catch((err) => console.error("Error aplicando control:", err));
  };

  // 📌 Cambiar estado de un control aplicado
  const cambiarEstado = (id, nuevoEstado) => {
    invoke("actualizar_estado_control", { id, status: nuevoEstado })
      .then(() => cargarControlesAplicados())
      .catch((err) => console.error("Error actualizando estado:", err));
  };

    const eliminarControl = async (id) => {
    try {
      await invoke("eliminar_control_aplicado", { id });
      setControlesAplicados((prev) =>
        prev.filter((c) => c.id !== id)
      );
    } catch (err) {
      console.error("Error eliminando control:", err);
    }
  };

  if (!amenaza) return null;

  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border p-6 mt-6">
      <h3 className="text-white text-lg font-bold mb-4">
        🛡️ Controles para la amenaza: {amenaza.name}
      </h3>

      {/* Controles disponibles */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-2">Controles disponibles</h4>
        {controlesDisponibles.length > 0 ? (
          <div className="space-y-2">
            {controlesDisponibles.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-[#111827] p-3 rounded-md"
              >
                <div>
                  <p className="text-white font-medium">{c.name}</p>
                  <p className="text-gray-400 text-sm">{c.description}</p>
                </div>
                <button
                  onClick={() => aplicarControl(c.id)}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                >
                  Aplicar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No hay controles disponibles</p>
        )}
      </div>

      {/* Controles aplicados */}
      <div>
        <h4 className="text-white font-semibold mb-2">Controles aplicados</h4>
        {controlesAplicados.length > 0 ? (
          <div className="space-y-2">
            {controlesAplicados.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between bg-[#111827] p-3 rounded-md"
              >
                <div>
                  <p className="text-white font-medium">{c.control_name}</p>
                  <p className="text-gray-400 text-sm">Estado: {c.status}</p>
                </div>
                <select
                  value={c.status}
                  onChange={(e) => cambiarEstado(c.id, e.target.value)}
                  className="bg-zinc-800 text-white rounded-md px-2 py-1"
                >
                  <option>Pendiente</option>
                  <option>Implementado</option>
                  <option>Verificado</option>
                </select>

                {/* ❌ Botón eliminar */}
                <button
                  onClick={() => eliminarControl(c.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                  title="Eliminar control"
                >
                  <X className="h-4 w-4" />
                </button>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No se han aplicado controles</p>
        )}
      </div>
    </div>
  );
}
