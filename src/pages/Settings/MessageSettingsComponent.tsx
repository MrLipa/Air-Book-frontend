import React, { useContext } from "react";
import { Card } from "primereact/card";
import { InputSwitch } from "primereact/inputswitch";
import { Menu } from "primereact/menu";
import { useTranslation } from "react-i18next";
import * as Flags from "country-flag-icons/react/3x2";
import { ThemeContext, LanguageContext } from "@/context";

export const MessageSettingsComponent = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);
  const { toggleLanguage } = useContext(LanguageContext);

  const languageOptions = [
    {
      label: t("polish"),
      icon: <Flags.PL className="flag-icon" />,
      command: () => toggleLanguage("pl"),
    },
    {
      label: t("english"),
      icon: <Flags.GB className="flag-icon" />,
      command: () => toggleLanguage("en"),
    },
    {
      label: t("german"),
      icon: <Flags.DE className="flag-icon" />,
      command: () => toggleLanguage("de"),
    },
  ];
  
  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;

  return (
    <div style={{ background: cardBg, color: fontColor, border: "none" }}>
      <h2 className="section-title">{t("messageSettings")}</h2>
      <p>{t("selectNotifications")}</p>

      <div className="settings-section" style={{ background: cardBg, color: fontColor, border: "none" }}>
        <h3 className="sub-title">{t("theme")}</h3>
        <Card style={{ background: cardBg, color: fontColor, border: "none" }}>
          <h4>{t("darkTheme")}</h4>
          <InputSwitch
            checked={theme.theme !== 0}
            onChange={() => theme.toggleTheme(theme.theme === 0 ? 1 : 0)}
          />
        </Card>
      </div>

      <div className="settings-section" style={{ background: cardBg, color: fontColor, border: "none" }}>
        <h3 className="sub-title">{t("language")}</h3>
        <Card style={{ background: cardBg, color: fontColor, border: "none" }}>
          <h4>{t("selectLanguage")}</h4>
          <Menu model={languageOptions} style={{ background: cardBg, color: fontColor, border: "none" }}/>
        </Card>
      </div>
    </div>
  );
};
