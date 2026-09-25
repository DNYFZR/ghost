// Terminal Backend
use std::{env, path::Path, process};

#[tauri::command]
pub fn process_command(args: Vec<&str>) -> String {
    let user_input: &str = args[0];
    let user_input: Vec<&str> = user_input.split(" ").map(|v| v).collect();

    let command: &str = user_input[0];
    if command.to_lowercase() == "cd" {
        return set_cwd(user_input[1].trim());
    } else {
        return run_command(args);
    }
}

#[tauri::command]
pub fn run_command(args: Vec<&str>) -> String {
    // Execute user args in PS CLI
    let res = process::Command::new("powershell").args(args).output();

    // Parse CLI output / error message bytes to string
    match res {
        Ok(output_bytes) => {
            let parsed_bytes = String::from_utf8(output_bytes.stdout.to_vec());

            match parsed_bytes {
                Ok(output) => return output,
                Err(e) => return e.to_string(),
            }
        }
        Err(e) => return e.to_string(),
    }
}

#[test]
fn test_run_command() {
    // Running "" command should always return the opening
    // text of the PowerShell CLI
    let res = run_command(vec![""]);
    let test_val = res.split("\r\n").collect::<Vec<&str>>();

    // Test first line of CLI output
    assert_eq!("Windows PowerShell", test_val[0]);
}

#[tauri::command]
pub fn get_cwd() -> String {
    let dir = env::current_dir();

    match dir {
        Ok(dir) => {
            if let Some(res) = dir.to_str() {
                return String::from(res);
            } else {
                return String::from("Error getting current directory");
            }
        }
        Err(e) => return e.to_string(),
    }
}

#[tauri::command]
pub fn set_cwd(path: &str) -> String {
    // Format path
    let path_formatted = path.replace("%USERPROFILE%", &env::var("USERPROFILE").unwrap());

    // Set CWD
    let dir = env::set_current_dir(Path::new(&path_formatted));

    match dir {
        // Ok(_) => return String::from(format!("Directory updated : {}", path_formatted)),
        Ok(_) => return String::from(""),
        Err(_) => return String::from("The system cannot find the specified directory..."),
    }
}

#[test]
fn test_set_cwd() {
    let current_cwd = get_cwd();
    set_cwd("../");
    assert_ne!(current_cwd, get_cwd());
}
