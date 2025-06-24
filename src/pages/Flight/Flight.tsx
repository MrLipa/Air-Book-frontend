import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { useGetFlightsByIds, useCreateReservationMutation, useCreateNotificationMutation } from "@/services";
import { Flight } from "@/types";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks";
import { ThemeContext } from "@/context";
import "./Flight.css";

export const FlightComponent = () => {
  const params = useParams();
  const { t } = useTranslation("translations");
  const flightId = params.flightId ?? "0";
  const { data: flightsData, isLoading, isError } = useGetFlightsByIds([flightId]);
  const createReservationMutation = useCreateReservationMutation();
  const createNotificationMutation = useCreateNotificationMutation();
  const theme = useContext(ThemeContext);
  const { auth } = useAuth();

  if (!auth?.userId) throw new Error("User id is required");

  const [flight, setFlight] = useState<Flight>({
    id: "",
    originCountry: "",
    originCity: "",
    originImage: "",
    destinationCountry: "",
    destinationCity: "",
    destinationImage: "",
    distance: 0,
    price: 0,
    date: "",
    duration: "",
    airlines: "",
    flightClass: "",
    freeSeats: 0,
  });

  useEffect(() => {
    if (flightsData && flightsData.length > 0) {
      setFlight(flightsData[0]);
    }
  }, [flightsData]);

  useEffect(() => {
    if (createReservationMutation.isSuccess && !createReservationMutation.isLoading) {
      createNotificationMutation.mutate({
        userId: auth.userId,
        message: `Reservation created for flight to ${flight.destinationCountry} ${flight.destinationCity}`,
      });
    }
  }, [createReservationMutation.isSuccess]);

  const handleClick = () => {
    createReservationMutation.mutate({ userId: auth.userId, flightId });
  };

  const isFlightInPast = new Date(flight.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error...</div>;

  const cardBg = theme.theme === 1 ? "#172134" : "#fff";
  const fontColor = theme.currentTheme.fontColor;

  return (
    <>
      <div className="flight-wrapper">
        <Card className="flight-card" style={{ backgroundColor: cardBg, color: fontColor }}>
          <h3>{t("Origin")}</h3>
          <h6>{flight.originCountry} {flight.originCity}</h6>
          <img src={flight.originImage} alt={flight.originCity} />
        </Card>
        <Card className="flight-card" style={{ backgroundColor: cardBg, color: fontColor }}>
          <h3>{t("Destination")}</h3>
          <h6>{flight.destinationCountry} {flight.destinationCity}</h6>
          <img src={flight.destinationImage} alt={flight.destinationCity} />
        </Card>
      </div>

      <Card className="flight-details" style={{ backgroundColor: cardBg, color: fontColor }}>
        <h3>{t("Details")}</h3>
        <div className="flight-info">
          <div>
            <h6><i className={PrimeIcons.MONEY_BILL} /> {t("Price")}: {flight.price} zł</h6>
            <h6><i className={PrimeIcons.CALENDAR} /> {t("Date")}: {flight.date}</h6>
            <h6><i className={PrimeIcons.CLOCK} /> {t("Duration")}: {flight.duration}</h6>
          </div>
          <div>
            <h6><i className={PrimeIcons.GLOBE} /> {t("Airline")}: {flight.airlines}</h6>
            <h6><i className={PrimeIcons.STAR} /> {t("Class")}: {flight.flightClass}</h6>
            <h6><i className={PrimeIcons.USER_PLUS} /> {t("Free Seats")}: {flight.freeSeats}</h6>
          </div>
        </div>
        <Button label={t("Book") ?? ""} onClick={handleClick} disabled={isFlightInPast} />
      </Card>
    </>
  );
};
