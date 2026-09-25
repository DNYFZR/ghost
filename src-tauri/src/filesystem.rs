// Filesystem Operations
use std::fs;
use std::io::{BufRead, Write};

#[tauri::command]
pub fn scan_fs(path: &str) -> Vec<String> {
    // return a vector containing the contents of a directory or file
    match check_is_dir(path) {
        true => return list_dir(path),
        false => return read_file(path),
    }
}

#[tauri::command]
pub fn check_is_dir(path: &str) -> bool {
    // Check if a path is a directory
    match fs::metadata(path) {
        Ok(path_meta) => return path_meta.is_dir(),
        Err(_) => false,
    }
}

#[tauri::command]
pub fn save_file_as(path: &str, data: &str) -> String {
    // Save data to file on path, if path is available & not currently occupied
    let check_exists = fs::exists(path);

    match check_exists {
        // File exists
        Ok(true) => {
            return String::from(format!(
                "Cannot save as, file already exists on path : {}",
                path
            ));
        }

        // File doesn't exist & path accessible
        Ok(false) => {
            return save_file(path, data);
        }

        // Path inaccessible
        Err(e) => return String::from(format!("Could not verify status of path : {}", e)),
    }
}

#[tauri::command]
pub fn save_file(path: &str, data: &str) -> String {
    // Create new file
    match fs::File::create(path) {
        // Try to write bytes data
        Ok(mut new_file) => {
            match new_file.write_all(data.as_bytes()) {
                Ok(_) => {
                    return String::from(format!(
                        "File saved to path : {}",
                        path.replace("/", "\\")
                    ));
                }
                // Handle errors
                Err(e) => return String::from(format!("Error saving to path : {}", e)),
            }
        }
        Err(e) => return String::from(format!("Error creating file : {}", e)),
    }
}

#[tauri::command]
pub fn delete_file(path: &str) -> String {
    match fs::remove_file(path) {
        Ok(_) => return String::from("File removed"),
        Err(e) => return e.to_string(),
    }
}

fn list_dir(path: &str) -> Vec<String> {
    // list files & sub-directories for path
    let entries = fs::read_dir(path);

    match entries {
        Ok(res) => {
            return res
                .filter_map(|entry| {
                    let path = entry.ok()?.path();
                    if path.is_file() || path.is_dir() {
                        path.file_name()?.to_str().map(|s| s.to_owned())
                    } else {
                        None
                    }
                })
                .collect();
        }
        Err(e) => {
            return vec![String::from("error"), e.to_string()];
        }
    }
}

fn read_file(path: &str) -> Vec<String> {
    let file = fs::read(path);

    match file {
        Ok(res) => {
            // Check file can be read to string
            if std::str::from_utf8(&res).is_err() {
                return vec![String::from("Unsupported file type")];
            }

            // Return text lines from file
            return res
                .lines()
                .map(|x| x.expect("Unsupported file type"))
                .collect::<Vec<String>>();
        }
        Err(e) => return vec![String::from(format!("File not found : {}", e))],
    }
}
