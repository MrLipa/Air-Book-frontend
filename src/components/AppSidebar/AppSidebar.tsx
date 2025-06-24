import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import defaultAvatar from "@/assets/default_user.png";
import { Sidebar } from "primereact/sidebar";
import { FaPlane, FaUserCircle, FaCog } from "react-icons/fa";
import "./AppSidebar.css";
import { AppSidebarProps } from "@/types";
import { ThemeContext } from "@/context";

const navItems = [
  { icon: <FaPlane size={28} />, label: "Products", path: "/search-flights" },
  { icon: <FaUserCircle size={28} />, label: "Profile", path: "/profile" },
  { icon: <FaCog size={28} />, label: "Settings", path: "/settings" }
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  sidebarVisible,
  toggleSidebar,
  user,
  t,
  handleSignOut
}) => {
  const theme = useContext(ThemeContext);

  if (!theme?.currentTheme) return null;

  const { navbarColor, fontColor } = theme.currentTheme;

  return (
    <Sidebar
      className="custom-sidebar"
      visible={sidebarVisible}
      onHide={toggleSidebar}
      showCloseIcon={false}
      style={{
        background: `linear-gradient(to bottom, ${navbarColor[0]}, ${navbarColor[1]})`
      }}
    >
      <div className="d-flex flex-column h-100 align-items-center">
        <Link to="/" className="sidebar-brand">
          <span
            className="bg-dark text-white d-flex justify-content-center align-items-center rounded"
            style={{
              width: 40,
              height: 40,
              fontWeight: 700
            }}
          >
            B
          </span>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 28,
              alignItems: "center"
            }}
          >
            {navItems.map((item) => {
              const isActive = window.location.pathname === item.path;
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    title={item.label}
                    onClick={toggleSidebar}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      textDecoration: "none",
                      background: isActive ? "#fff" : "transparent",
                      color: isActive ? "#212529" : fontColor,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: 24,
                      transition: "background 0.2s"
                    }}
                  >
                    {React.cloneElement(item.icon as React.ReactElement, {
                      color: isActive ? "#212529" : fontColor
                    })}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div style={{ marginTop: 20 }}>
          <Dropdown className="sidebar-dropdown w-100 mb-2 d-flex justify-content-center">
            <Dropdown.Toggle className="dropdown-toggle" variant="" id="dropdown-user">
              <img
                src={user.image ? `data:image/jpeg;base64,${user.image}` : defaultAvatar}
                alt="user"
                width="32"
                height="32"
                className="rounded-circle"
              />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  toggleSidebar();
                  handleSignOut();
                }}
              >
                {t("Logout")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </Sidebar>
  );
};
