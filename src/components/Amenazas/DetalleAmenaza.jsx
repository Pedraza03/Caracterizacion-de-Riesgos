import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

export default function DetalleAmenaza({ amenaza, activos = [], open, onClose, onSaveEdit, onDelete }) {
  const [form, setForm] = useState({
    id: null,
    assetId: null,
    name: "",
    description: "",
    type: "",
    severity: "",
    frecuencia: "",
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (amenaza) {
      console.log("Cargando amenaza:", amenaza);
      // Convertimos asset_id y type_ a camelCase
      setForm({
        ...amenaza,
        assetId: amenaza.assetId || amenaza.asset_id || null,
        type: amenaza.type || amenaza.type_ || "",
      });
      setEditMode(false);
    }
  }, [amenaza]);

  if (!open || !amenaza) return null;

  const activo = activos.find((a) => a.id === form.assetId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.id) {
      console.error("Error: ID de amenaza no definido", form);
      alert("Error: ID de amenaza no definido");
      return;
    }

    try {
      await invoke("editar_amenaza", {
        id: form.id,
        name: form.name,
        description: form.description || null,
        type: form.type,      // Rust espera type_
        severity: form.severity,
        frecuencia: form.frecuencia,
        assetId: form.assetId, // Rust espera asset_id
      });
      onSaveEdit(form);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar cambios");
    }
  };

  const handleDelete = async () => {
    if (!form.id) {
      console.error("Error: ID de amenaza no definido", form);
      alert("Error: No se puede eliminar una amenaza sin ID válido.");
      return;
    }
    if (!window.confirm("¿Seguro que deseas eliminar esta amenaza?")) return;

    try {
      await invoke("eliminar_amenaza", { id: form.id });
      onDelete(form.id);
    } catch (err) {
      console.error("Error al eliminar amenaza:", err);
      alert("Error al eliminar la amenaza");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Detalle de Amenaza</h2>

        {!editMode ? (
          <div className="space-y-2 text-white">
            <div><b>Activo:</b> {activo ? activo.name : "Desconocido"}</div>
            <div><b>Amenaza:</b> {form.name}</div>
            <div><b>Descripción:</b> {form.description || "Sin descripción"}</div>
            <div><b>Tipo:</b> {form.type}</div>
            <div><b>Severidad:</b> {form.severity}</div>
            <div><b>frecuencia:</b> {form.frecuencia}</div>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <input
              type="text"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={`Activo: ${activo ? activo.name : "Desconocido"}`}
              readOnly
            />
            <input
              type="text"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={`Amenaza: ${form.name}`}
              readOnly
            />
            <textarea
              name="description"
              placeholder="Descripción (opcional)"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.description || ""}
              onChange={handleChange}
            ></textarea>
            <select
              name="type"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Tipo de Amenaza</option>
              <option value="Natural">Natural</option>
              <option value="Técnica">Técnica</option>
              <option value="Humana">Humana</option>
              <option value="Accidental">Accidental</option>
            </select>
            <select
              name="severity"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.severity}
              onChange={handleChange}
              required
            >
              <option value="">Severidad</option>
              <option value="Crítico">Crítico</option>
              <option value="Alto">Alto</option>
              <option value="Medio">Medio</option>
              <option value="Bajo">Bajo</option>
            </select>
            <select
              name="frecuencia"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.frecuencia}
              onChange={handleChange}
              required
            >
              <option value="">frecuencia</option>
              <option value="Crítico">Crítico ≥ 1 vez al mes</option>
              <option value="Alto">Alto 1 vez cada 2-6 meses</option>
              <option value="Medio">Medio 1 vez al año</option>
              <option value="Bajo">Bajo Cada 2-5 años</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="bg-green-500 text-white rounded px-3 py-2 font-semibold hover:bg-green-600"
              >
                Guardar Cambios
              </button>
              <button
                type="button"
                className="bg-zinc-500 text-white rounded px-3 py-2 font-semibold hover:bg-zinc-600"
                onClick={() => setEditMode(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {!editMode && (
          <div className="flex gap-2 mt-6">
            <button
              className="bg-blue-500 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600"
              onClick={() => setEditMode(true)}
            >
              Editar
            </button>
            <button
              className="bg-red-500 text-white rounded px-3 py-2 font-semibold hover:bg-red-600"
              onClick={handleDelete}
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
