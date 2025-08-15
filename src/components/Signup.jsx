import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function Signup({ onClose, onSignupSuccess, onLogin }) {
  const [form, setForm] = useState({ email: "", password: "", nombre_empresa: "", nit: "" });
  const [error, setError] = useState("");

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async e => {
    e.preventDefault();
    setError("");
    console.log("Registrando usuario:", form);
    try {
      await invoke("registrar_usuario", {
        email: form.email,
        password: form.password,
        nombreEmpresa: form.nombre_empresa,
        nit: form.nit,
      });
      // Enviar directo a Login
      onLogin();
    } catch (err) {
      setError("Error al registrar usuario");
      console.error("Error al registrar usuario:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-sm relative">
        {/* Botón X para cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Regístrate</h2>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <input name="email" type="email" placeholder="Correo electrónico" className="border rounded px-3 py-2" value={form.email} onChange={handleChange} required />
          <input name="password" type="password" placeholder="Contraseña" className="border rounded px-3 py-2" value={form.password} onChange={handleChange} required />
          <input name="nombre_empresa" type="text" placeholder="Nombre de la empresa" className="border rounded px-3 py-2" value={form.nombre_empresa} onChange={handleChange} required />
          <input name="nit" type="text" placeholder="NIT" className="border rounded px-3 py-2" value={form.nit} onChange={handleChange} required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded px-3 py-2 font-semibold hover:bg-blue-600">Registrarse</button>
        </form>
        <div className="mt-4 text-center">
            <p className="mt-4 text-sm text-zinc-400">¿No tienes una cuenta? </p>
          <button className="text-blue-500 hover:underline text-sm" onClick={onLogin}>
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;