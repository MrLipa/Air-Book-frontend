import React, { useContext, useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { useGetUserById } from "@/services";
import { User } from "@/types";
import { useAuth } from "@/hooks";
import { useTranslation } from "react-i18next";
import defaultAvatar from "@/assets/default_user.png";
import { ThemeContext } from "@/context";

export const ProfileCard = () => {
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

  return (
    <Card
      title={`${user.firstName ?? ''} ${user.lastName ?? ''}`}
      subTitle={t("Passenger")}
      header={
        <Image
          src={user.image ? `data:image/jpeg;base64,${user.image}` : defaultAvatar}
          alt="Profile"
          width="150"
          height="150"
          preview
          style={{
            borderRadius: "50%",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.11)",
            border: `3px solid ${cardBg}`
          }}
        />
      }
      style={{
        background: cardBg,
        color: fontColor,
        borderRadius: 18,
        boxShadow: "0 2px 12px 0 rgba(0,0,0,0.10)",
        padding: 28,
        minWidth: 320,
        minHeight: 370,
        textAlign: "center"
      }}
    >
      <p style={{ color: fontColor, marginTop: 12 }}>{user.description ?? ''}</p>
    </Card>
  );
};
