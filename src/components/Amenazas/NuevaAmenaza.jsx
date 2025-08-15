import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const amenazasDigitales = [
  "Malware / Ransomware",
  "Phishing",
  "Ataques DDoS",
  "Pérdida de datos",
  "Intercepción de datos",
  "Ataques MITM (Man-In-The-Middle)",
  "Saturación de ancho de banda",
  "Personalizada..."
];

const amenazasFisicas = [
  "Incendios",
  "Robo o vandalismo",
  "Daños por agua o desastres naturales",
  "Intercepción de datos",
  "Ataques MITM (Man-In-The-Middle)",
  "Saturación de ancho de banda",
  "Personalizada..."
];

export default function NuevaAmenaza({ user, open, onClose, onSave }) {
  const [activos, setActivos] = useState([]);
  const [amenaza, setAmenaza] = useState({
    assetId: "",
    name: "",
    description: "",
    type: "",
    severity: "",
    frecuencia: "",
  });

  const [customThreat, setCustomThreat] = useState("");

  // Cargar activos del usuario
  useEffect(() => {
    if (user) {
      invoke("get_activos_by_user", { userId: user.id })
        .then(setActivos)
        .catch(console.error);
    }
  }, [user]);

  if (!open) return null;

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAmenaza((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const nombreFinal =
        amenaza.name === "Personalizada..." ? customThreat : amenaza.name;

      if (!amenaza.assetId || Number(amenaza.assetId) === 0) {
        alert("Seleccione un activo válido");
        return;
      }

      // Llamamos al comando de Rust y obtenemos el Threat con ID real
      const threatCreated = await invoke("crear_amenaza", {
        name: nombreFinal,
        description: amenaza.description || null,
        type: amenaza.type,       // Rust espera type_
        severity: amenaza.severity,
        frecuencia: amenaza.frecuencia,
        assetId: Number(amenaza.assetId), // Rust espera asset_id
      });

      // Enviamos a React el objeto con el ID real
      onSave({
        ...threatCreated,
        type: threatCreated.type_,    // Mapeamos type_ -> type
        assetId: threatCreated.asset_id,  // Mapeamos asset_id -> assetId
      });

      onClose(); // Cerramos el modal
    } catch (err) {
      console.error("Error al guardar amenaza:", err);
      alert("Error al guardar amenaza");
    }
  };


  // Obtener lista dinámica de amenazas según el tipo de activo
  const getThreatList = () => {
    const activo = activos.find((a) => a.id === parseInt(amenaza.assetId));
    if (!activo) return [];
    return activo.type_ === "Digital" ? amenazasDigitales : amenazasFisicas;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Nueva Amenaza</h2>

        <form className="flex flex-col gap-4" onSubmit={handleSave}>
          {/* Seleccionar activo */}
          <select
            name="assetId"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={amenaza.assetId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un Activo</option>
            {activos.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.type_})
              </option>
            ))}
          </select>

          {/* Seleccionar amenaza */}
          <select
            name="name"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={amenaza.name}
            onChange={handleChange}
            required
            disabled={!amenaza.assetId}
          >
            <option value="">Seleccione una Amenaza</option>
            {getThreatList().map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Campo para amenaza personalizada */}
          {amenaza.name === "Personalizada..." && (
            <input
              type="text"
              placeholder="Escriba su amenaza personalizada"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={customThreat}
              onChange={(e) => setCustomThreat(e.target.value)}
              required
            />
          )}

          {/* Descripción */}
          <textarea
            name="description"
            placeholder="Descripción (opcional)"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={amenaza.description}
            onChange={handleChange}
          ></textarea>

          {/* Tipo */}
          <select
            name="type"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={amenaza.type}
            onChange={handleChange}
            required
          >
            <option value="">Tipo de Amenaza</option>
            <option value="Natural">Natural</option>
            <option value="Técnica">Técnica</option>
            <option value="Humana">Humana</option>
            <option value="Accidental">Accidental</option>
          </select>

          {/* Severidad */}
          <select
            name="severity"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={amenaza.severity}
            onChange={handleChange}
            required
          >
            <option value="">Severidad</option>
            <option value="Crítico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>

          {/* frecuencia */}
          <select
            name="frecuencia"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={amenaza.frecuencia}
            onChange={handleChange}
            required
          >
            <option value="">frecuencia</option>
              <option value="Crítico ">Crítico ≥ 1 vez al mes</option>
              <option value="Alto">Alto 1 vez cada 2-6 meses</option>
              <option value="Medio">Medio 1 vez al año</option>
              <option value="Bajo">Bajo Cada 2-5 años</option>
          </select>

          {/* Botones */}
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-green-500 text-white rounded px-3 py-2 font-semibold hover:bg-green-600"
            >
              Guardar Amenaza
            </button>
            <button
              type="button"
              className="bg-zinc-500 text-white rounded px-3 py-2 font-semibold hover:bg-zinc-600"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
