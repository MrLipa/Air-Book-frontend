import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FlightCards, Navbar, Footer } from "@/components";
import "./Home.css";

export const Home = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <>
      <div className="wrapper">
        <Navbar />

        <div className="home-content">
          <div className="home-text-section">
            <h1 className="home-title">Travel with maximum comfort</h1>
            <p className="home-description">
              Find the best travel deals and book your dream trip.
            </p>
          </div>

          <div className="home-search-bar">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <FaMapMarkerAlt />
              </span>
              <InputText placeholder="From" value={from} onChange={(e) => setFrom(e.target.value)}/>
              
              <span className="p-inputgroup-addon">
                <FaMapMarkerAlt />
              </span>
              <InputText placeholder="To" value={to} onChange={(e) => setTo(e.target.value)} />
              <Button label="Search" icon="pi pi-search" className="p-button-rounded"/>
            </div>
          </div>
        </div>
      </div>

      <FlightCards from={from} to={to} />
      <Footer />
    </>
  );
};
