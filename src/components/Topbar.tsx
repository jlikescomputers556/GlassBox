export default function Topbar({
  search,
  setSearch,
  filter,
  setFilter,
}: {
  search: string;
  setSearch: (v: string) => void;
  filter: string;
  setFilter: (v: string) => void;
}) {
  const S = {
    topbar: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "18px",
      padding: "10px 12px",
      background: "rgba(19,22,30,0.6)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "12px",
    },
    h1: {
      fontSize: "15px",
      fontWeight: 600,
      flex: 1,
    },
    search: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "8px",
      padding: "6px 10px",
      color: "#e8eaf0",
      outline: "none",
      transition: "all 0.15s ease",
    },
    btn: (active?: boolean) => ({
      border: active
        ? "1px solid #4f9cf9"
        : "1px solid rgba(255,255,255,0.13)",
      background: "#1a1e2a",
      color: active ? "#4f9cf9" : "#e8eaf0",
      padding: "6px 12px",
      borderRadius: "8px",
      fontSize: "12px",
      cursor: "pointer",
    }),
  };

  return (
    <div style={S.topbar}>
      <h1 style={S.h1}>Virtual Machines</h1>

      <input
        style={S.search}
        placeholder="Search VMs…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}

        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid #4f9cf9"
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"
        }}
      />

      {["all", "running", "stopped"].map((f) => (
        <button
          key={f}
          style={S.btn(filter === f)}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}