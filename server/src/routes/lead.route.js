import express from 'express';
import { createLead, getLeadById, updateLead, deleteLead, listLeads } from '../controllers/lead.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

router.post('/',protectRoute, createLead);
router.get("/", protectRoute, listLeads);
router.get("/:id", protectRoute, getLeadById);
router.put("/:id", protectRoute, updateLead);
router.delete("/:id", protectRoute, deleteLead);

export default router;
