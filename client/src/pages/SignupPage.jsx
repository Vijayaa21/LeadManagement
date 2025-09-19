import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful!");
        navigate("/login");
      } else {
        alert(data.message || "Error signing up");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div
       className="relative min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(135deg, #008080, #00ffff)" }}
    >
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Username */}
          <div>
            <label className="block text-gray-200 mb-1 text-md">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white text-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-gray-200 mb-1 text-md">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white text-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-200 mb-1 text-md">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white text-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-200 mb-1 text-md">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white text-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-lg text-md font-medium transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}
