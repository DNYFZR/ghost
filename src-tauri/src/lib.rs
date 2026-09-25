// Tauri App Configuration

// Modules
mod filesystem;
mod terminal;

// Components
use filesystem::{check_is_dir, delete_file, save_file, save_file_as, scan_fs};
use terminal::{get_cwd, process_command, run_command, set_cwd};

// Configuration
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            get_cwd,
            set_cwd,
            check_is_dir,
            scan_fs,
            save_file,
            save_file_as,
            delete_file,
            run_command,
            process_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
