use tauri::State;
use rusqlite::params;
use crate::db::{Db, users, activos, threats, controls};
use serde::Serialize;

// -------------------------------
// Comandos de Usuarios
// -------------------------------
#[tauri::command]
pub fn registrar_usuario(
    state: State<Db>,
    email: String,
    password: String,
    nombre_empresa: String,
    nit: String,
) -> Result<(), String> {
    let conn = state.get_connection();
    users::create_user(&*conn, &email, &password, &nombre_empresa, &nit)
        .map(|_| ())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn login_usuario(
    state: State<Db>,
    email: String,
    password: String,
) -> Result<Option<users::User>, String> {
    let conn = state.get_connection();
    match users::get_user(&*conn, &email) {
        Ok(Some(user)) => {
            if user.password == password {
                Ok(Some(user))
            } else {
                Ok(None)
            }
        }
        Ok(None) => Ok(None),
        Err(e) => Err(e.to_string()),
    }
}

// -------------------------------
// Comandos de Activos
// -------------------------------
#[tauri::command]
pub fn crear_activo(
    state: State<Db>,
    name: String,
    type_: String,
    category: String,
    owner: String,
    criticality: String,
    status: String,
    last_update: String,
    user_id: i32,
) -> Result<i64, String> {
    let conn = state.get_connection();
    activos::create_activo(
        &*conn,
        &name,
        &type_,
        &category,
        &owner,
        &criticality,
        &status,
        &last_update,
        user_id,
    )
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_activos_by_user(
    state: State<Db>,
    user_id: i32,
) -> Result<Vec<activos::Activo>, String> {
    let conn = state.get_connection();
    activos::get_activos_by_user(&*conn, user_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn editar_activo(
    state: State<Db>,
    id: i32,
    name: String,
    type_: String,
    category: String,
    owner: String,
    criticality: String,
    status: String,
    last_update: String,
) -> Result<(), String> {
    let conn = state.get_connection();
    conn.execute(
        "UPDATE activos 
        SET name = ?1, type = ?2, category = ?3, owner = ?4, criticality = ?5, status = ?6, last_update = ?7 
        WHERE id = ?8",
        params![name, type_, category, owner, criticality, status, last_update, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn eliminar_activo(state: State<Db>, id: i32) -> Result<(), String> {
    let conn = state.get_connection();
    conn.execute("DELETE FROM activos WHERE id = ?1", params![id])
        .map_err(|e| e.to_string())?;
    Ok(())
}

// -------------------------------
// Comandos de Amenazas
// -------------------------------
#[tauri::command]
pub fn crear_amenaza(
    state: State<Db>,
    name: String,
    description: Option<String>,
    type_: String,
    severity: String,
    frecuencia: String,
    asset_id: i32,
) -> Result<threats::Threat, String> {
    let conn = state.get_connection();
    let id = threats::add_threat(&*conn, &name, description.as_deref(), &type_, &severity, &frecuencia, asset_id)
        .map_err(|e| e.to_string())?;

    Ok(threats::Threat {
        id: id as i32,
        name,
        description,
        type_: type_,
        severity,
        frecuencia,
        asset_id,
    })
}

#[tauri::command]
pub fn obtener_amenazas_por_activo(
    state: State<Db>,
    asset_id: i32,
) -> Result<Vec<threats::Threat>, String> {
    let conn = state.get_connection();
    threats::get_threats_by_asset(&*conn, asset_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn editar_amenaza(
    state: State<Db>,
    id: i32,
    name: String,
    description: Option<String>,
    type_: String,
    severity: String,
    frecuencia: String,
    asset_id: i32,
) -> Result<(), String> {
    let conn = state.get_connection();
    conn.execute(
        "UPDATE threats 
        SET name = ?1, description = ?2, type = ?3, severity = ?4, frecuencia = ?5, asset_id = ?6 
        WHERE id = ?7",
        params![name, description, type_, severity, frecuencia, asset_id, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn eliminar_amenaza(state: State<Db>, id: i32) -> Result<(), String> {
    let conn = state.get_connection();
    threats::delete_threat(&*conn, id)
        .map_err(|e| e.to_string())
}

// -------------------------------
// Comandos de Controles
// -------------------------------
#[tauri::command]
pub fn obtener_controles_por_tipo(
    state: State<Db>,
    threat_type: String,
) -> Result<Vec<controls::Control>, String> {
    let conn = state.get_connection();
    controls::get_controls_by_threat_type(&*conn, &threat_type).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn aplicar_control(
    state: State<Db>,
    control_id: i32,
    threat_id: i32,
    asset_id: i32,
) -> Result<i64, String> {
    let conn = state.get_connection();
    controls::apply_control(&*conn, control_id, threat_id, asset_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn obtener_controles_aplicados(
    state: State<Db>,
    threat_id: i32,
) -> Result<Vec<controls::ControlApplied>, String> {
    let conn = state.get_connection();
    controls::get_controls_applied_by_threat(&*conn, threat_id).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn actualizar_estado_control(
    state: State<Db>,
    id: i32,
    status: String,
) -> Result<(), String> {
    let conn = state.get_connection();
    controls::update_control_status(&*conn, id, &status).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn eliminar_control_aplicado(state: State<Db>, id: i32) -> Result<(), String> {
    let conn = state.get_connection();
    controls::delete_control_applied(&*conn, id).map_err(|e| e.to_string())
}


// Comandos de Dashboard

#[derive(Serialize)]
pub struct DashboardSummary {
    pub total_activos: i32,
    pub total_amenazas: i32,
    pub total_riesgos: i32,
    pub total_controles: i32,
    pub controles_pendientes: i32, // <-- nuevo campo
    pub riesgos_critico: i32,
    pub riesgos_alto: i32,
    pub riesgos_medio: i32,
    pub riesgos_bajo: i32,
    pub activos_sin_controles: i32, // <-- nuevo campo
    pub cumplimiento_general: i32,
    pub tiempo_promedio_respuesta: f64,
}


#[tauri::command]
pub fn obtener_resumen_dashboard(state: State<Db>, user_id: i32) -> Result<DashboardSummary, String> {
    let conn = state.get_connection();

    // ✅ Total de activos
    let total_activos: i32 = conn.query_row(
        "SELECT COUNT(*) FROM activos WHERE user_id = ?1",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // ✅ Todas las amenazas
    let total_amenazas: i32 = conn.query_row(
        "SELECT COUNT(*) 
         FROM threats t 
         INNER JOIN activos a ON t.asset_id = a.id 
         WHERE a.user_id = ?1",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // ✅ Riesgos críticos
    let total_riesgos: i32 = conn.query_row(
        "SELECT COUNT(*) 
         FROM threats t
         INNER JOIN activos a ON t.asset_id = a.id
         WHERE a.user_id = ?1 AND (LOWER(t.severity) = 'crítico' OR LOWER(t.severity) = 'critico')",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // Total de controles aplicados
    let total_controles: i32 = conn.query_row(
        "SELECT COUNT(*) FROM controls_applied ca
         INNER JOIN activos a ON ca.asset_id = a.id
         WHERE a.user_id = ?1",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // Controles implementados o verificados
    let controles_cumplidos: i32 = conn.query_row(
        "SELECT COUNT(*) FROM controls_applied ca
         INNER JOIN activos a ON ca.asset_id = a.id
         WHERE a.user_id = ?1 AND (LOWER(ca.status) = 'implementado' OR LOWER(ca.status) = 'verificado')",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    let cumplimiento_general = if total_controles > 0 {
        (controles_cumplidos as f64 / total_controles as f64 * 100.0).round() as i32
    } else {
        0
    };

    // Solo controles pendientes
    let controles_pendientes: i32 = conn.query_row(
        "SELECT COUNT(*) FROM controls_applied ca
         INNER JOIN activos a ON ca.asset_id = a.id
         WHERE a.user_id = ?1 AND LOWER(ca.status) = 'pendiente'",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // ✅ Distribución de riesgos
    let riesgos_critico: i32 = conn.query_row(
        "SELECT COUNT(*) 
         FROM threats t 
         INNER JOIN activos a ON t.asset_id = a.id 
         WHERE a.user_id = ?1 AND (LOWER(t.severity) = 'crítico' OR LOWER(t.severity) = 'critico')",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    let riesgos_alto: i32 = conn.query_row(
        "SELECT COUNT(*) 
         FROM threats t 
         INNER JOIN activos a ON t.asset_id = a.id 
         WHERE a.user_id = ?1 AND t.severity = 'Alto'",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    let riesgos_medio: i32 = conn.query_row(
        "SELECT COUNT(*) 
         FROM threats t 
         INNER JOIN activos a ON t.asset_id = a.id 
         WHERE a.user_id = ?1 AND t.severity = 'Medio'",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    let riesgos_bajo: i32 = conn.query_row(
        "SELECT COUNT(*) 
         FROM threats t 
         INNER JOIN activos a ON t.asset_id = a.id 
         WHERE a.user_id = ?1 AND t.severity = 'Bajo'",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // Activos sin controles
    let activos_sin_controles: i32 = conn.query_row(
        "SELECT COUNT(*) FROM activos a
         LEFT JOIN controls_applied ca ON a.id = ca.asset_id
         WHERE a.user_id = ?1 AND ca.id IS NULL",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // Tiempo promedio de respuesta
    let tiempo_promedio_respuesta: f64 = conn.query_row(
        "SELECT AVG(
            JULIANDAY(ca.applied_at) - JULIANDAY(t.created_at)
         ) * 24 FROM controls_applied ca
         INNER JOIN threats t ON ca.threat_id = t.id
         INNER JOIN activos a ON t.asset_id = a.id
         WHERE a.user_id = ?1",
        [user_id],
        |row| row.get(0),
    ).unwrap_or(0.0);

    Ok(DashboardSummary {
        total_activos,
        total_amenazas,
        total_riesgos,
        total_controles,
        controles_pendientes, // <-- nuevo campo
        riesgos_critico,
        riesgos_alto,
        riesgos_medio,
        riesgos_bajo,
        activos_sin_controles, // <-- nuevo campo
        cumplimiento_general,
        tiempo_promedio_respuesta,
    })
}
