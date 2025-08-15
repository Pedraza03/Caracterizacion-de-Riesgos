import React from "react";

function PerfilUsuario({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-lg shadow-lg p-8 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Perfil de Usuario</h2>
        <div className="mb-4">
          <strong>Email:</strong>
          <div>{user.email}</div>
        </div>
        <div className="mb-4">
          <strong>Empresa:</strong>
          <div>{user.nombre_empresa}</div>
        </div>
        <div className="mb-4">
          <strong>NIT:</strong>
          <div>{user.nit}</div>
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;