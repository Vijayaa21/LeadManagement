import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/leads?page=1&limit=100`,
        { credentials: "include" }
      );
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) setRowData(data.data);
      else setRowData([]);
    } catch (err) {
      console.error(err);
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
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/leads/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) fetchLeads();
    } catch (err) {
      console.error(err);
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
          className="text-3xl font-bold text-white text-center mb-6"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(params.data._id)}
          className="text-3xl font-bold text-white text-center mb-6"
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

        <div className="flex flex-wrap gap-3 w-full md:w-2/3">
          {["email", "company", "city"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field}
              value={filters[field] || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="px-2 py-1 rounded text-black bg-teal-100 placeholder-teal-700"
            />
          ))}

          {["status", "source"].map((field) => {
            const options = [...new Set(rowData.map((lead) => lead[field]))];
            return (
              <select
                key={field}
                value={filters[field] || ""}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="px-2 py-1 rounded text-black bg-cyan-100"
              >
                <option value="">All {field}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            );
          })}

          {["score", "lead_value"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field + " (e.g., 10-50)"}
              value={filters[field] || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="px-2 py-1 rounded text-black bg-teal-100"
            />
          ))}

          {["created_at", "last_activity_at"].map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field + " (YYYY-MM-DD or YYYY-MM-DD - YYYY-MM-DD)"}
              value={filters[field] || ""}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="px-2 py-1 rounded text-black bg-cyan-100"
            />
          ))}

          <select
            value={filters.is_qualified || ""}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, is_qualified: e.target.value }))
            }
            className="px-2 py-1 rounded text-black bg-teal-100"
          >
            <option value="">All Qualified</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
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
            pagination={true}
            paginationPageSize={10}
            domLayout="autoHeight"
          />
        </div>
      )}
    </div>
  );
}
