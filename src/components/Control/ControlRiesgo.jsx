// ControlRiesgo.jsx
import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";

import ActivosCarousel from "../Control/ActivosCarousel";
import InfoActivo from "../Control/InfoActivo";
import AmenazasIdentificadas from "../Control/Amenazas Identificadas";
import ControlesAplicados from "../Control/ControlesAplicados";

export default function ControlRiesgo({ user }) {
  const [activos, setActivos] = useState([]);
  const [amenazas, setAmenazas] = useState([]);
  const [selectedActivo, setSelectedActivo] = useState(null);
  const [selectedAmenaza, setSelectedAmenaza] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  // 📌 Cargar activos
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

  // 📌 Cargar amenazas asociadas al activo
  useEffect(() => {
    if (!selectedActivo) {
      setAmenazas([]);
      setSelectedAmenaza(null);
      return;
    }

    invoke("obtener_amenazas_por_activo", { assetId: Number(selectedActivo) })
      .then((res) => {
        const mapped = (res || []).map((t) => ({
          ...t,
          id: Number(t.id),
          name: t.name || t.nombre,
          description: t.description || t.descripcion,
          type_: t.type_ || t.tipo,
          severity: t.severity || t.severidad,
          frecuencia: t.frecuencia || t.frecuencia,
          assetId: Number(t.asset_id || t.assetId)
        }));
        setAmenazas(mapped);
        setSelectedAmenaza(null);
      })
      .catch((err) => {
        console.error("Error cargando amenazas:", err);
        setAmenazas([]);
        setSelectedAmenaza(null);
      });
  }, [selectedActivo]);

  // 📌 Selección de amenaza
  const handleSelectAmenaza = (amenaza) => {
    setSelectedAmenaza(amenaza);
  };

  // 📌 Carrusel
  const itemsPerPage = 4;
  const totalPages = Math.max(1, Math.ceil(activos.length / itemsPerPage));
  const nextPage = () => setCarouselIndex((p) => (p + 1) % totalPages);
  const prevPage = () => setCarouselIndex((p) => (p - 1 + totalPages) % totalPages);

  const activoSeleccionado =
    activos.find((a) => a.id === Number(selectedActivo)) || null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Control de Riesgos
        </h1>
        <p className="text-white">
          Gestión de activos y amenazas identificadas
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
              onSelectAmenaza={handleSelectAmenaza}
              amenazaSeleccionadaId={selectedAmenaza?.id}
            />
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {selectedAmenaza && (
              <ControlesAplicados
                amenaza={selectedAmenaza}
                activo={activoSeleccionado}
              />
            )}
          </div>
        </div>
      )}

    </div>
  );
}
