// AnalisisRiesgo.jsx
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import ActivosCarousel from "../Analisis de Riesgo/ActivosCarousel";
import InfoActivo from "../Analisis de Riesgo/InfoActivo";
import AmenazasIdentificadas from "../Analisis de Riesgo/Amenazas Identificadas";
import MatrizRiesgo from "../Analisis de Riesgo/MatrizRiesgos";

import {
  calcularRiesgoCualitativo,
  calcularRiesgoCuantitativo,
  getRiskColor
} from "../../utils/risks";

export default function AnalisisRiesgo({ user }) {
  const [activos, setActivos] = useState([]);
  const [amenazas, setAmenazas] = useState([]);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [selectedAmenaza, setSelectedAmenaza] = useState(null); // <- Amenaza seleccionada
  const [impacto, setImpacto] = useState(1);
  const [probabilidad, setProbabilidad] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [analisisGuardados, setAnalisisGuardados] = useState([]);

  // Cargar activos
  useEffect(() => {
    if (!user) return;

    invoke("get_activos_by_user", { userId: user.id })
      .then((data) => {
        const mapped = (data || []).map((a) => ({
          ...a,
          id: Number(a.id),
          name: a.name || a.nombre,
          category: a.category || a.categoria,
          criticality: a.criticality || a.criticidad
        }));
        setActivos(mapped);
        if (mapped.length > 0 && !selectedActivo) {
          setSelectedActivo(mapped[0].id);
        }
      })
      .catch((e) => console.error("Error cargando activos:", e));
  }, [user]);

  // Cargar amenazas
  useEffect(() => {
    if (!selectedActivo) {
      setAmenazas([]);
      setSelectedAmenaza(null); // <- Limpiar amenaza seleccionada
      return;
    }

    invoke("obtener_amenazas_por_activo", {
      assetId: Number(selectedActivo)
    })
      .then((res) => {
        const mapped = (res || []).map((t) => ({
          ...t,
          id: Number(t.id),
          name: t.name || t.nombre,
          description: t.description || t.descripcion,
          type_: t.type_ || t.type || t.tipo,
          severity: t.severity || t.severidad,
          frecuencia: t.frecuencia || t.frecuencia,
          assetId: Number(t.asset_id || t.assetId)
        }));
        setAmenazas(mapped);
        setSelectedAmenaza(null); // <- Limpiar amenaza cuando cambie el activo
      })
      .catch((err) => {
        console.error("Error cargando amenazas:", err);
        setAmenazas([]);
        setSelectedAmenaza(null);
      });
  }, [selectedActivo]);

  // Función para manejar la selección de amenaza
  const handleSelectAmenaza = (amenaza) => {
    setSelectedAmenaza(amenaza);
    
    // Si la amenaza tiene valores numéricos de severidad y frecuencia, 
    // actualizar también los valores manuales como respaldo
    if (amenaza.severity && typeof amenaza.severity === 'number') {
      setImpacto(amenaza.severity);
    }
    if (amenaza.frecuencia && typeof amenaza.frecuencia === 'number') {
      setProbabilidad(amenaza.frecuencia);
    }
  };

  // Carrusel
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(activos.length / itemsPerPage));
  const nextPage = () => setCarouselIndex((p) => (p + 1) % totalPages);
  const prevPage = () => setCarouselIndex((p) => (p - 1 + totalPages) % totalPages);

  const activoSeleccionado =
    activos.find((a) => a.id === Number(selectedActivo)) || null;

  const guardarAnalisis = () => {
    if (!activoSeleccionado || !selectedAmenaza) {
      alert("Seleccione un activo y una amenaza.");
      return;
    }

    const riesgoCualitativo = calcularRiesgoCualitativo(
      activoSeleccionado.criticality,
      selectedAmenaza.severity
    );

    // Usar valores de la amenaza si están disponibles, sino los manuales
    const impactoFinal = selectedAmenaza.severity || impacto;
    const probabilidadFinal = selectedAmenaza.frecuencia || probabilidad;
    const cuant = calcularRiesgoCuantitativo(impactoFinal, probabilidadFinal);

    const nuevo = {
      id: crypto.randomUUID(),
      activo_id: activoSeleccionado.id,
      amenaza_id: selectedAmenaza.id,
      impacto: impactoFinal,
      probabilidad: probabilidadFinal,
      riesgo_cuantitativo: cuant.riesgo,
      nivel_cuantitativo: cuant.nivel,
      riesgo_cualitativo: riesgoCualitativo
    };

    setAnalisisGuardados((prev) => [...prev, nuevo]);
    setSelectedAmenaza(null);
    setImpacto(1);
    setProbabilidad(1);
    alert("✅ Análisis guardado");
  };

  // Determinar el modo de la matriz
  const modoMatriz = selectedAmenaza && 
    (selectedAmenaza.severity && selectedAmenaza.frecuencia) ? 
    "automatico" : "manual";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Análisis de Riesgos
        </h1>
        <p className="text-white">
          Evaluación visual e interactiva de riesgos por activo
        </p>
      </div>

      <ActivosCarousel
        activos={activos}
        selectedActivo={selectedActivo}
        setSelectedActivo={setSelectedActivo}
        carouselIndex={carouselIndex}
        setCarouselIndex={setCarouselIndex}
        itemsPerPage={itemsPerPage}
        nextPage={nextPage}
        prevPage={prevPage}
      />

      {selectedActivo && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <InfoActivo activo={activoSeleccionado} amenazas={amenazas} />

            <AmenazasIdentificadas
              amenazas={amenazas}
              activo={activoSeleccionado}
              calcularRiesgoCualitativo={calcularRiesgoCualitativo}
              onSelectAmenaza={handleSelectAmenaza} // <- Función actualizada
              amenazaSeleccionadaId={selectedAmenaza?.id} // <- ID de amenaza seleccionada
            />

            {/* Lista de análisis guardados */}
            {analisisGuardados.filter(a => a.activo_id === Number(selectedActivo)).length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border p-6">
                <h3 className="text-lg font-bold mb-4">📈 Análisis Realizados</h3>
                <div className="space-y-3">
                  {analisisGuardados
                    .filter(a => a.activo_id === Number(selectedActivo))
                    .map((analisis) => {
                      const amenazaInfo = amenazas.find(am => am.id === analisis.amenaza_id) || {};
                      return (
                        <div key={analisis.id} className="bg-gray-50 rounded-lg p-4 border">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">⚠️</span>
                              <span className="font-medium">{amenazaInfo.name}</span>
                            </div>
                          </div>

                          {/* Cualitativo */}
                          <div className="mb-3 p-3 bg-green-50 rounded border">
                            <h5 className="text-sm font-semibold mb-2">🟢 Análisis Cualitativo</h5>
                            <div className="flex items-center justify-center gap-2 text-xs">
                              <span className={`px-2 py-1 rounded ${getRiskColor(activoSeleccionado.criticality).bg} ${getRiskColor(activoSeleccionado.criticality).text}`}>
                                {activoSeleccionado.criticality}
                              </span>
                              <span className="text-gray-600">+</span>
                              <span className={`px-2 py-1 rounded ${getRiskColor(amenazaInfo.severity).bg} ${getRiskColor(amenazaInfo.severity).text}`}>
                                {amenazaInfo.severity}
                              </span>
                              <span className="text-gray-600">=</span>
                              <span className={`px-2 py-1 rounded font-bold ${getRiskColor(analisis.riesgo_cualitativo).bg} ${getRiskColor(analisis.riesgo_cualitativo).text}`}>
                                {analisis.riesgo_cualitativo}
                              </span>
                            </div>
                          </div>

                          {/* Cuantitativo */}
                          <div className="p-3 bg-blue-50 rounded border">
                            <h5 className="text-sm font-semibold mb-2">🔵 Análisis Cuantitativo</h5>
                            <div className="text-xs flex items-center justify-center gap-2">
                              <span>Probabilidad:</span>
                              <strong>{analisis.probabilidad}</strong>
                              <span>×</span>
                              <span>Impacto:</span>
                              <strong>{analisis.impacto}</strong>
                              <span>=</span>
                              <span className={`px-2 py-1 rounded font-bold ${getRiskColor(analisis.nivel_cuantitativo).bg} ${getRiskColor(analisis.nivel_cuantitativo).text}`}>
                                {analisis.riesgo_cuantitativo} ({analisis.nivel_cuantitativo})
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Matriz de Riesgo - Modo automático/manual */}
            <MatrizRiesgo
              impacto={impacto}
              probabilidad={probabilidad}
              setImpacto={setImpacto}
              setProbabilidad={setProbabilidad}
              amenazaSeleccionada={selectedAmenaza} // <- Pasar amenaza seleccionada
              modo={modoMatriz} // <- Pasar modo
            />

            
          </div>
        </div>
      )}
    </div>
  );
}