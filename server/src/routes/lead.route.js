// routes/lead.routes.js
import express from "express";
import { createLead, listLeads, getLeadById, updateLead, deleteLead } from "../controllers/lead.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/", authMiddleware, createLead);
router.get("/", authMiddleware, listLeads);
router.get("/:id", authMiddleware, getLeadById);
router.put("/:id", authMiddleware, updateLead);
router.delete("/:id", authMiddleware, deleteLead);

export default router;
