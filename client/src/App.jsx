import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/SignupPage";
import LeadsPage from "./pages/LeadPage";
import LeadFormPage from "./pages/LeadForm";
import LeadEdit from "./pages/LeadEdit";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-start text-white"
  style={{
    height: "100vh",
    width: "100vw",
    padding: "20px",
    background: "linear-gradient(135deg, #008080, #00ffff)",
  }}
  > 
    <Router>
      <nav style={{ display: "flex", gap: "15px", padding: "10px", background: "#eee" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
        <Link to="/leads">Leads</Link>
        <Link to="/leads/new">New Lead</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/leads/new" element={<LeadFormPage />} />
        <Route path="/leads/:id/edit" element={<LeadEdit />} />
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
    </div>
  );
}
