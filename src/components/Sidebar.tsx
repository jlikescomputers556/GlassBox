export default function Sidebar({ Icon }: { Icon: any }) {
  const S = {
    sidebar: {
      width: "52px",
      background: "#13161e",
      borderRight: "1px solid rgba(255,255,255,0.07)",
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      padding: "14px 0",
      gap: "6px",
      flexShrink: 0,
    },
    logo: {
      width: "32px",
      height: "32px",
      background: "#4f9cf9",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "10px",
    },
    navIcon: (active: boolean) => ({
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      background: active ? "#1a1e2a" : "transparent",
      color: active ? "#4f9cf9" : "#7a7f94",
    }),
  };

  return (
    <div style={S.sidebar}>
      <div style={S.logo}>{Icon.logo}</div>

      {[Icon.grid, Icon.clock, Icon.network, Icon.settings].map((icon, i) => (
        <div key={i} style={S.navIcon(i === 0)}>
          {icon}
        </div>
      ))}

      <div style={{ ...S.navIcon(false), marginTop: "auto" }}>
        {Icon.settings}
      </div>
    </div>
  );
}
