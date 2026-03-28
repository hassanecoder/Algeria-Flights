import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import airportsRouter from "./airports.js";
import flightsRouter from "./flights.js";
import bookingsRouter from "./bookings.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(airportsRouter);
router.use(flightsRouter);
router.use(bookingsRouter);

export default router;
