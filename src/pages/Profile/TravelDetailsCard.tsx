import React, { useContext, useState, useEffect } from "react";
import { useGetFlightsByUserId, useDeleteReservationMutation, useCreateNotificationMutation } from "@/services";
import { Flight } from "@/types";
import { useAuth } from "@/hooks";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ThemeContext } from "@/context";

export const TravelDetailsCard = () => {
  const { t } = useTranslation("translations");
  const { auth } = useAuth();
  const { data: flights } = useGetFlightsByUserId(auth?.userId ?? "");
  const [flightData, setFlightData] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<Flight>();
  const theme = useContext(ThemeContext);
  const navigate = useNavigate();
    if (!auth?.userId) {
    throw new Error("User id is required");
  }

  const cancelReservation = useDeleteReservationMutation(auth.userId);
  const addMessage = useCreateNotificationMutation();


  useEffect(() => {
    if (flights) {
      setFlightData(
        flights.map((f: Flight, i: number) => ({ ...f, customId: i + 1 }))
      );
    }
  }, [flights]);

  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;

  const removeFlight = (flight: Flight) => {
    cancelReservation.mutate(flight.reservationId ?? "");
    addMessage.mutate({ userId: auth.userId, message: `Reservation cancel to ${flight.destinationCountry} ${flight.destinationCity}` });
  };

  const actionTemplate = (flight: Flight) => {
    const flightDate = new Date(flight.date).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);
    return (
      <Button
        icon="pi pi-times"
        severity="danger"
        onClick={() => removeFlight(flight)}
        disabled={flightDate < today}
      />
    );
  };

  const toTemplate = (flight: Flight) => (
    <div className="travel-destination">
      <img src={flight.destinationImage} alt={flight.destinationCity} />
      <span>{flight.destinationCity}</span>
    </div>
  );

  return (
    <Card title={t("Travel Details")} className="travel-details-card" style={{ background: cardBg, color: fontColor, border: "none" }}>
      <DataTable
        value={flightData}
        selection={selectedFlight}
        onSelectionChange={(e) => {
          const selected = e.value as Flight;
          setSelectedFlight(selected);
          navigate(`/flight/${selected.id}`);
        }}
        dataKey="customId"
        selectionMode="single"
      >
        <Column field="destinationCity" header={t("Destination")} body={toTemplate} sortable style={{ background: cardBg, color: fontColor, border: "none" }} />
        <Column field="price" header={t("Price")}style={{ background: cardBg, color: fontColor, border: "none" }} sortable />
        <Column field="date" header={t("Date")}style={{ background: cardBg, color: fontColor, border: "none" }} sortable />
        <Column header={t("Action")}style={{ background: cardBg, color: fontColor, border: "none" }} body={actionTemplate} />
      </DataTable>
    </Card>
  );
};
