import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { bookingsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { generateFlights } from "./data/flights.js";

const router: IRouter = Router();

function generateRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6).toUpperCase();
}

function enrichWithFlight(booking: typeof bookingsTable.$inferSelect) {
  const parts = booking.flightId.split("-");
  let flight = null;
  let returnFlight = null;

  if (parts.length >= 4) {
    const flights = generateFlights(parts[0], parts[1], parts[2]);
    flight = flights[parseInt(parts[3], 10)] || null;
  }

  if (booking.returnFlightId) {
    const rParts = booking.returnFlightId.split("-");
    if (rParts.length >= 4) {
      const rFlights = generateFlights(rParts[0], rParts[1], rParts[2]);
      returnFlight = rFlights[parseInt(rParts[3], 10)] || null;
    }
  }

  return {
    ...booking,
    totalAmount: Number(booking.totalAmount),
    flight,
    returnFlight,
  };
}

router.get("/bookings", async (_req, res) => {
  try {
    const bookings = await db.select().from(bookingsTable).orderBy(bookingsTable.createdAt);
    const enriched = bookings.map(enrichWithFlight);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to list bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const { flightId, returnFlightId, cabinClass, passengers, contactEmail, contactPhone, totalAmount } = req.body;

    if (!flightId || !cabinClass || !passengers || !contactEmail || !contactPhone || totalAmount == null) {
      res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
      return;
    }

    const id = generateId();
    const bookingReference = generateRef();

    const [booking] = await db.insert(bookingsTable).values({
      id,
      bookingReference,
      flightId,
      returnFlightId: returnFlightId || null,
      cabinClass,
      passengers,
      contactEmail,
      contactPhone,
      totalAmount: String(totalAmount),
      status: "confirmed",
    }).returning();

    res.status(201).json(enrichWithFlight(booking));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to create booking" });
  }
});

router.get("/bookings/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, bookingId)).limit(1);

    if (!booking) {
      // Try by booking reference
      const [byRef] = await db.select().from(bookingsTable).where(eq(bookingsTable.bookingReference, bookingId)).limit(1);
      if (!byRef) {
        res.status(404).json({ error: "Not Found", message: "Booking not found" });
        return;
      }
      res.json(enrichWithFlight(byRef));
      return;
    }

    res.json(enrichWithFlight(booking));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to get booking" });
  }
});

router.delete("/bookings/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const [booking] = await db.update(bookingsTable)
      .set({ status: "cancelled" })
      .where(eq(bookingsTable.id, bookingId))
      .returning();

    if (!booking) {
      res.status(404).json({ error: "Not Found", message: "Booking not found" });
      return;
    }

    res.json(enrichWithFlight(booking));
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", message: "Failed to cancel booking" });
  }
});

export default router;
