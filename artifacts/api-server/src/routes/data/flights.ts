import { getAirportByCode } from "./airports.js";

export interface Seat {
  seatNumber: string;
  class: "economy" | "business";
  available: boolean;
  type: "window" | "middle" | "aisle";
  extraLegroom: boolean;
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  airlineLogo: string;
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopDetails: string[];
  aircraft: string;
  priceEconomy: number;
  priceBusiness: number;
  seatsAvailableEconomy: number;
  seatsAvailableBusiness: number;
  amenities: string[];
  status: "on-time" | "delayed" | "cancelled";
}

export interface FlightDetail extends Flight {
  seats: Seat[];
}

const AIRLINES = [
  { name: "Air Algérie", code: "AH", logo: "AH", aircraft: ["Boeing 737-800", "Boeing 737 MAX 8", "ATR 72-600"] },
  { name: "Tassili Airlines", code: "SF", logo: "SF", aircraft: ["Boeing 737-600", "ATR 72-500"] },
];

const ROUTE_CONFIG: Record<string, { minPrice: number; duration: string; durationMins: number }> = {
  "ALG-ORN": { minPrice: 12500, duration: "1h 10m", durationMins: 70 },
  "ALG-CZL": { minPrice: 10800, duration: "1h 05m", durationMins: 65 },
  "ALG-AAE": { minPrice: 13200, duration: "1h 20m", durationMins: 80 },
  "ALG-TLM": { minPrice: 14500, duration: "1h 25m", durationMins: 85 },
  "ALG-BJA": { minPrice: 9500, duration: "0h 55m", durationMins: 55 },
  "ALG-SKI": { minPrice: 10200, duration: "1h 00m", durationMins: 60 },
  "ALG-BSK": { minPrice: 15800, duration: "1h 35m", durationMins: 95 },
  "ALG-TMR": { minPrice: 24500, duration: "2h 15m", durationMins: 135 },
  "ALG-HME": { minPrice: 21000, duration: "1h 50m", durationMins: 110 },
  "ALG-OGX": { minPrice: 19500, duration: "1h 40m", durationMins: 100 },
  "ORN-CZL": { minPrice: 18500, duration: "1h 45m", durationMins: 105 },
  "ORN-AAE": { minPrice: 22000, duration: "2h 00m", durationMins: 120 },
  "CZL-AAE": { minPrice: 11000, duration: "1h 10m", durationMins: 70 },
  "ALG-GJL": { minPrice: 10500, duration: "1h 05m", durationMins: 65 },
  "ALG-ELU": { minPrice: 17200, duration: "1h 30m", durationMins: 90 },
};

function getRouteKey(origin: string, destination: string): string {
  const direct = `${origin}-${destination}`;
  const reverse = `${destination}-${origin}`;
  return ROUTE_CONFIG[direct] ? direct : reverse;
}

function addMinutes(isoDate: string, hours: number, minutes: number, extraMins: number): string {
  const d = new Date(isoDate);
  d.setHours(hours, minutes, 0, 0);
  const arrival = new Date(d.getTime() + extraMins * 60000);
  return arrival.toISOString();
}

function generateSeats(): Seat[] {
  const seats: Seat[] = [];

  // Business class rows 1-4
  for (let row = 1; row <= 4; row++) {
    const cols = ["A", "C", "D", "F"];
    cols.forEach((col, idx) => {
      const type = col === "A" || col === "F" ? "window" : "aisle";
      seats.push({
        seatNumber: `${row}${col}`,
        class: "business",
        available: Math.random() > 0.35,
        type: type as "window" | "aisle",
        extraLegroom: row === 1,
      });
    });
  }

  // Economy rows 5-30
  for (let row = 5; row <= 30; row++) {
    const cols = ["A", "B", "C", "D", "E", "F"];
    cols.forEach((col) => {
      let type: "window" | "middle" | "aisle" = "middle";
      if (col === "A" || col === "F") type = "window";
      else if (col === "C" || col === "D") type = "aisle";
      seats.push({
        seatNumber: `${row}${col}`,
        class: "economy",
        available: Math.random() > 0.4,
        type,
        extraLegroom: row === 5 || row === 14,
      });
    });
  }

  return seats;
}

export function generateFlights(origin: string, destination: string, dateStr: string): FlightDetail[] {
  const routeKey = getRouteKey(origin, destination);
  const config = ROUTE_CONFIG[routeKey];
  if (!config) return [];

  const originAirport = getAirportByCode(origin);
  const destAirport = getAirportByCode(destination);
  if (!originAirport || !destAirport) return [];

  const departureTimes = [
    { hours: 6, minutes: 0 },
    { hours: 8, minutes: 30 },
    { hours: 11, minutes: 15 },
    { hours: 14, minutes: 45 },
    { hours: 17, minutes: 20 },
    { hours: 20, minutes: 0 },
  ];

  const flights: FlightDetail[] = [];

  departureTimes.forEach((time, idx) => {
    const airline = AIRLINES[idx % 2];
    const aircraft = airline.aircraft[idx % airline.aircraft.length];
    const depDate = new Date(`${dateStr}T00:00:00Z`);
    depDate.setHours(time.hours, time.minutes, 0, 0);

    const arrivalDate = new Date(depDate.getTime() + config.durationMins * 60000);

    const priceVariation = 1 + (idx * 0.08);
    const priceEconomy = Math.round(config.minPrice * priceVariation / 100) * 100;
    const priceBusiness = Math.round(priceEconomy * 2.5 / 100) * 100;

    const statuses: ("on-time" | "delayed" | "cancelled")[] = ["on-time", "on-time", "on-time", "on-time", "delayed", "on-time"];

    const amenities = ["Baggage 23kg", "In-flight meal", "USB charging"];
    if (idx % 2 === 0) amenities.push("Wi-Fi");
    if (priceBusiness > 0 && idx < 3) amenities.push("Priority boarding");

    const flightNum = `${airline.code}${String(500 + idx + (origin.charCodeAt(0) % 20)).padStart(4, "0")}`;

    flights.push({
      id: `${origin}-${destination}-${dateStr}-${idx}`,
      flightNumber: flightNum,
      airline: airline.name,
      airlineCode: airline.code,
      airlineLogo: airline.logo,
      origin,
      destination,
      originCity: originAirport.city,
      destinationCity: destAirport.city,
      departureTime: depDate.toISOString(),
      arrivalTime: arrivalDate.toISOString(),
      duration: config.duration,
      stops: 0,
      stopDetails: [],
      aircraft,
      priceEconomy,
      priceBusiness,
      seatsAvailableEconomy: Math.floor(Math.random() * 60) + 10,
      seatsAvailableBusiness: Math.floor(Math.random() * 8) + 2,
      amenities,
      status: statuses[idx],
      seats: generateSeats(),
    });
  });

  return flights;
}
