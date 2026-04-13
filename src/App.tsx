import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

import VMCard from "./components/vm/VMCard";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

interface VM {
  name: string;
  status: "running" | "stopped" | "paused";
  cpu: number;
  ram: number;
  disk: number;
  net: number;
}

const Icon = {
  grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>,
  clock: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
  network: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><line x1="12" y1="7" x2="5" y2="17"/><line x1="12" y1="7" x2="19" y2="17"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  play: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  stop: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="1"/></svg>,
  snapshot: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
  clone: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  trash: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>,
  plus: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  logo: <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>,
};

const S = {
  app: { background: "#0d0f14", minHeight: "100vh", color: "#e8eaf0", fontFamily: "'Segoe UI', system-ui, sans-serif", display: "flex" } as React.CSSProperties,
  main: { flex: 1, padding: "18px 20px", overflow: "auto" as const },
  topbar: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" },
  h1: { fontSize: "15px", fontWeight: 600, flex: 1, letterSpacing: "-0.2px" },
  searchWrap: { position: "relative" as const, display: "flex", alignItems: "center" },
  searchIcon: { position: "absolute" as const, left: "8px", color: "#7a7f94", display: "flex", pointerEvents: "none" as const },
  search: { background: "#13161e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "6px 10px 6px 28px", fontSize: "12px", color: "#e8eaf0", outline: "none", width: "160px" },
  btn: (primary?: boolean, active?: boolean) => ({ border: active ? "1px solid #4f9cf9" : primary ? "none" : "1px solid rgba(255,255,255,0.13)", background: primary ? "#4f9cf9" : "#1a1e2a", color: active ? "#4f9cf9" : primary ? "#fff" : "#e8eaf0", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" as const }),
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" },
  card: (selected: boolean) => ({ background: "#13161e", border: `1px solid ${selected ? "#4f9cf9" : "rgba(255,255,255,0.07)"}`, borderRadius: "12px", overflow: "hidden", cursor: "pointer", transition: "border-color .2s, transform .15s" }),
  preview: (status: string) => ({ height: "90px", background: status === "running" ? "rgba(110,231,183,.06)" : status === "paused" ? "rgba(249,162,79,.06)" : "transparent", padding: "10px 12px", fontFamily: "monospace", fontSize: "9.5px", lineHeight: 1.6, overflow: "hidden" }),
  vmInfo: { padding: "10px 12px 6px" },
  vmHeader: { display: "flex", alignItems: "center", gap: "7px", marginBottom: "3px" },
  vmName: { fontSize: "13px", fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const },
  dot: (status: string) => ({ width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0, background: status === "running" ? "#6ee7b7" : status === "paused" ? "#f9a24f" : "#7a7f94", boxShadow: status === "running" ? "0 0 6px #6ee7b7" : status === "paused" ? "0 0 6px #f9a24f" : "none" }),
  badge: (status: string) => ({ fontSize: "9px", padding: "1px 6px", borderRadius: "3px", fontWeight: 500, background: status === "running" ? "rgba(110,231,183,.12)" : status === "paused" ? "rgba(249,162,79,.12)" : "rgba(122,127,148,.15)", color: status === "running" ? "#6ee7b7" : status === "paused" ? "#f9a24f" : "#7a7f94" }),
  vmOs: { fontSize: "10px", color: "#7a7f94", marginBottom: "8px" },
  actions: { display: "flex", gap: "4px", padding: "4px 10px 10px", alignItems: "center" },
  iconBtn: (color?: string) => ({ width: "28px", height: "28px", background: "#1a1e2a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: color || "#7a7f94", flexShrink: 0 }),
  detail: { background: "#13161e", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px", width: "240px", flexShrink: 0 },
  sectionLabel: { fontSize: "10px", color: "#7a7f94", textTransform: "uppercase" as const, letterSpacing: ".08em", marginBottom: "10px" },
  barWrap: { marginBottom: "10px" },
  barLabel: { display: "flex", justifyContent: "space-between", fontSize: "11px", marginBottom: "4px" },
  barVal: { color: "#7a7f94", fontFamily: "monospace", fontSize: "10px" },
  bar: { height: "4px", background: "#1a1e2a", borderRadius: "2px", overflow: "hidden" },
};

export default function App() {
  const [vms, setVms] = useState<VM[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadVMs = () => {
    invoke<string[]>("list_vms").then((raw) => {
      const parsed: VM[] = raw.map((line) => {
        const [name, stateRaw] = line.split("|");
        const status = stateRaw?.includes("running") ? "running"
          : stateRaw?.includes("paused") ? "paused"
          : "stopped";
        return { name, status, cpu: 0, ram: 0, disk: Math.floor(Math.random() * 40) + 10, net: 0 };
      });
      setVms(parsed);
      if (parsed.length > 0 && !selected) setSelected(parsed[0].name);
    });
  };

  useEffect(() => { loadVMs(); }, []);

  const toggleVM = async (vm: VM) => {
    if (vm.status === "running") {
      await invoke("stop_vm", { name: vm.name }).catch(console.error);
    } else {
      await invoke("start_vm", { name: vm.name }).catch(console.error);
    }
    setTimeout(loadVMs, 1500);
  };

  const filtered = vms.filter(v => {
    if (filter !== "all" && v.status !== filter) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sel = vms.find(v => v.name === selected);

  const Preview = ({ vm }: { vm: VM }) => (
    <div style={S.preview(vm.status)}>
      {vm.status === "running" ? <>
        <span style={{ color: "#6ee7b7" }}>user@{vm.name.toLowerCase().replace(/ /g, "-")}:~$</span> htop<br />
        <span style={{ color: "rgba(255,255,255,.4)" }}>CPU[||||||||    38%]</span><br />
        <span style={{ color: "rgba(255,255,255,.4)" }}>Mem[||||||      3.2G]</span><br />
        <span style={{ color: "#6ee7b7" }}>user@{vm.name.toLowerCase().replace(/ /g, "-")}:~$</span> <span style={{ opacity: .6 }}>█</span>
      </> : vm.status === "paused" ? <>
        <span style={{ color: "#f9a24f" }}>⏸ suspended</span><br />
        <span style={{ color: "rgba(255,255,255,.3)" }}>state saved to disk</span>
      </> : <>
        <span style={{ color: "rgba(255,255,255,.3)" }}>[offline]</span><br />
        <span style={{ color: "rgba(255,255,255,.2)" }}>-- powered down --</span>
      </>}
    </div>
  );

  return (
    <div style={S.app}>
      <Sidebar Icon={Icon} />
      <div style={S.main}>
        <Topbar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ ...S.grid, flex: 1 }}>
           {filtered.map(vm => (
            <VMCard
              key={vm.name}
              vm={vm}
              selected={selected === vm.name}
              onSelect={() => setSelected(vm.name)}
              onToggle={() => toggleVM(vm)}
            />
          ))}
          </div>

          {sel && (
            <div style={S.detail}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={S.dot(sel.status)}></div>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{sel.name}</span>
                <span style={{ ...S.badge(sel.status), marginLeft: "auto" }}>{sel.status}</span>
              </div>
              <div style={S.sectionLabel}>Resources</div>
              {[
                { label: "CPU", val: sel.cpu, color: "#4f9cf9" },
                { label: "RAM", val: sel.ram, color: "#9f7aea" },
                { label: "Disk", val: sel.disk, color: "#f9a24f" },
              ].map(r => (
                <div key={r.label} style={S.barWrap}>
                  <div style={S.barLabel}>
                    <span>{r.label}</span>
                    <span style={S.barVal}>{r.val}%</span>
                  </div>
                  <div style={S.bar}>
                    <div style={{ height: "100%", width: `${r.val}%`, background: r.color, borderRadius: "2px", transition: "width .6s ease" }}></div>
                  </div>
                </div>
              ))}
              <div style={{ ...S.sectionLabel, marginTop: "14px" }}>Actions</div>
              <button style={{ ...S.btn(true), width: "100%", justifyContent: "center", marginBottom: "6px" }}
                onClick={() => toggleVM(sel)}>
                {sel.status === "running" ? <>{Icon.stop} Stop VM</> : <>{Icon.play} Start VM</>}
              </button>
              <button style={{ ...S.btn(), width: "100%", justifyContent: "center" }}>
                {Icon.snapshot} Snapshot
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}