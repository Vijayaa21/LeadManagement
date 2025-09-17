import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";

// Create Lead
export const createLead = async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, user: req.user.id });
    await lead.save();

    // Optionally link lead to the user
    await User.findByIdAndUpdate(req.user.id, { $push: { leads: lead._id } });

    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// List Leads with pagination & filters
export const listLeads = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, source, search } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { first_name: new RegExp(search, "i") },
        { last_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { company: new RegExp(search, "i") }
      ];
    }

    const leads = await Lead.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const count = await Lead.countDocuments(query);

    res.status(200).json({
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit),
      data: leads
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single lead
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user.id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update lead
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.status(200).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete lead
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });

    await User.findByIdAndUpdate(req.user.id, { $pull: { leads: lead._id } });

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
