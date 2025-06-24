import React, { useRef, useContext, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { LanguageContext, ThemeContext } from "@/context";
import * as Flags from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";

export const FlagIcon: React.FC = () => {
  const op = useRef<OverlayPanel>(null);
  const { language, flag, toggleLanguage } = useContext(LanguageContext);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation("translations");

  const isDark = theme === 1;
  const bgColor = isDark ? "#111" : "#fff";
  const textColor = isDark ? "#fff" : "#222";
  const hoverBg = isDark ? "#222" : "#eee";
  const hoverColor = isDark ? "#fff" : "#111";

  const flagStyles: React.CSSProperties = {
    width: "24px",
    height: "24px",
    marginRight: "8px",
    borderRadius: "4px",
  };

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const menuItems = [
    {
      label: t("Polish"),
      icon: <Flags.PL style={flagStyles} />,
      command: () => toggleLanguage("pl"),
    },
    {
      label: t("English"),
      icon: <Flags.GB style={flagStyles} />,
      command: () => toggleLanguage("en"),
    },
    {
      label: t("German"),
      icon: <Flags.DE style={flagStyles} />,
      command: () => toggleLanguage("de"),
    },
  ];

  const itemTemplate = (item: any, options: any, i: number) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "8px 16px",
        cursor: "pointer",
        background: hoveredIndex === i ? hoverBg : bgColor,
        color: hoveredIndex === i ? hoverColor : textColor,
        borderRadius: 6,
        fontWeight: language === item.label.toLowerCase() ? "bold" : "normal",
        fontSize: 15,
        transition: "all 0.1s",
      }}
      onClick={item.command}
      onMouseEnter={() => setHoveredIndex(i)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {item.icon}
      {item.label}
    </div>
  );

  return (
    <div>
      <span
        onClick={(e) => op.current?.toggle(e)}
        style={{ cursor: "pointer", display: "inline-block" }}
        title={t("Change language") as string}
      >
        {flag}
      </span>
      <OverlayPanel
        ref={op}
        id="globe-menu"
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
        {menuItems.map((item, i) =>
          <React.Fragment key={item.label}>
            {itemTemplate(item, {}, i)}
          </React.Fragment>
        )}
      </div>
      </OverlayPanel>
    </div>
  );
};
