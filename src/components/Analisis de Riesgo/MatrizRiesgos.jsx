// components/Analisis de Riesgo/MatrizRiesgo.jsx
import React from "react";
import {
  generarMatrizRiesgo,
  getRiskColor,
  calcularRiesgoCuantitativo,
} from "../../utils/risks";

export default function MatrizRiesgo({ 
  impacto, 
  probabilidad, 
  amenazaSeleccionada = null,
  modo = "manual"
}) {
  const matrizRiesgo = generarMatrizRiesgo();

  // Determinar valores finales según el modo
  let severidadFinal = impacto;
  let frecuenciaFinal = probabilidad;
  
  if (modo === "automatico" && amenazaSeleccionada) {
    // Convertir valores textuales a numéricos
    const severidadTexto = amenazaSeleccionada.severity;
    const frecuenciaTexto = amenazaSeleccionada.frecuencia;
    
    // Mapear valores textuales a números
    const mapearValor = (valor) => {
      if (typeof valor === 'number') return valor;
      const val = valor?.toString().toLowerCase();
      if (val === 'bajo' || val === 'baja') return 1;
      if (val === 'medio' || val === 'media') return 2;
      if (val === 'alto' || val === 'alta') return 3;
      if (val === 'crítico' || val === 'critico' || val === 'critica') return 4;
      return 1; // valor por defecto
    };
    
    severidadFinal = mapearValor(severidadTexto);
    frecuenciaFinal = mapearValor(frecuenciaTexto);
  }

  // Calcular riesgo
  const { riesgo, nivel } = calcularRiesgoCuantitativo(severidadFinal, frecuenciaFinal);
  const nivelColor = getRiskColor(nivel);

  return (
    <div className="bg-[#1F2937] rounded-xl shadow-lg border border-zinc-700 p-6">
      <h3 className="text-white text-lg font-bold mb-4">
        🎯 Matriz de valoracion de Riesgo (4x4)
      </h3>

      <div className="mb-4">
        {/* Grid de la matriz */}
        <div className="grid grid-cols-5 gap-1 max-w-sm md:max-w-md mx-auto">
          {/* Celda vacía esquina */}
          <div className="p-2"></div>

          {/* Encabezado superior: Impacto 1..4 */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={`hdr-${i}`}
              className="text-center text-xs font-medium text-zinc-300 p-2"
            >
              {i}
            </div>
          ))}

          {/* Filas: Probabilidad 4..1 */}
          {matrizRiesgo.map((fila, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {/* Etiqueta lateral Probabilidad */}
              <div className="text-center text-xs font-medium text-zinc-300 p-2">
                {fila[0].probabilidad}
              </div>

              {fila.map((celda, colIndex) => {
                const isSelected =
                  celda.impacto === severidadFinal &&
                  celda.probabilidad === frecuenciaFinal;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={[
                      "h-12 w-12 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-150",
                      celda.color.text,
                      celda.color.bg,
                      isSelected
                        ? "ring-4 ring-blue-500 ring-opacity-75 scale-105"
                        : "",
                    ].join(" ")}
                    title={`Impacto: ${celda.impacto}, Probabilidad: ${celda.probabilidad}, Riesgo: ${celda.riesgo} (${celda.nivel})`}
                  >
                    {celda.riesgo}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Etiquetas de ejes */}
        <div className="flex justify-between text-xs text-zinc-300 mt-2 max-w-sm md:max-w-md mx-auto">
          <span>Severidad →</span>
          <span>↑ Frecuencia</span>
        </div>

        {/* Cuadro de operación debajo de la matriz */}
        <div className="mt-6 text-center">
          <div className="inline-block bg-[#111827] rounded-lg p-4 border border-zinc-700">
            <p className="text-md text-white font-medium">
              Frecuencia {frecuenciaFinal} × Severidad {severidadFinal} = {riesgo}
            </p>
            <span
              className={[
                "inline-block px-4 py-2 rounded-full text-sm font-bold mt-2",
                nivelColor.bg,
                nivelColor.text,
              ].join(" ")}
            >
              {nivel}
            </span>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs mt-6">
        {["Bajo", "Medio", "Alto", "Crítico"].map((niv) => {
          const color = getRiskColor(niv);
          return (
            <div key={niv} className="flex flex-col items-center">
              <div className={`w-4 h-4 rounded ${color.bg} mb-1`}></div>
              <span className="text-zinc-300">{niv}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}