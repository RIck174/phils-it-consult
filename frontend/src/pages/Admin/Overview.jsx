import { useState, useEffect } from "react";
import api from "../../utils/api";

const Stat = ({ label, value }) => (
  <div className="bg-white border rounded-lg p-4">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

const Panel = ({ title, children }) => (
  <section className="bg-white border rounded-lg">
    <h2 className="px-4 py-3 text-sm font-semibold text-gray-900 border-b">
      {title}
    </h2>
    {children}
  </section>
);

const Row = ({ name, brand, value }) => (
  <li className="flex items-center justify-between gap-4 px-4 py-3">
    <div className="min-w-0">
      <p className="text-sm text-gray-900 truncate">{name}</p>
      {brand && <p className="text-xs text-gray-500">{brand}</p>}
    </div>
    <span className="text-sm text-gray-600 shrink-0">{value}</span>
  </li>
);

const Overview = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, reqRes, statRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
          api.get("/service_requests").catch(() => ({ data: [] })),
          api.get("/orders/stats").catch(() => ({ data: null })),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setRequests(reqRes.data);
        setStats(statRes.data);
      } catch (error) {
        console.log("Failed to load overview");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  const outOfStock = products.filter((p) => p.stock_quantity <= 0).length;
  const lowStock = products.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= 10,
  ).length;

  const restock = products
    .filter((p) => p.stock_quantity <= 10)
    .sort((a, b) => a.stock_quantity - b.stock_quantity)
    .slice(0, 6);

  const pending = requests.filter((r) => r.status === "pending").length;

  const latest = [...requests]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const recent = [...products]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 6);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
          This month
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Orders" value={stats?.orders ?? 0} />
          <Stat label="Products sold" value={stats?.units ?? 0} />
          <Stat
            label="Revenue"
            value={`GH₵ ${Number(stats?.revenue ?? 0).toFixed(2)}`}
          />
          <Stat label="Pending orders" value={stats?.pending ?? 0} />
        </div>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400 mb-3">
          Store
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Products" value={products.length} />
          <Stat label="Pending requests" value={pending} />
          <Stat label="Low stock" value={lowStock} />
          <Stat label="Out of stock" value={outOfStock} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Latest orders">
          {!stats || stats.recent.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="divide-y">
              {stats.recent.map((o) => (
                <Row
                  key={o.id}
                  name={o.name || "Customer"}
                  brand={`Order #${o.id} · ${o.status}`}
                  value={`GH₵ ${Number(o.total_amount).toFixed(2)}`}
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Latest service requests">
          {latest.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">No requests yet.</p>
          ) : (
            <ul className="divide-y">
              {latest.map((r) => (
                <Row
                  key={r.id}
                  name={r.company_name}
                  brand={r.service_type}
                  value={r.status}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Panel title="Needs restocking">
          {restock.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">
              Everything is well stocked.
            </p>
          ) : (
            <ul className="divide-y">
              {restock.map((p) => (
                <Row
                  key={p.id}
                  name={p.name}
                  brand={p.brand}
                  value={
                    p.stock_quantity <= 0
                      ? "Out of stock"
                      : `${p.stock_quantity} left`
                  }
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recently added">
          {recent.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-500">No products yet.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((p) => (
                <Row
                  key={p.id}
                  name={p.name}
                  brand={p.brand}
                  value={new Date(p.created_at).toLocaleDateString()}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default Overview;
