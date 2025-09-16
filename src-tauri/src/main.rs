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
    aplicar_control,
    obtener_controles_por_tipo,
    obtener_controles_aplicados,
    actualizar_estado_control,
    eliminar_control_aplicado,
    obtener_resumen_dashboard,

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
            eliminar_amenaza,
            aplicar_control,
            obtener_controles_por_tipo,
            obtener_controles_aplicados,
            actualizar_estado_control,
            eliminar_control_aplicado,
            obtener_resumen_dashboard,

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
