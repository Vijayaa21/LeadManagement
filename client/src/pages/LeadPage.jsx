import LeadTable from "../components/LeadTable";

export default function LeadsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">📋 Leads</h1>
        <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
          <LeadTable />
        </div>
      </div>
    </div>
  );
}
