import express from "express";
import GENAIHEHE from "../controllers/ai.controller.js";

const aiRoutes = express.Router();

aiRoutes.post("/diagnose", GENAIHEHE);

export default aiRoutes;