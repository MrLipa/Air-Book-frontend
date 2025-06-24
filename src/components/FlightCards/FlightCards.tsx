import React from "react";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { useSearchFlights } from "@/services";
import { Flight, FlightCardsProps } from "@/types";
import { useTranslation } from "react-i18next";


const FlightCards: React.FC<FlightCardsProps> = ({ from, to }) => {
  const { t } = useTranslation();
  const { data: flights, isLoading, isError } = useSearchFlights(from, to);
  const responsiveOptions: CarouselResponsiveOption[] = [
    {
      breakpoint: "1199px",
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: "991px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const flightTemplate = (flight: Flight) => {
    return (
      <div className="p-card p-component" style={{ width: "18rem" }}>
        <div className="p-card-body">
          <img
            src={flight.destinationImage}
            alt={flight.destinationCity}
            style={{ width: "100%", height: "200px" }}
          />
          <div className="p-card-title p-component" style={{ color: "blue" }}>
            {flight.originCity} - {flight.destinationCity}
          </div>
          <div className="p-card-content p-component">
            <span style={{ fontSize: "0.8rem" }}>
              {t("FlightCard_Date")} {flight.date}
            </span>
            <div style={{ color: "red", textAlign: "right" }}>
              {t("FlightCard_Price")} {flight.price} {t("FlightCard_Currency")}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } 
  
  if (isError) {
    return <div>Error loading flights</div>;
  }

  return (
    <div className="card">
      <Carousel
        value={flights}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        itemTemplate={flightTemplate}
      />
    </div>
  );
}

export {FlightCards};
