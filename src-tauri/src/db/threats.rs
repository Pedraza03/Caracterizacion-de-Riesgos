use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Threat {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
    pub type_: String,
    pub severity: String,
    pub frecuencia: String,
    pub asset_id: i32,
}

// Crear amenaza
pub fn add_threat(
    conn: &Connection,
    name: &str,
    description: Option<&str>,
    type_: &str,
    severity: &str,
    frecuencia: &str,
    asset_id: i32,
) -> Result<i64> {
    conn.execute(
        "INSERT INTO threats (name, description, type, severity, frecuencia, asset_id)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![name, description, type_, severity, frecuencia, asset_id],
    )?;
    Ok(conn.last_insert_rowid())
}

// Obtener todas las amenazas por activo
pub fn get_threats_by_asset(conn: &Connection, asset_id: i32) -> Result<Vec<Threat>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, description, type, severity, frecuencia, asset_id
        FROM threats WHERE asset_id = ?1",
    )?;
    let threat_iter = stmt.query_map(params![asset_id], |row| {
        Ok(Threat {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            type_: row.get(3)?,
            severity: row.get(4)?,
            frecuencia: row.get(5)?,
            asset_id: row.get(6)?,
        })
    })?;

    let mut threats = Vec::new();
    for threat in threat_iter {
        threats.push(threat?);
    }
    Ok(threats)
}

// Eliminar amenaza
pub fn delete_threat(conn: &Connection, id: i32) -> Result<()> {
    conn.execute("DELETE FROM threats WHERE id = ?1", params![id])?;
    Ok(())
}
