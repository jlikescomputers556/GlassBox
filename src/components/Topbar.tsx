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
    },
    h1: {
      fontSize: "15px",
      fontWeight: 600,
      flex: 1,
    },
    search: {
      background: "#13161e",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "8px",
      padding: "6px 10px",
      fontSize: "12px",
      color: "#e8eaf0",
      outline: "none",
      width: "160px",
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