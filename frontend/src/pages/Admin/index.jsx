import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Overview from "./Overview";
import ProductsTab from "./ProductsTab";
import CategoriesTab from "./CategoriesTab";
import RequestsTab from "./RequestsTab";
import logo from "../../assets/PHILS CONSULT.jpg.jpeg";

const groups = [
  {
    label: null,
    tabs: [{ key: "overview", label: "Overview" }],
  },
  {
    label: "Store",
    tabs: [
      { key: "products", label: "Products" },
      { key: "categories", label: "Categories" },
      { key: "orders", label: "Orders" },
    ],
  },
  {
    label: "Services",
    tabs: [{ key: "requests", label: "Service Requests" }],
  },
];

const allTabs = groups.flatMap((g) => g.tabs);

const Soon = ({ name }) => (
  <p className="text-sm text-gray-500">{name} section is not built yet.</p>
);

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const param = searchParams.get("tab");
  const active = allTabs.find((t) => t.key === param) || allTabs[0];

  const views = {
    overview: <Overview />,
    products: <ProductsTab />,
    categories: <CategoriesTab />,
    orders: <Soon name="Orders" />,
    requests: <RequestsTab />,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-[#0a355f] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Phil's-IT Consult"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover border border-white/20"
            />
            <div className="leading-tight">
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                Phil's-IT Consult
              </p>
              <h1 className="text-lg sm:text-2xl font-semibold text-white">
                Admin Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <p className="hidden lg:block text-blue-200">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <Link
              to="/"
              className="hidden sm:inline-block border border-white/30 text-white px-4 py-2 rounded-md hover:bg-white/10 transition"
            >
              View store
            </Link>
            <button
              onClick={handleLogout}
              className="text-blue-100 hover:text-white transition"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
        {/* sidebar on desktop, scrolling row on mobile */}
        <aside className="md:w-52 shrink-0">
          <nav className="md:sticky md:top-24 flex md:flex-col gap-4 md:gap-6 overflow-x-auto md:overflow-visible">
            {groups.map((group, i) => (
              <div key={i} className="flex md:flex-col gap-1 shrink-0">
                {group.label && (
                  <p className="hidden md:block px-3 pb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
                    {group.label}
                  </p>
                )}
                {group.tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setSearchParams({ tab: tab.key })}
                    className={`px-3 py-2 rounded-md text-sm text-left whitespace-nowrap transition ${
                      active.key === tab.key
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* content */}
        <main className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-gray-900">
            {active.label}
          </h1>
          <div className="mt-6">{views[active.key]}</div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
