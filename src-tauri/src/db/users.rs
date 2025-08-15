// src-tauri/src/db/users.rs

use rusqlite::{params, Connection, Result};
use serde::Serialize; // Agrega este import

#[derive(Debug, Serialize)] // Agrega Serialize aquí
pub struct User {
    pub id: i32,
    pub email: String,
    pub password: String,
    pub nombre_empresa: String,
    pub nit: String,
}

pub fn create_user(conn: &Connection, email: &str, password: &str, nombre_empresa: &str, nit: &str) -> Result<usize> {
    conn.execute(
        "INSERT INTO users (email, password, nombre_empresa, nit) VALUES (?1, ?2, ?3, ?4)",
        params![email, password, nombre_empresa, nit],
    )
}

pub fn get_user(conn: &Connection, email: &str) -> Result<Option<User>> {
    let mut stmt = conn.prepare("SELECT id, email, password, nombre_empresa, nit FROM users WHERE email = ?1")?;
    let user_iter = stmt.query_map(params![email], |row| {
        Ok(User {
            id: row.get(0)?,
            email: row.get(1)?,
            password: row.get(2)?,
            nombre_empresa: row.get(3)?,
            nit: row.get(4)?,
        })
    })?;

    for user in user_iter {
        return Ok(Some(user?));
    }
    Ok(None)
}

// pub fn update_user(conn: &Connection, id: i32, email: &str, password: &str, nombre_empresa: &str, nit: &str) -> Result<usize> {
//     conn.execute(
//         "UPDATE users SET email = ?1, password = ?2, nombre_empresa = ?3, nit = ?4 WHERE id = ?5",
//         params![email, password, nombre_empresa, nit, id],
//     )
// }

// pub fn delete_user(conn: &Connection, id: i32) -> Result<usize> {
//     conn.execute("DELETE FROM users WHERE id = ?1", params![id])
// }