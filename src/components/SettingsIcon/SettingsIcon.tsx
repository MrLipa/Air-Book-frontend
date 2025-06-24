import React, { useRef, useContext, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { ThemeContext } from "@/context";
import { useTranslation } from "react-i18next";

export const SettingsIcon = () => {
  const overlayRef = useRef<OverlayPanel | null>(null);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation("translations");

  const isDark = theme === 1;
  const bgColor = isDark ? "#111" : "#fff";
  const textColor = isDark ? "#fff" : "#222";
  const hoverBg = isDark ? "#222" : "#eee";
  const hoverColor = isDark ? "#fff" : "#111";

  // Ikona zależna od motywu (możesz zamienić na SVG, jeśli chcesz)
  const themeIcon = isDark ? "🌞" : "🌚";

  // Hover dla pozycji menu
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const settingsItems = [
    {
      label: t("Theme"),
      icon: themeIcon,
      command: () => toggleTheme(theme === 0 ? 1 : 0),
    },
  ];

  // Menu item template
  const itemTemplate = (item: any, i: number) => (
    <div
      key={item.label}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        cursor: "pointer",
        background: hoveredIndex === i ? hoverBg : bgColor,
        color: hoveredIndex === i ? hoverColor : textColor,
        borderRadius: 6,
        fontWeight: "normal",
        fontSize: 15,
        transition: "all 0.1s",
      }}
      onClick={item.command}
      onMouseEnter={() => setHoveredIndex(i)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <span style={{ fontSize: 22, marginRight: 12 }}>{item.icon}</span>
      {item.label}
    </div>
  );

  return (
    <div>
      <i
        className="pi pi-cog"
        style={{
          fontSize: "2rem",
          cursor: "pointer",
          color: isDark ? "#fff" : "#222",
          verticalAlign: "middle",
        }}
        onClick={(e) => overlayRef.current?.toggle(e)}
        title={t("Settings") as string}
      />
      <OverlayPanel
        ref={overlayRef}
        id="cog-menu"
        showCloseIcon={false}
        dismissable
        style={{
          background: bgColor,
          borderRadius: 10,
          padding: 0,
          minWidth: 180,
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ background: bgColor, borderRadius: 10, padding: 0 }}>
          {settingsItems.map((item, i) => itemTemplate(item, i))}
        </div>
      </OverlayPanel>
    </div>
  );
};
