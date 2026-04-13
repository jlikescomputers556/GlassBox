
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
      background: "linear-gradient(145deg, #13161e, #0f1218)",
      border: `1px solid ${
        selected ? "#4f9cf9" : "rgba(255,255,255,0.05)"
      }`,
      borderRadius: "14px",
      overflow: "hidden",
      cursor: "pointer",
      transition: "all .2s ease",
      boxShadow: selected
        ? "0 0 0 1px #4f9cf9, 0 10px 30px rgba(0,0,0,0.4)"
        : "0 6px 20px rgba(0,0,0,0.25)",
  },
    preview: {
      height: "90px",
      background: "rgba(255,255,255,0.02)",
      borderBottom: "1px solid rgba(255,255,255,0.05)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: 500,
    },
    vmInfo: { padding: "10px 12px 6px" },
    vmHeader: {
      display: "flex",
      alignItems: "center",
      gap: "7px",
      marginBottom: "3px",
    },
    vmName: {
      fontSize: "14px",
      fontWeight: 600,
      flex: 1,
      letterSpacing: "-0.2px",
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
      fontSize: "10px",
      padding: "2px 7px",
      borderRadius: "5px",
      fontWeight: 500,
      background:
        vm.status === "running"
          ? "rgba(110,231,183,.12)"
          : vm.status === "paused"
          ? "rgba(249,162,79,.12)"
          : "rgba(122,127,148,.15)",
      color:
        vm.status === "running"
          ? "#6ee7b7"
          : vm.status === "paused"
          ? "#f9a24f"
          : "#7a7f94",
      },
    actions: {
      display: "flex",
      gap: "6px",
      padding: "6px 10px 12px",
      borderTop: "1px solid rgba(255,255,255,0.05)",
    },
    btn: {
      width: "30px",
      height: "30px",
      background: "#1a1e2a",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.15s ease",
    },
  };

 return (
  <div 
    style={S.card} 
    onClick={onSelect}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0) scale(1)"
    }}
    >
    <div style={S.preview}>
      {vm.status === "running" ? (
        <span style={{ color: "#6ee7b7" }}>Running</span>
      ) : vm.status === "paused" ? (
        <span style={{ color: "#f9a24f" }}>Paused</span>
      ) : (
        <span style={{ color: "#7a7f94" }}>Stopped</span>
      )}
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
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#222636";
        }}
        onMouseLeave={(e) => {          
          e.currentTarget.style.background = "#1a1e2a";
        }}
      >
        {vm.status === "running" ? "■" : "▶"}
      </div>
    </div>
  </div>
);
}