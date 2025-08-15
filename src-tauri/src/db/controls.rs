// src-tauri/src/db/controls.rs
use rusqlite::{params, Connection, Result};

#[derive(Debug)]
pub struct Control {
    pub id: i32,
    pub threat_id: i32,
    pub description: String,
    pub mitigation: String,
}

pub fn create_control(conn: &Connection, threat_id: i32, description: &str, mitigation: &str) -> Result<()> {
    conn.execute(
        "INSERT INTO controls (threat_id, description, mitigation) VALUES (?1, ?2, ?3)",
        params![threat_id, description, mitigation],
    )?;
    Ok(())
}

pub fn get_controls(conn: &Connection) -> Result<Vec<Control>> {
    let mut stmt = conn.prepare("SELECT id, threat_id, description, mitigation FROM controls")?;
    let control_iter = stmt.query_map([], |row| {
        Ok(Control {
            id: row.get(0)?,
            threat_id: row.get(1)?,
            description: row.get(2)?,
            mitigation: row.get(3)?,
        })
    })?;

    let mut controls = Vec::new();
    for control in control_iter {
        controls.push(control?);
    }
    Ok(controls)
}

pub fn update_control(conn: &Connection, id: i32, description: &str, mitigation: &str) -> Result<()> {
    conn.execute(
        "UPDATE controls SET description = ?1, mitigation = ?2 WHERE id = ?3",
        params![description, mitigation, id],
    )?;
    Ok(())
}

pub fn delete_control(conn: &Connection, id: i32) -> Result<()> {
    conn.execute("DELETE FROM controls WHERE id = ?1", params![id])?;
    Ok(())
}