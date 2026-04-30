# Changelog

All notable changes to this project will be documented in this file.

---

## v0.8.0 — UI Smoothing & Metrics Stability

### Added
- Smooth animations for CPU and RAM usage bars using CSS transitions
- Frontend interpolation for metric updates to create continuous motion

### Improved
- Visual responsiveness of resource usage indicators
- Overall user experience through reduced UI jitter

### Technical
- Implemented interpolation logic:
  - `value = current + (target - current) * factor`
- Maintained event-driven updates from backend to frontend

---

## v0.7.0 — Real-Time Metrics Integration

### Added
- Real-time CPU and RAM monitoring using system process data (`ps aux`)
- Background polling loop in Rust backend
- Event emission (`vm-stats`) from backend to frontend

### Frontend
- Subscribed to backend events using Tauri `listen`
- Dynamic updating of VM resource usage in UI

### Technical
- Extracted CPU and memory usage from `VBoxHeadless` processes
- Implemented event-driven architecture for live updates

---

## v0.6.0 — Memory Calculation Fix

### Fixed
- Incorrect RAM percentage values exceeding 100%

### Added
- Total VM memory lookup using:
  - `VBoxManage showvminfo --machinereadable`

### Technical
- Calculated RAM usage as a percentage:
  - `(used_memory_mb / total_memory_mb) * 100`

---

## v0.5.0 — Event Listener Stability

### Fixed
- Issues with Tauri event listener setup and teardown
- TypeScript errors related to `unlisten` handling

### Improved
- Proper async initialization of event listeners
- Clean resource cleanup on component unmount

---

## v0.4.0 — Metrics System Refactor

### Removed
- Initial VirtualBox metrics approach (`VBoxManage metrics`)
  - Due to dependency on Guest Additions and unreliable output

### Added
- Alternative metrics collection using system process inspection

### Outcome
- Improved reliability and consistency of metric data

---

## v0.3.0 — Initial Metrics Attempt

### Added
- Integration with:
  - `VBoxManage metrics setup`
  - `VBoxManage metrics query`

### Issues
- Required Guest Additions within guest VMs
- Inconsistent or missing data output
- Parsing complexity

### Result
- Approach deprecated in favor of system-level metrics

---

## v0.2.0 — Core UI & VM Controls

### Added
- VM grid interface with selectable cards
- Sidebar and topbar layout
- Search and filtering functionality
- VM detail panel (basic)

### Backend
- `list_vms` command (parsing `VBoxManage list vms --long`)
- `start_vm` command (headless mode)
- `stop_vm` command (poweroff)

---

## v0.1.0 — Initial Project Setup

### Added
- Tauri + React application structure
- Basic project scaffolding
- Initial UI components and layout

---
