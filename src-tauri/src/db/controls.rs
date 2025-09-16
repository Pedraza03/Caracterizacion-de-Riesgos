use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Control {
    pub id: i32,
    pub name: String,
    pub description: String,
    pub type_: String, 
    pub threat_type: String, // tipo de amenaza que mitiga (ej. Técnica, Humana, Natural)
}

#[derive(Debug, Serialize)]
pub struct ControlApplied {
    pub id: i32,
    pub control_id: i32,
    pub control_name: String,
    pub threat_id: i32,
    pub asset_id: i32,
    pub status: String, // Estado: Pendiente, Implementado, Verificado
}

// =========================
// Controles base (catálogo)
// =========================
pub fn get_controls_by_threat_type(conn: &Connection, threat_type: &str) -> Result<Vec<Control>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, description, type, threat_type FROM controls WHERE threat_type = ?1",
    )?;

    let rows = stmt.query_map(params![threat_type], |row| {
        Ok(Control {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            type_: row.get(3)?,
            threat_type: row.get(4)?,
        })
    })?;

    let mut results = Vec::new();
    for control in rows {
        results.push(control?);
    }
    Ok(results)
}

// =========================
// Controles aplicados
// =========================

// Aplicar un control a una amenaza
pub fn apply_control(conn: &Connection, control_id: i32, threat_id: i32, asset_id: i32) -> Result<i64> {
    conn.execute(
        "INSERT INTO controls_applied (control_id, threat_id, asset_id, status) 
         VALUES (?1, ?2, ?3, 'Pendiente')",
        params![control_id, threat_id, asset_id],
    )?;
    Ok(conn.last_insert_rowid())
}

// Obtener los controles aplicados a una amenaza
pub fn get_controls_applied_by_threat(conn: &Connection, threat_id: i32) -> Result<Vec<ControlApplied>> {
    let mut stmt = conn.prepare(
        "SELECT ca.id, c.id, c.name, ca.threat_id, ca.asset_id, ca.status
         FROM controls_applied ca
         JOIN controls c ON c.id = ca.control_id
         WHERE ca.threat_id = ?1",
    )?;

    let rows = stmt.query_map(params![threat_id], |row| {
        Ok(ControlApplied {
            id: row.get(0)?,
            control_id: row.get(1)?,
            control_name: row.get(2)?,
            threat_id: row.get(3)?,
            asset_id: row.get(4)?,
            status: row.get(5)?,
        })
    })?;

    let mut results = Vec::new();
    for control in rows {
        results.push(control?);
    }
    Ok(results)
}

// Actualizar el estado de un control aplicado
pub fn update_control_status(conn: &Connection, id: i32, status: &str) -> Result<()> {
    conn.execute(
        "UPDATE controls_applied SET status = ?1 WHERE id = ?2",
        params![status, id],
    )?;
    Ok(())
}

pub fn delete_control_applied(conn: &Connection, id: i32) -> Result<()> {
    conn.execute("DELETE FROM controls_applied WHERE id = ?1", params![id])?;
    Ok(())
}

