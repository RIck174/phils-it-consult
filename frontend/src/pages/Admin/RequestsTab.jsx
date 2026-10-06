import { useState, useEffect } from "react";
import api from "../../utils/api";

const statuses = [
  { key: "pending", label: "Pending" },
  { key: "in progress", label: "In progress" },
  { key: "completed", label: "Completed" },
];

const RequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/service_requests");
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        setRequests(sorted);
      } catch (err) {
        setError("Could not load requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStatus = async (request, status) => {
    setError("");
    try {
      await api.put(`/service_requests/${request.id}`, { status });
      setRequests((prev) =>
        prev.map((r) => (r.id === request.id ? { ...r, status } : r)),
      );
    } catch (err) {
      setError("Could not update the status.");
    }
  };

  const countFor = (key) =>
    key === "all"
      ? requests.length
      : requests.filter((r) => r.status === key).length;

  const visible =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const filters = [{ key: "all", label: "All" }, ...statuses];

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex gap-6 border-b overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`pb-3 text-sm whitespace-nowrap transition ${
              filter === f.key
                ? "text-blue-700 font-medium border-b-2 border-blue-600 -mb-px"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {f.label}{" "}
            <span className="text-gray-400 font-normal">{countFor(f.key)}</span>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      {visible.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-16">
          {requests.length === 0
            ? "No requests yet."
            : "No requests in this group."}
        </p>
      ) : (
        <div className="space-y-4 mt-6">
          {visible.map((r) => (
            <div key={r.id} className="bg-white border rounded-lg p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {r.company_name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {r.service_type} ·{" "}
                    {new Date(r.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <select
                  value={r.status}
                  onChange={(e) => handleStatus(r, e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm text-gray-700 outline-none focus:border-blue-500 bg-white"
                >
                  {statuses.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-sm text-gray-700 mt-4 whitespace-pre-line">
                {r.message}
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 pt-4 border-t text-sm text-gray-600">
                <span>{r.contact_person}</span>
                <a
                  href={`mailto:${r.email}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {r.email}
                </a>
                <a
                  href={`tel:${r.phone}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {r.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsTab;
