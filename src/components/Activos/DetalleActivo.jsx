import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

const tipoActivoLista = [
  "HW-(Hardware)",
  "SW-(Software)",
  "D-(Datos/ Informacion)",
  "AUX-(Equipamiento Auxiliar)",
  "L-(Instalaciones)",
  "COM-(Redes de Comunicaciones)"
];

export default function DetalleActivo({ activo, open, onClose, onDelete, onSaveEdit }) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(activo || {});

  // Sincroniza el formulario si cambia el activo
  useEffect(() => {
    if (activo) {
    setForm({
      ...activo,
      type_: activo.type_ || "", // aseguramos que esté presente
    });
  }
    setEditMode(false);
  }, [activo, open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este activo?")) return;

    try {
      await invoke("eliminar_activo", { id: activo.id });
      alert("Activo eliminado correctamente.");
      onDelete(activo.id); // Actualiza la lista en el componente padre
    } catch (err) {
      const errorMsg = err.toString();
      console.error("Error al eliminar activo:", errorMsg);

      if (errorMsg.includes("FOREIGN KEY constraint failed")) {
        alert("⚠️ No se puede eliminar este activo porque tiene amenazas asociadas.\nPor favor, elimina las amenazas primero.");
      } else {
        alert("Error al eliminar activo: " + errorMsg);
      }
    }
  };


  const handleSave = async (e) => {
    e.preventDefault();
    if (
      form.name &&
      form.type_ &&
      form.category &&
      form.owner &&
      form.criticality
    ) {
      try {
        const fechaActual = new Date().toISOString().slice(0, 10);
        await invoke("editar_activo", {
          id: activo.id,
          name: form.name,
          type: form.type_,
          category: form.category,
          owner: form.owner,
          criticality: form.criticality,
          status: form.status,
          lastUpdate: fechaActual,
        });
        onSaveEdit({ ...form, last_update: fechaActual });
        setEditMode(false);
      } catch (err) {
        console.error("Error al guardar cambios:", err);
        alert("Error al guardar cambios");
      }
    }
  };

  if (!open || !activo) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Detalle del Activo</h2>

        {!editMode ? (
          <div className="space-y-2 text-white">
            <div><b>Nombre:</b> {activo.name}</div>
            <div><b>Tipo:</b> {activo.type_}</div>
            <div><b>Categoría:</b> {activo.category}</div>
            <div><b>Propietario:</b> {activo.owner}</div>
            <div><b>Criticidad:</b> {activo.criticality}</div>
            <div><b>Última Actualización:</b> {activo.last_update}</div>
            <div><b>Estado:</b> {activo.status}</div>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSave}>
            <input
              name="name"
              type="text"
              placeholder="Nombre"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <select
              name="type_"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.type_ || ""}
              onChange={handleChange}
              required
            >
              <option value="">Tipo</option>
              <option value="Físico">Físico</option>
              <option value="Digital">Digital</option>
            </select>
            <select
              name="category"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.category || ""}
              onChange={handleChange}
              required
            >
              <option value="">Categoría</option>
              {tipoActivoLista.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              name="owner"
              type="text"
              placeholder="Propietario"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.owner || ""}
              onChange={handleChange}
              required
            />
            <select
              name="criticality"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={form.criticality || ""}
              onChange={handleChange}
              required
            >
              <option value="">Criticidad</option>
              <option value="Crítico">Crítico</option>
              <option value="Alto">Alto</option>
              <option value="Medio">Medio</option>
              <option value="Bajo">Bajo</option>
            </select>
            <input
              type="text"
              className="border rounded px-3 py-2 bg-zinc-900 text-white"
              value={`Última actualización: ${form.last_update || ""}`}
              disabled
              readOnly
            />
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
