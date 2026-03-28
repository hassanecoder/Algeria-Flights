import { Router, type IRouter } from "express";
import { generateFlights } from "./data/flights.js";

const router: IRouter = Router();

router.get("/flights/search", (req, res) => {
  const { origin, destination, departureDate, returnDate, passengers = "1", tripType = "one-way" } = req.query as Record<string, string>;

  if (!origin || !destination || !departureDate) {
    res.status(400).json({ error: "Bad Request", message: "origin, destination, and departureDate are required" });
    return;
  }

  const outbound = generateFlights(origin.toUpperCase(), destination.toUpperCase(), departureDate);

  let returnFlights: typeof outbound = [];
  if (tripType === "round-trip" && returnDate) {
    returnFlights = generateFlights(destination.toUpperCase(), origin.toUpperCase(), returnDate);
  }

  res.json({
    outbound,
    return: returnFlights,
    searchParams: {
      origin: origin.toUpperCase(),
      destination: destination.toUpperCase(),
      departureDate,
      returnDate: returnDate || null,
      passengers: parseInt(passengers, 10),
      tripType,
    },
  });
});

router.get("/flights/:flightId", (req, res) => {
  const { flightId } = req.params;

  // Parse the id: origin-destination-date-idx
  const parts = flightId.split("-");
  if (parts.length < 4) {
    res.status(404).json({ error: "Not Found", message: "Flight not found" });
    return;
  }

  const origin = parts[0];
  const destination = parts[1];
  const dateStr = parts[2];
  const idx = parseInt(parts[3], 10);

  const flights = generateFlights(origin, destination, dateStr);
  const flight = flights[idx];

  if (!flight) {
    res.status(404).json({ error: "Not Found", message: "Flight not found" });
    return;
  }

  res.json(flight);
});

export default router;
