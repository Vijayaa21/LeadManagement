import { useState } from "react";
import api from "../api/axios";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: "",
    lead_value: "",
    last_activity_at: "",
    is_qualified: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/leads", formData);
      alert("Lead created successfully!");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        state: "",
        source: "website",
        status: "new",
        score: "",
        lead_value: "",
        last_activity_at: "",
        is_qualified: false,
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create lead");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        maxWidth: "600px",
      }}
    >
      <input name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
      <input name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
      <input name="company" placeholder="Company" value={formData.company} onChange={handleChange} />
      <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
      <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />

      <select name="source" value={formData.source} onChange={handleChange}>
        <option value="website">Website</option>
        <option value="facebook_ads">Facebook Ads</option>
        <option value="google_ads">Google Ads</option>
        <option value="referral">Referral</option>
        <option value="events">Events</option>
        <option value="other">Other</option>
      </select>

      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="lost">Lost</option>
        <option value="won">Won</option>
      </select>

      <input name="score" placeholder="Score" type="number" value={formData.score} onChange={handleChange} />
      <input name="lead_value" placeholder="Lead Value" type="number" value={formData.lead_value} onChange={handleChange} />
      <input
        name="last_activity_at"
        type="datetime-local"
        value={formData.last_activity_at}
        onChange={handleChange}
      />

      <label style={{ gridColumn: "span 2" }}>
        <input type="checkbox" name="is_qualified" checked={formData.is_qualified} onChange={handleChange} /> Qualified
      </label>

      <button type="submit" style={{ gridColumn: "span 2" }}>
        Save Lead
      </button>
    </form>
  );
}
