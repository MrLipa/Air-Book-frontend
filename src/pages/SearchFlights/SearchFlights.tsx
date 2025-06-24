import React, { useRef, useContext, useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { useGetAllFlights } from "@/services";
import { Flight } from "@/types";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "@/context";
import { useTranslation } from "react-i18next";
import { DataTableFilterMeta } from "primereact/datatable";
import type { DataTableFilterMetaData } from "primereact/datatable";
import "./SearchFlights.css";

export const SearchFlights = () => {
  const { t } = useTranslation("translations");
  const { data: flights, isLoading, isError } = useGetAllFlights();
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const navigate = useNavigate();
  const theme = useContext(ThemeContext);
  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;
  useEffect(() => {
    if (!isLoading && !isError && flights) {
      setFlightData(flights);
    }
  }, [flights, isLoading, isError]);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});

  const statuses = [t("Business"), t("First Class"), t("Economy")];

  const getClassSeverity = (status: string) =>
    status === t("Business") ? "danger" :
    status === t("Economy") ? "success" : "info";

  const renderImageWithText = (src: string, label: string) => (
    <div className="flight-cell">
      <img src={src} className="flight-img" />
      <span>{label}</span>
    </div>
  );

  const renderHeader = () => (
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
        type="search"
        value={(filters.global as DataTableFilterMetaData)?.value || ""}
        onChange={(e) => setFilters({ ...filters, global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS } })}
        placeholder={t("Global Search") ?? ""}
        style={{background: cardBg, color: fontColor}}
      />
    </span>
  );

  const classItemTemplate = (option: string) => (
    <Tag value={option} severity={getClassSeverity(option)} />
  );

  const classFilterTemplate = (options: any) => (
    <Dropdown
      value={options.value}
      options={statuses}
      onChange={(e) => options.filterCallback(e.value)}
      itemTemplate={classItemTemplate}
      placeholder={t("Select One") ?? ""}
      className="p-column-filter"
      showClear
      style={{background: cardBg, color: fontColor}}
    />
  );

  const styleTag = (
    <style>
      {`
        .p-datatable, .p-datatable-wrapper, .p-datatable-table, .p-datatable-thead > tr > th, .p-datatable-tbody > tr > td, .p-datatable-header,
        .p-datatable-footer, .p-paginator, .p-paginator-pages .p-paginator-page {
          background: ${cardBg} !important;
          color: ${fontColor} !important;
          border-color: ${cardBg} !important;
        }
        .p-datatable-tbody > tr {
          background: ${cardBg} !important;
        }
        .p-datatable-tbody > tr.p-highlight, .p-datatable-tbody > tr:hover {
          background: ${theme.theme === 1 ? "#24304a" : "#f2f6fa"} !important;
        }
        .p-paginator {
          background: ${cardBg} !important;
          color: ${fontColor} !important;
        }
        .p-paginator-page.p-highlight {
          background: ${theme.theme === 1 ? "#222c3a" : "#e2e2e2"} !important;
          color: ${fontColor} !important;
        }
        .p-tag {
          color: ${fontColor} !important;
        }
      `}
    </style>
  );

  return (
    <div style={{ background: cardBg, color: fontColor, border: "none", borderRadius: 14, boxShadow: "0 2px 14px 0 rgba(0,0,0,0.08)", padding: 24 }}>
      {styleTag}
      <DataTable
        value={flightData}
        paginator
        style={{ background: cardBg, color: fontColor, border: "none" }}
        rows={5}
        header={renderHeader()}
        filters={filters}
        onFilter={(e) => setFilters(e.filters)}
        selection={selectedFlight}
        onSelectionChange={(e) => {
          const selected = e.value as Flight;
          navigate(`/flight/${selected.id}`);
          setSelectedFlight(selected);
        }}
        selectionMode="single"
        dataKey="id"
        emptyMessage={<span style={{ color: "#bbb" }}>{t("No flights found.")}</span>}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column
          header={t("From")}
          body={(row: Flight) => renderImageWithText(row.originImage, row.originCity)}
          sortable
          filter
          filterField="originCity"
          filterPlaceholder={t("Search") ?? ""}
          style={{ background: cardBg, color: fontColor, border: "none", width: "25%" }}
        />
        <Column
          header={t("To")}
          body={(row: Flight) => renderImageWithText(row.destinationImage, row.destinationCity)}
          sortable
          filter
          filterField="destinationCity"
          filterPlaceholder={t("Search") ?? ""}
          style={{ background: cardBg, color: fontColor, border: "none", width: "25%" }}
        />
        <Column
          field="price"
          header={t("Price")}
          sortable
          filter
          filterPlaceholder={t("Search") ?? ""}
          style={{ background: cardBg, color: fontColor, border: "none", width: "25%" }}
        />
        <Column
          field="flightClass"
          header={t("Class")}
          body={(row: Flight) => (
            <Tag value={row.flightClass} severity={getClassSeverity(row.flightClass)} />
          )}
          sortable
          filter
          filterElement={classFilterTemplate}
          filterMenuStyle={{ width: "14rem" }}
          style={{ background: cardBg, color: fontColor, border: "none", width: "25%" }}
        />
      </DataTable>
    </div>
  );
};
