import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import Lead from "../models/lead.model.js";
import bcrypt from 'bcryptjs';

export const registerUser = async(req, res) =>{
  
  const { username, email, fullName, password } = req.body;
  try {
    console.log(req.body)
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
    if (!email || !fullName || !password || !username) {
      return res.status(400).json({message: 'All fields are required'});
    }

    const user = await User.findOne({email})
    if (user) return res.status(400).json({message: 'User already exists'});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      fullName,
      username,
      password: hashedPassword
    });
    await newUser.save();

    
    generateToken(newUser._id, res);
      
      res.status(201).json({
        _id: newUser._id,
        email: newUser.email,
        fullName: newUser.fullName
      });    

    } catch (error) { 
  return res.status(500).json({ message: error.message });
    
  }
}
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token and set cookie
    generateToken(user._id, res);

    // Send structured JSON response
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const logoutUser = async(req, res) =>{
    try{
      res.cookie("jwt", "", { maxAge: 0 });
      res.status(200).json({message: "User logged out"})
    }
    catch(error){
      res.status(500).json({ message: error.message });
    }
}



export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("leads");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const addLead = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, company, status, score } = req.body;

    const lead = new Lead({
      first_name,
      last_name,
      email,
      phone,
      company,
      status,
      score,
      user: req.user.id
    });

    await lead.save();

    // Push lead reference to user
    await User.findByIdAndUpdate(req.user.id, { $push: { leads: lead._id } });

    res.status(201).json({ message: "Lead created", lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!lead) return res.status(404).json({ message: "Lead not found or unauthorized" });

    res.status(200).json({ message: "Lead updated", lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!lead) return res.status(404).json({ message: "Lead not found or unauthorized" });

    await User.findByIdAndUpdate(req.user.id, { $pull: { leads: lead._id } });

    res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};