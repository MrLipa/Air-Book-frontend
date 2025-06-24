import { useContext } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "@/context";
import "./Settings.css";
import { ProfileComponent } from "./ProfileComponent";
import { MessageSettingsComponent } from "./MessageSettingsComponent";

export const Settings = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext);

  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;

  return (
    <div
      style={{
        background: cardBg,
        color: fontColor,
        borderRadius: 16,
        padding: 28,
        minHeight: 420,
        boxShadow: "0 2px 14px 0 rgba(0,0,0,0.08)",
      }}
    >
      <style>
        {`
          .p-tabview-nav {
            background: ${cardBg} !important;
            color: ${fontColor} !important;
            border-radius: 12px 12px 0 0 !important;
          }
          .p-tabview-panels {
            background: ${cardBg} !important;
            color: ${fontColor} !important;
            border-radius: 0 0 12px 12px !important;
          }
          .p-tabview-nav-link {
            background: transparent !important;
            color: ${fontColor} !important;
            border: none !important;
          }
          .p-tabview-selected .p-tabview-nav-link {
            background: ${theme.theme === 1 ? "#222c3a" : "#f5f8fa"} !important;
            color: ${fontColor} !important;
            border-radius: 8px 8px 0 0 !important;
          }
        `}
      </style>
      <TabView>
        <TabPanel header={t("profileTab")}>
          <ProfileComponent />
        </TabPanel>
        <TabPanel header={t("settingsTab")}>
          <MessageSettingsComponent />
        </TabPanel>
      </TabView>
    </div>
  );
};
