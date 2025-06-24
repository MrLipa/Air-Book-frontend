import React, { useRef, useContext, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { OverlayPanel } from "primereact/overlaypanel";
import { useGetNotificationsByUserId } from "@/services";
import { useAuth } from "@/hooks";
import { NotificationType } from "@/types";
import { ThemeContext } from "@/context";

export const NotificationIcon: React.FC = () => {
  const { auth } = useAuth();
  const { theme } = useContext(ThemeContext);
  const op = useRef<OverlayPanel | null>(null);

  const userId = auth?.userId;
  const { data: notifications = [], isLoading, isError } = useGetNotificationsByUserId(userId!);

  const rowsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(0);

  const isDark = theme === 1;
  const bgColor = isDark ? "#181818" : "#fff";
  const textColor = isDark ? "#eee" : "#222";
  const borderColor = isDark ? "#333" : "#e2e2e2";
  const headerBg = isDark ? "#222" : "#f4f4f4";

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setCurrentPage(event.page);
  };

  const sortedNotifications: NotificationType[] = [...notifications].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getPaginatedNotifications = (): NotificationType[] => {
    const start = currentPage * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedNotifications.slice(start, end);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const NotificationPanel = () => {
    if (isLoading) return <div style={{ color: textColor, padding: 16 }}>Loading...</div>;
    if (isError) return <div style={{ color: textColor, padding: 16 }}>Error occurred.</div>;

    return (
      <div style={{
        minWidth: "22rem",
        background: bgColor,
        color: textColor,
        borderRadius: 12,
        border: `1px solid ${borderColor}`,
        boxShadow: "0 2px 16px 0 rgba(0,0,0,0.13)",
        padding: 0
      }}>
        <DataTable
          value={getPaginatedNotifications()}
          responsiveLayout="scroll"
          style={{
            background: bgColor,
            color: textColor,
            borderRadius: 12,
            border: "none"
          }}
        >
          <Column
            field="message"
            header="Message"
            body={rowData => (
              <span style={{ color: textColor }}>{rowData.message}</span>
            )}
            style={{
              background: bgColor,
              color: textColor,
              borderBottom: `1px solid ${borderColor}`
            }}
            headerStyle={{
              background: headerBg,
              color: textColor
            }}
          />
          <Column
            field="created_at"
            header="Date"
            body={row => <span style={{ color: textColor }}>{formatDate(row.created_at)}</span>}
            style={{
              background: bgColor,
              color: textColor,
              borderBottom: `1px solid ${borderColor}`
            }}
            headerStyle={{
              background: headerBg,
              color: textColor
            }}
          />
        </DataTable>
        <Paginator
          first={currentPage * rowsPerPage}
          rows={rowsPerPage}
          totalRecords={sortedNotifications.length}
          onPageChange={onPageChange}
          pageLinkSize={3}
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          style={{
            background: headerBg,
            color: textColor,
            border: "none",
            borderTop: `1px solid ${borderColor}`,
            borderRadius: "0 0 12px 12px"
          }}
        />
      </div>
    );
  };

  if (!userId) return null;

  return (
    <div>
      <span
        style={{ position: "relative", display: "inline-block" }}
        onClick={e => op.current?.toggle(e)}
      >
        <i
          className="pi pi-bell"
          style={{
            fontSize: "2rem",
            cursor: "pointer",
            color: isDark ? "#eee" : "#222",
            verticalAlign: "middle"
          }}
        />
        {notifications && notifications.length > 0 && (
          <Badge
            value={notifications.length}
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#eb5757",
              color: "#fff",
              fontSize: 12,
              padding: "0 6px",
              borderRadius: 12,
              minWidth: 20,
              height: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          />
        )}
      </span>
      <OverlayPanel
        ref={op}
        id="bell-menu"
        showCloseIcon={false}
        dismissable
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          padding: 0
        }}
      >
        <NotificationPanel />
      </OverlayPanel>
    </div>
  );
};
