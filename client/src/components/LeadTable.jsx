import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

import api from "../api/axios"; 

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function LeadTable() {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});
  const gridRef = useRef();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      // Use axios instance, which already has baseURL + credentials
      const res = await api.get("/api/leads"); 
      if (Array.isArray(res.data.data)) setRowData(res.data.data);
      else setRowData([]);
    } catch (err) {
      console.error("fetchLeads error:", err.response?.data || err.message);
      setRowData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  const columnDefs = [
    { headerName: "First Name", field: "first_name", sortable: true, filter: true },
    { headerName: "Last Name", field: "last_name", sortable: true, filter: true },
    { headerName: "Email", field: "email", sortable: true, filter: true },
    { headerName: "Company", field: "company", sortable: true, filter: true },
    { headerName: "City", field: "city", sortable: true, filter: true },
    { headerName: "Status", field: "status", filter: true },
    { headerName: "Source", field: "source", filter: true },
    { headerName: "Score", field: "score", sortable: true },
    { headerName: "Lead Value", field: "lead_value", sortable: true },
    { headerName: "Last Activity", field: "last_activity_at", sortable: true },
    { headerName: "Qualified", field: "is_qualified", filter: true },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params) => (
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => navigate(`/leads/${params.data._id}/edit`)}
            className="text-white font-bold"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(params.data._id)}
            className="text-white font-bold"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredRows = rowData.filter((lead) => {
    let matches = true;

    if (searchText) {
      const fullName = `${lead.first_name} ${lead.last_name}`.toLowerCase();
      matches = fullName.includes(searchText.toLowerCase());
    }

    ["email", "company", "city"].forEach((field) => {
      if (filters[field]) {
        matches =
          matches &&
          lead[field]?.toLowerCase().includes(filters[field].toLowerCase());
      }
    });

    ["status", "source"].forEach((field) => {
      if (filters[field]) matches = matches && lead[field] === filters[field];
    });

    ["score", "lead_value"].forEach((field) => {
      if (filters[field]) {
        const val = filters[field];
        if (val.includes("-")) {
          const [min, max] = val.split("-").map(Number);
          matches = matches && lead[field] >= min && lead[field] <= max;
        } else {
          matches = matches && lead[field] === Number(val);
        }
      }
    });

    ["created_at", "last_activity_at"].forEach((field) => {
      if (filters[field]) {
        const val = filters[field];
        const leadDate = new Date(lead[field]);
        if (val.includes("-")) {
          const [start, end] = val.split("-").map((d) => new Date(d.trim()));
          matches = matches && leadDate >= start && leadDate <= end;
        } else {
          const filterDate = new Date(val);
          matches = matches && leadDate.toDateString() === filterDate.toDateString();
        }
      }
    });

    if (filters.is_qualified !== undefined) {
      matches = matches && lead.is_qualified === (filters.is_qualified === "true");
    }

    return matches;
  });

  return (
    <div
      className="flex flex-col items-center justify-start text-white"
      style={{
        height: "100vh",
        width: "100vw",
        padding: "20px",
        background: "linear-gradient(135deg, #008080, #00ffff)",
      }}
    >
      <div className="flex flex-col md:flex-row gap-3 mb-4 w-full max-w-6xl items-center justify-between">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="px-3 py-2 rounded w-full md:w-1/3 text-black bg-cyan-100 placeholder-cyan-700"
        />
      </div>

      {loading ? (
        <p className="text-white text-lg">Loading leads...</p>
      ) : (
        <div
          className="ag-theme-alpine-dark"
          style={{ height: "70vh", width: "95vw", minWidth: "800px" }}
        >
          <AgGridReact
            ref={gridRef}
            rowData={filteredRows}
            columnDefs={columnDefs}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            domLayout="autoHeight"
          />
        </div>
      )}
    </div>
  );
}
