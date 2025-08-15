use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct Activo {
    pub id: i32,
    pub name: String,
    pub type_: String, // Representa el campo "type" en la BD
    pub category: String,
    pub owner: String,
    pub criticality: String,
    pub status: String,
    pub last_update: String,
    pub user_id: i32,
}

pub fn create_activo(
    conn: &Connection,
    name: &str,
    type_: &str,
    category: &str,
    owner: &str,
    criticality: &str,
    status: &str,
    last_update: &str,
    user_id: i32,
) -> Result<i64> {
    conn.execute(
        "INSERT INTO activos (name, type, category, owner, criticality, status, last_update, user_id)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        params![name, type_, category, owner, criticality, status, last_update, user_id],
    )?;
    Ok(conn.last_insert_rowid())
}

pub fn get_activos_by_user(conn: &Connection, user_id: i32) -> Result<Vec<Activo>> {
    let mut stmt = conn.prepare(
        "SELECT id, name, type, category, owner, criticality, status, last_update, user_id
        FROM activos WHERE user_id = ?1",
    )?;
    let activo_iter = stmt.query_map(params![user_id], |row| {
        Ok(Activo {
            id: row.get(0)?,
            name: row.get(1)?,
            type_: row.get(2)?,
            category: row.get(3)?,
            owner: row.get(4)?,
            criticality: row.get(5)?,
            status: row.get(6)?,
            last_update: row.get(7)?,
            user_id: row.get(8)?,
        })
    })?;

    let mut activos = Vec::new();
    for activo in activo_iter {
        activos.push(activo?);
    }
    Ok(activos)
}
