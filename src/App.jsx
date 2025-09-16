import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import Sidebar from './components/Sidebar.jsx';
import Home from './components/dashboard/Home.jsx';
import Activos from './components/Activos/Activos.jsx';
import Amenazas from './components/Amenazas/Amenazas.jsx';
import AnalisisRiesgo from './components/Analisis de Riesgo/AnalisisRiesgo.jsx';
import ControlRiesgo from './components/Control/ControlRiesgo.jsx';

function App() {
  const [activeArea, setActiveArea] = useState('Home');
  const [activos, setActivos] = useState([]);
  const [user, setUser] = useState(null);

  console.log("Usuario global en App:", user);

  const reloadActivos = () => {
  if (user) {
    console.log("Recargando activos para el usuario:", user.id);
    invoke("get_activos_by_user", { userId: user.id })
      .then((data) => setActivos(data))
      .catch((error) => console.error("Error al recargar activos:", error));
  }
  };

  // Cargar activos cuando cambia el usuario
  useEffect(() => {
    if (user) {
      console.log("Cargando activos para el usuario:", user.id);
      invoke("get_activos_by_user", { userId: user.id })
        .then((data) => {
          setActivos(data);
        })
        .catch((error) => {
          console.error("Error al cargar activos:", error);
        });
    } else {
      setActivos([]);
    }
  }, [user]);

  return (
    <div className="flex h-screen bg-[#111827]">
      <Sidebar
        activeArea={activeArea}
        setActiveArea={setActiveArea}
        user={user}          // <-- pasa el usuario global
        setUser={setUser}    // <-- pasa setUser global
      />
      <main className="flex-1 p-6 overflow-y-auto">
        {activeArea === 'Activos' && <Activos user={user} reloadActivos={reloadActivos} />}
        {activeArea === 'Amenazas' && <Amenazas user={user} activos={activos} reloadActivos={reloadActivos} />}
        {activeArea === 'Analisis Riesgo' && <AnalisisRiesgo user={user} activos={activos} />}
        {activeArea === 'Controles' && <ControlRiesgo user={user} activos={activos} />}
        {activeArea === 'Home' && <Home user={user} />}


      </main>
    </div>
  );
}

export default App;
