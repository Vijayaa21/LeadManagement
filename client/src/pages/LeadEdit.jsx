import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios"; // Axios instance with baseURL

export default function LeadEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState({
    first_name: "",
    last_name: "",
    email: "",
    company: "",
    status: "",
    score: "",
    lead_value: "",
  });

  // Fetch lead details
  const fetchLead = async () => {
    try {
      const res = await api.get(`/api/leads/${id}`);
      if (res.data) setLead(res.data);
    } catch (err) {
      console.error("Error fetching lead:", err);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  // Update lead
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/api/leads/${id}`, {lead});

      if (res.status === 200) {
        alert("Lead updated successfully");
        navigate("/leads");
      } else {
        alert(res.data?.message || "Error updating lead");
      }
    } catch (err) {
      console.error("Error updating lead:", err);
      alert("Something went wrong while updating the lead");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
      <h2 className="text-2xl mb-4">Edit Lead</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full max-w-md"
      >
        {Object.keys(lead).map((key) => (
          <input
            key={key}
            type="text"
            name={key}
            value={lead[key]}
            onChange={handleChange}
            placeholder={key.replace("_", " ").toUpperCase()}
            className="px-3 py-2 rounded text-black"
          />
        ))}
        <button
          type="submit"
          className="bg-blue-600 py-2 rounded hover:bg-blue-700 text-white mt-3"
        >
          Update Lead
        </button>
      </form>
    </div>
  );
}
