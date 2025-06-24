import './LayoutLogin.css';
import React, { useState, useEffect, useContext } from "react";
import { Avatar } from "primereact/avatar";
import { SearchBar, NotificationIcon, SettingsIcon, FlagIcon, Footer } from "@/components";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Image } from "primereact/image";
import { ThemeContext } from "@/context";
import { useTranslation } from "react-i18next";
import { useLogout, useAuth } from "@/hooks";
import { useToast } from "@/context";
import { useGetUserById } from "@/services";
import { User, ToastSeverity } from "@/types";
import defaultAvatar from "@/assets/default_user.png";
import { AppSidebar } from "@/components";
import { FaPlane } from "react-icons/fa";

export const LayoutLogin: React.FC = () => {
  const { theme, currentTheme } = useContext(ThemeContext);
  const { t } = useTranslation("translations");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const logout = useLogout();
  const { auth } = useAuth();

  if (!auth?.userId) {
    throw new Error("User id is required");
  }

  const { data: userData } = useGetUserById(auth.userId);

  const [user, setUser] = useState<User>({
    id: "",
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    image: '',
    description: '',
    role: '',
    notifications: [],
    reservations: []
  });

  useEffect(() => {
    if (userData) setUser(userData);
  }, [userData]);

  const handleSignOut = async () => {
    await logout();
    showToast(ToastSeverity.SUCCESS, "Success", "Logout successful");
    navigate("/");
  };

  const toggleSidebar = () => setSidebarVisible((prev) => !prev);

  return (
    <div className="layout-root" style={{ color: currentTheme.fontColor }}>
      <header
        style={{
          background: `linear-gradient(to bottom, ${currentTheme.navbarColor[0]}, ${currentTheme.navbarColor[1]})`,
          height: 74,
          padding: "0 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 10px 0 rgba(0,0,0,0.05)",
          zIndex: 999
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <i
            className="pi pi-bars"
            style={{
              fontSize: 28,
              cursor: "pointer",
              marginRight: 10
            }}
            onClick={toggleSidebar}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: 1
            }}>
              Air Book
            </span>
            <FaPlane size={26} style={{ color: "#0d6efd" }} />
          </div>
        </div>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
          marginRight: 4
        }}>
          <div style={{ marginRight: 40 }}>
            <SearchBar />
          </div>
          <NotificationIcon />
          <SettingsIcon />
          <FlagIcon />
          <Link to="/profile" style={{ marginLeft: 18 }}>
            <Avatar size="large" shape="circle">
              <Image
                src={user.image ? `data:image/jpeg;base64,${user.image}` : defaultAvatar}
                alt="User"
                width="40"
                height="40"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
            </Avatar>
          </Link>

        </div>
      </header>

      <AppSidebar
        sidebarVisible={sidebarVisible}
        toggleSidebar={toggleSidebar}
        user={user}
        t={t}
        handleSignOut={handleSignOut}
      />

      <main className="content" style={{ backgroundColor: currentTheme.backgroundColor }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
