import { Router, type IRouter } from "express";
import { AIRPORTS } from "./data/airports.js";

const router: IRouter = Router();

router.get("/airports", (_req, res) => {
  res.json(AIRPORTS);
});

export default router;
