import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import { buildLeadFilter } from "../lib/leadFilter.js";

export const createLead = async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, user: req.userId });
    await lead.save();

    await User.findByIdAndUpdate(req.userId, { $push: { leads: lead._id } });

    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const query = buildLeadFilter(req.query, req.userId);

    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(Math.min(parseInt(limit), 100))
      .sort({ created_at: -1 });

    const count = await Lead.countDocuments(query);

    res.status(200).json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: leads,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.userId });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await User.findByIdAndUpdate(req.userId, { $pull: { leads: lead._id } });

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
