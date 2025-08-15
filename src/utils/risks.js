// utils/risks.js

// Diccionario de niveles de riesgo
export const NIVELES_RIESGO = {
  "Crítico": 4,
  "Critico": 4, // por si llega sin tilde
  "Alto": 3,
  "Medio": 2,
  "Bajo": 1
};

// Colores para cada nivel
export const getRiskColor = (level = "") => {
  switch (level) {
    case "Crítico":
    case "Critico":
      return { bg: "bg-red-600", text: "text-white", border: "border-red-600" };
    case "Alto":
      return { bg: "bg-orange-500", text: "text-white", border: "border-orange-500" };
    case "Medio":
      return { bg: "bg-amber-500", text: "text-zinc-900", border: "border-amber-500" };
    case "Bajo":
      return { bg: "bg-green-500", text: "text-white", border: "border-green-500" };
    default:
      return { bg: "bg-zinc-500", text: "text-white", border: "border-zinc-500" };
  }
};

// Riesgo cualitativo
export const calcularRiesgoCualitativo = (
  criticidadActivo = "Bajo",
  severidadAmenaza = "Bajo"
) => {
  const criticidad = NIVELES_RIESGO[criticidadActivo] ?? 1;
  const severidad = NIVELES_RIESGO[severidadAmenaza] ?? 1;
  const riesgoTotal = (severidad * criticidad);

  if (riesgoTotal <= 3) return "Bajo";
  if (riesgoTotal <= 6) return "Medio"; // incluye el 4
  if (riesgoTotal <= 9) return "Alto";
  return "Crítico";
};

// Riesgo cuantitativo
export const calcularRiesgoCuantitativo = (impacto, probabilidad) => {
  const riesgo = impacto * probabilidad;
  let nivel = "";

  if (riesgo <= 3) nivel = "Bajo";
  else if (riesgo <= 6) nivel = "Medio"; // aquí ya 4 entra como "Medio"
  else if (riesgo <= 9) nivel = "Alto";
  else nivel = "Crítico";

  return { riesgo, nivel };
};

// Matriz 4x4 con colores
export const generarMatrizRiesgo = () => {
  const matriz = [];
  for (let prob = 4; prob >= 1; prob--) {
    const fila = [];
    for (let imp = 1; imp <= 4; imp++) {
      const { riesgo, nivel } = calcularRiesgoCuantitativo(imp, prob);
      const color = getRiskColor(nivel);
      fila.push({ impacto: imp, probabilidad: prob, riesgo, nivel, color });
    }
    matriz.push(fila);
  }
  return matriz;
};
