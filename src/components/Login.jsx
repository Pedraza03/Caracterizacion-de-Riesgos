import React, { useState } from 'react';
import { invoke } from "@tauri-apps/api/core";
import NuevoActivo from './Activos/NuevoActivo'; 

function Login({ onClose, onSignup, onLoginSuccess }) {
  const [form, setForm] = useState({ email: "", password: "", nombre_empresa: "", nit: "" });
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // Estado para el usuario

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loggedUser = await invoke("login_usuario", {
        email: form.email,
        password: form.password,
      });
      if (loggedUser) {
        console.log("Usuario logueado:", loggedUser); // <-- Aquí debe aparecer el id.
        onLoginSuccess(loggedUser); // Esto actualiza el estado global en App.jsx
        onClose();
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error al iniciar sesión");
      console.error("Error al iniciar sesión:", err);
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
        <h2 className="text-lg font-bold mb-4">Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu email"
              className="border border-zinc-600 bg-zinc-700 text-white rounded-lg p-2 w-full"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              className="border border-zinc-600 bg-zinc-700 text-white rounded-lg p-2 w-full"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded-lg py-2 px-4 hover:bg-blue-600">Iniciar sesión</button>
          <p className="mt-4 text-sm text-zinc-400">¿No tienes una cuenta? </p>
          <button type="button" onClick={onSignup} className="text-blue-500 hover:underline">Registrarse</button>
        </form>
        {user && <NuevoActivo user={user} />} {/* Renderizar NuevoActivo si hay un usuario */}
      </div>
    </div>
  );
}
export default Login;
