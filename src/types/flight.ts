export interface Flight {
  reservationId?: string;
  id: string;
  originCountry: string;
  originCity: string;
  originImage: string;
  destinationCountry: string;
  destinationCity: string;
  destinationImage: string;
  distance: number;
  date: string;
  price: number;
  duration: string;
  airlines: string;
  flightClass: string;
  freeSeats: number;
}
