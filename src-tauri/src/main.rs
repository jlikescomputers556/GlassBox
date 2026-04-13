#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, Emitter};
use std::thread;
use std::time::Duration;

#[tauri::command]
fn list_vms() -> Vec<String> {
    let output = std::process::Command::new("VBoxManage")
        .args(["list", "vms", "--long"])
        .output()
        .expect("failed to run VBoxManage");
    let stdout = String::from_utf8_lossy(&output.stdout);
    
    let mut results = Vec::new();
    let mut current_name = String::new();
    let mut current_state = String::new();

    for line in stdout.lines() {
        if line.starts_with("Name:") {
            current_name = line.replace("Name:", "").trim().to_string();
        }
        if line.starts_with("State:") {
            current_state = line.replace("State:", "").trim().to_string();
            if !current_name.is_empty() {
                results.push(format!("{}|{}", current_name, current_state));
                current_name = String::new();
                current_state = String::new();
            }
        }
    }
    results
}

#[tauri::command]
fn start_vm(name: String) -> String {
    let output = std::process::Command::new("VBoxManage")
        .args(["startvm", &name, "--type", "headless"])
        .output()
        .expect("failed to start VM");
    String::from_utf8_lossy(&output.stdout).to_string()
}

#[tauri::command]
fn stop_vm(name: String) -> String {
    let output = std::process::Command::new("VBoxManage")
        .args(["controlvm", &name, "poweroff"])
        .output()
        .expect("failed to stop VM");
    String::from_utf8_lossy(&output.stdout).to_string()
}

fn get_vm_stats(name: &str) -> (f64, f64) {
    let output = std::process::Command::new("sh")
        .args(["-c", &format!(
            "ps aux | grep 'VBoxHeadless --comment {}' | grep -v grep",
            name
        )])
        .output();

    match output {
        Ok(out) => {
            let stdout = String::from_utf8_lossy(&out.stdout);
            fn get_vm_stats(name: &str) -> (f64, f64) {
    // Find the VBoxHeadless process for this VM and read its CPU/RAM
    let output = std::process::Command::new("sh")
        .args(["-c", &format!(
            "ps aux | grep -i 'VBoxHeadless.*{}' | grep -v grep",
            name
        )])
        .output();

    match output {
        Ok(out) => {
            let stdout = String::from_utf8_lossy(&out.stdout);
            let line = stdout.lines().next().unwrap_or("");
            let parts: Vec<&str> = line.split_whitespace().collect();
            
            // ps aux format: USER PID %CPU %MEM VSZ RSS ...
            let cpu = parts.get(2).and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let mem_kb: f64 = parts.get(5).and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let mem_mb = mem_kb / 1024.0;
            
            (cpu, mem_mb)
        }
        Err(_) => (0.0, 0.0),
    }
}let line = stdout.lines().next().unwrap_or("");
            let parts: Vec<&str> = line.split_whitespace().collect();
            let cpu = parts.get(2).and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let mem_kb: f64 = parts.get(5).and_then(|v| v.parse().ok()).unwrap_or(0.0);
            let mem_mb = mem_kb / 1024.0;
            (cpu, mem_mb)
        }
        Err(_) => (0.0, 0.0),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let app_handle = app.handle().clone();
            thread::spawn(move || {
                loop {
                    let output = std::process::Command::new("VBoxManage")
                        .args(["list", "runningvms"])
                        .output();

                    if let Ok(out) = output {
                        let stdout = String::from_utf8_lossy(&out.stdout);
                        for line in stdout.lines() {
                            if let Some(name_match) = line.split('"').nth(1) {
                                let name = name_match.to_string();
                                let (cpu, ram_bytes) = get_vm_stats(&name);
                                let ram_mb = ram_bytes / 1024.0 / 1024.0;

                                let _ = app_handle.emit("vm-stats", serde_json::json!({
                                    "name": name,
                                    "cpu": cpu,
                                    "ram": ram_mb,
                                }));
                            }
                        }
                    }
                    thread::sleep(Duration::from_secs(2));
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![list_vms, start_vm, stop_vm])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}