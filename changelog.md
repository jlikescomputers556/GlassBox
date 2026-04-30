# Changelog

All notable changes to this project will be documented in this file.

---

## v0.8.0 — Smooth Real-Time Metrics

### Added
- CSS-based animations for CPU and RAM usage bars
- Interpolation logic for smoother transitions between metric updates

### Improved
- Eliminated visual stutter in resource updates
- Achieved continuous, fluid movement similar to system monitoring tools

### Technical
- Implemented interpolation formula:
  - `value = current + (target - current) * factor`
- Retained event-driven architecture for efficient updates

---

## v0.7.0 — Event-Driven Metrics System

### Added
- Real-time CPU and RAM tracking using system process inspection (`ps aux`)
- Background polling loop in Rust backend
- Event emission (`vm-stats`) from backend to frontend

### Frontend
- Integrated Tauri event listener (`listen`) for live updates
- Dynamic UI updates based on incoming metrics

### Technical
- Extracted metrics from `VBoxHeadless` processes
- Introduced backend → frontend streaming via events

---

## v0.6.0 — Accurate Memory Reporting

### Fixed
- Incorrect RAM percentage calculations (values exceeding 100%)

### Added
- Total VM memory retrieval using:
  - `VBoxManage showvminfo --machinereadable`

### Technical
- Implemented correct RAM percentage calculation:
  - `(used_memory_mb / total_memory_mb) * 100`

---

## v0.5.0 — Event Listener Stability Improvements

### Fixed
- Issues with Tauri event listener initialization and cleanup
- TypeScript errors related to asynchronous `unlisten` handling

### Improved
- Reliable setup and teardown of event listeners
- Prevented memory leaks and duplicate listeners

---

## v0.4.0 — Metrics System Refactor

### Removed
- VirtualBox metrics-based approach:
  - `VBoxManage metrics setup`
  - `VBoxManage metrics query`

### Reason
- Dependency on Guest Additions inside VMs
- Inconsistent or unavailable data
- Complex parsing requirements

### Added
- Replacement metrics system using host-level process inspection

### Outcome
- Significantly improved reliability and simplicity

---

## v0.3.0 — Initial Metrics Integration Attempt

### Added
- Integration with VirtualBox metrics commands
- Frontend polling for metrics data

### Issues
- Commands failed without Guest Additions installed in guest VMs
- Frequent errors:
  - `Command get_real_metrics not found`
- Unreliable and inconsistent metric output

### Result
- Approach deprecated and replaced in later versions

---

## v0.2.0 — Core VM Management Features

### Added
- VM listing via:
  - `VBoxManage list vms --long`
- VM lifecycle controls:
  - Start VM (headless)
  - Stop VM (poweroff)

### Frontend
- Grid-based VM interface
- Selectable VM cards
- Basic detail panel
- Search and filter functionality (running / paused / stopped)

### Backend
- Implemented Tauri commands:
  - `list_vms`
  - `start_vm`
  - `stop_vm`

---

## v0.1.0 — Initial Project Setup

### Added
- Tauri + React application scaffold
- Base UI layout structure
- Initial component setup:
  - Sidebar
  - Topbar
  - VM card components

### Notes
- Established foundation for VM management interface
- No backend integration at this stage

---
