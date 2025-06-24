import React, { useContext, useState, useEffect } from "react";
import { useGetUserById } from "@/services";
import { User } from "@/types";
import { useAuth } from "@/hooks";
import { useTranslation } from "react-i18next";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ThemeContext } from "@/context";

export const UserDetailsCard = () => {
  const { t } = useTranslation("translations");
  const { auth } = useAuth();
  const { data: userData } = useGetUserById(auth?.userId ?? "");
  const [user, setUser] = useState<User>({} as User);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;

  const userDetails = [
    { label: t("Full Name"), value: `${user.firstName} ${user.lastName}` },
    { label: t("Email"), value: user.email },
    { label: t("Phone"), value: user.phone },
    { label: t("Address"), value: user.address },
  ];

  return (
    <div className="user-details-card">
      <DataTable value={userDetails}>
        <Column field="label" body={(row) => <strong>{row.label}</strong>} style={{ background: cardBg, color: fontColor, border: "none" }}/>
        <Column field="value" style={{ background: cardBg, color: fontColor, border: "none" }}/>
      </DataTable>
    </div>
  );
};
