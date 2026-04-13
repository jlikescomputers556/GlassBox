
type VM = {
  name: string;
  status: "running" | "stopped" | "paused";
  cpu: number;
  ram: number;
  disk: number;
  net: number;
};

export default function VMCard({
  vm,
  selected,
  onSelect,
  onToggle,
}: {
  vm: VM;
  selected: boolean;
  onSelect: () => void;
  onToggle: () => void;
}) {
  const S = {
    card: {
      background: "#13161e",
      border: `1px solid ${
        selected ? "#4f9cf9" : "rgba(255,255,255,0.07)"
      }`,
      borderRadius: "12px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "border-color .2s, transform .15s",
    },
    preview: {
      height: "90px",
      background:
        vm.status === "running"
          ? "rgba(110,231,183,.06)"
          : vm.status === "paused"
          ? "rgba(249,162,79,.06)"
          : "transparent",
      padding: "10px 12px",
      fontFamily: "monospace",
      fontSize: "9.5px",
    },
    vmInfo: { padding: "10px 12px 6px" },
    vmHeader: {
      display: "flex",
      alignItems: "center",
      gap: "7px",
      marginBottom: "3px",
    },
    vmName: {
      fontSize: "13px",
      fontWeight: 600,
      flex: 1,
    },
    dot: {
      width: "7px",
      height: "7px",
      borderRadius: "50%",
      background:
        vm.status === "running"
          ? "#6ee7b7"
          : vm.status === "paused"
          ? "#f9a24f"
          : "#7a7f94",
    },
    badge: {
      fontSize: "9px",
      padding: "1px 6px",
      borderRadius: "3px",
      background: "rgba(122,127,148,.15)",
      color: "#7a7f94",
    },
    actions: {
      display: "flex",
      gap: "4px",
      padding: "4px 10px 10px",
    },
    btn: {
      width: "28px",
      height: "28px",
      background: "#1a1e2a",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    },
  };

  return (
    <div style={S.card} onClick={onSelect}>
      <div style={S.preview}>
        {vm.status === "running" ? "Running..." : "Stopped"}
      </div>

      <div style={S.vmInfo}>
        <div style={S.vmHeader}>
          <div style={S.dot}></div>
          <div style={S.vmName}>{vm.name}</div>
          <span style={S.badge}>{vm.status}</span>
        </div>
      </div>

      <div style={S.actions}>
        <div
          style={S.btn}
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          {vm.status === "running" ? "■" : "▶"}
        </div>
      </div>
    </div>
  );
}