mod db;
mod commands;

use commands::{
    registrar_usuario,
    login_usuario,
    crear_activo,
    get_activos_by_user,
    editar_activo,
    eliminar_activo,
    crear_amenaza,
    obtener_amenazas_por_activo,
    editar_amenaza,
    eliminar_amenaza,
};

fn main() {
    let db = db::Db::new("../database/caracterizacion.db").expect("Failed to initialize database");

    tauri::Builder::default()
        .manage(db)
        .invoke_handler(tauri::generate_handler![
            registrar_usuario,
            login_usuario,
            crear_activo,
            get_activos_by_user,
            editar_activo,
            eliminar_activo,
            crear_amenaza,
            obtener_amenazas_por_activo,
            editar_amenaza,
            eliminar_amenaza
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
