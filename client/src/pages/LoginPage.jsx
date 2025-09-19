import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include", 
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
        navigate("/leads");
      } else {
        alert(data.message || "Error logging in");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen w-screen"
      style={{ background: "linear-gradient(135deg, #008080, #00ffff)" }}
    >
      <div className="bg-gray-900/80 p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg text-md font-semibold transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
