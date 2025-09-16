pub mod users;
pub mod activos;
pub mod threats;
pub mod controls;

use rusqlite::{Connection, Result};
use std::sync::Mutex;

pub struct Db {
    connection: Mutex<Connection>,
}

impl Db {
    pub fn new(db_path: &str) -> Result<Self> {
        let connection = Connection::open(db_path)?;
        connection.execute(
            "CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                nombre_empresa TEXT NOT NULL,
                nit TEXT NOT NULL
            )",
            [],
        )?;
        connection.execute(
            "CREATE TABLE IF NOT EXISTS activos (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                type TEXT NOT NULL,
                category TEXT NOT NULL,
                owner TEXT NOT NULL,
                criticality TEXT NOT NULL,
                status TEXT NOT NULL,
                last_update TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )",
            [],
        )?;
        connection.execute(
            "CREATE TABLE IF NOT EXISTS threats (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                type TEXT NOT NULL,
                severity TEXT NOT NULL,
                frecuencia TEXT NOT NULL,
                asset_id INTEGER ,
                FOREIGN KEY(asset_id) REFERENCES activos(id)
            )",
            [],
        )?;
        connection.execute(
            "CREATE TABLE IF NOT EXISTS controls (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                type TEXT NOT NULL,
                threat_type TEXT NOT NULL  -- Relación genérica: Técnica, Humana, Natural, etc.
            )",
            [],
        )?;

        // Relación N:M entre amenazas y controles
        connection.execute(
            "CREATE TABLE IF NOT EXISTS controls_applied (
                id INTEGER PRIMARY KEY,
                control_id INTEGER NOT NULL,
                threat_id INTEGER NOT NULL,
                asset_id INTEGER NOT NULL,
                status TEXT NOT NULL DEFAULT 'Pendiente',
                FOREIGN KEY(control_id) REFERENCES controls(id),
                FOREIGN KEY(threat_id) REFERENCES threats(id),
                FOREIGN KEY(asset_id) REFERENCES activos(id)
            )",
            [],
        )?;


        
        // ======================
        // Cargar catálogo inicial
        // ======================
        let threat_count: i32 = connection.query_row(
            "SELECT COUNT(*) FROM threats",
            [],
            |row| row.get(0),
        )?;

        if threat_count == 0 {
            connection.execute_batch(
                "
                INSERT INTO threats (name, description, type, severity, frecuencia, asset_id)
                VALUES
                ('Malware / Ransomware', 'Software malicioso que cifra o daña información.', 'Técnica', 'Alto', 'Activa', NULL),
                ('Phishing', 'Intento de obtener información sensible mediante engaños.', 'Humana', 'Medio', 'Activa', NULL),
                ('Ataques DDoS', 'Saturación de servicios mediante tráfico malicioso.', 'Técnica', 'Alto', 'Activa', NULL),
                ('Pérdida de datos', 'Eliminación o corrupción de datos críticos.', 'Técnica', 'Alto', 'Activa', NULL),
                ('Intercepción de datos', 'Espionaje o captura de comunicaciones.', 'Técnica', 'Alto', 'Activa', NULL),
                ('Ataques MITM', 'Intercepción y modificación de datos en tránsito.', 'Técnica', 'Crítico', 'Activa', NULL),
                ('Incendios', 'Daños físicos causados por fuego.', 'Natural', 'Crítico', 'Activa',NULL),
                ('Robo o vandalismo', 'Daños físicos por intrusos o robo.', 'Humana', 'Alto', 'Activa',NULL),
                ('Desastres naturales', 'Eventos como inundaciones o terremotos.', 'Natural', 'Crítico', 'Activa', NULL);
                "
            )?;
        }

        let control_count: i32 = connection.query_row(
            "SELECT COUNT(*) FROM controls",
            [],
            |row| row.get(0),
        )?;

        if control_count == 0 {
            connection.execute_batch(
                "
                INSERT INTO controls (name, description, type, threat_type) VALUES
                ('Antivirus y Antimalware', 'Uso de software de protección actualizado.', 'Técnica', 'Técnica'),
                ('Cortafuegos', 'Restricción de accesos no autorizados.', 'Técnica', 'Técnica'),
                ('Formación en Phishing', 'Capacitación al personal contra engaños.', 'Organizativa', 'Humana'),
                ('Backups regulares', 'Copias de seguridad periódicas y verificadas.', 'Recuperación', 'Técnica'),
                ('Redundancia eléctrica', 'Sistemas de respaldo eléctrico (UPS).', 'Física', 'Natural'),
                ('Plan de evacuación', 'Procedimientos ante incendios o desastres.', 'Organizativa', 'Natural'),
                ('Control de acceso físico', 'Protección de salas y equipos.', 'Física', 'Humana');
                "
            )?;
        }


        Ok(Db { connection: Mutex::new(connection) })
    }

    pub fn get_connection(&self) -> std::sync::MutexGuard<'_, Connection> {
        self.connection.lock().unwrap()
    }
}