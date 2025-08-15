import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

const tipoActivoLista = [
  "HW-(Hardware)",
  "SW-(Software)",
  "D-(Datos/ Informacion)",
  "AUX-(Equipamiento Auxiliar)",
  "L-(Instalaciones)",
  "COM-(Redes de Comunicaciones)"
];

const initialState = {
  name: "",
  type: "",
  category: "",
  owner: "",
  criticality: "",
  status: "Activo",
};

export default function NuevoActivo({ open, onClose, onSave, user, reloadActivos }) {
  const [form, setForm] = useState(initialState);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Guardando activo para usuario:", user);
    console.log("Datos del activo:", form);
    if (!user) {
    alert("No hay usuario logueado. Por favor, inicia sesión.");
    return;
  }
    if (form.name && form.type && form.category && form.owner && form.criticality) {
      const fechaActual = new Date().toISOString().slice(0, 10);
      try {
        const nuevoId = await invoke("crear_activo", {
          name: form.name,
          type: form.type,
          category: form.category,
          owner: form.owner,
          criticality: form.criticality,
          status: form.status,
          lastUpdate: fechaActual, // <-- usa lastUpdate, no last_update
          userId: user.id,
        });
        reloadActivos(); // Recargar activos después de guardar
        onSave({ id: nuevoId, ...form, last_update: fechaActual, type_: form.type }); // Asegúrate de que el tipo sea consistente
        setForm(initialState);
      } catch (err) {
        alert("Error al guardar activo: " + err);
        console.error("Error al guardar activo:", err);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-white">Nuevo Activo</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input name="name" type="text" placeholder="Nombre" className="border rounded px-3 py-2 bg-zinc-900 text-white" value={form.name} onChange={handleChange} required />
          
          {/* Tipo: Físico/Digital */}
          <select name="type" className="border rounded px-3 py-2 bg-zinc-900 text-white" value={form.type} onChange={handleChange} required>
            <option value="">Tipo</option>
            <option value="Físico">Físico</option>
            <option value="Digital">Digital</option>
          </select>
          
          {/* Categoría */}
          <select name="category" className="border rounded px-3 py-2 bg-zinc-900 text-white" value={form.category} onChange={handleChange} required>
            <option value="">Categoría</option>
            {tipoActivoLista.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <input name="owner" type="text" placeholder="Propietario" className="border rounded px-3 py-2 bg-zinc-900 text-white" value={form.owner} onChange={handleChange} required />

          <select name="criticality" className="border rounded px-3 py-2 bg-zinc-900 text-white" value={form.criticality} onChange={handleChange} required>
            <option value="">Criticidad</option>
            <option value="Crítico">Crítico</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
          
          {/* Última actualización solo visual, no editable */}
          <input
            type="text"
            className="border rounded px-3 py-2 bg-zinc-900 text-white"
            value={`Fecha de ingreso: ${new Date().toISOString().slice(0, 10)}`}
            disabled
            readOnly
          />

          <button type="submit" className="bg-blue-500 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600">Guardar</button>
        </form>
      </div>
    </div>
  );
}