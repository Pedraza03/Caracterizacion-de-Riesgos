use tauri::State;
use rusqlite::params;
use crate::db::{Db, users, activos, threats};

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
