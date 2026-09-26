import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  FiSmartphone,
  FiMonitor,
  FiHeadphones,
  FiWatch,
  FiCamera,
  FiTablet,
  FiPrinter,
  FiCpu,
  FiWifi,
  FiBox,
  FiGrid,
  FiBatteryCharging,
  FiMousePointer,
  FiCommand,
  FiChevronRight,
} from "react-icons/fi";
import api from "../../utils/api";
import ProductCard from "../../components/ProductCard";

// pick an icon from the category name, fallback is a box
const iconFor = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("phone") || n.includes("mobile")) return FiSmartphone;
  if (n.includes("laptop") || n.includes("computer") || n.includes("pc"))
    return FiMonitor;
  if (n.includes("audio") || n.includes("headphone") || n.includes("speaker"))
    return FiHeadphones;
  if (n.includes("watch")) return FiWatch;
  if (n.includes("camera")) return FiCamera;
  if (n.includes("tablet")) return FiTablet;
  if (n.includes("printer")) return FiPrinter;
  if (n.includes("network") || n.includes("router")) return FiWifi;
  if (n.includes("component") || n.includes("processor")) return FiCpu;
  if (n.includes("power")) return FiBatteryCharging;
  if (n.includes("mouse")) return FiMousePointer;
  if (n.includes("keyboard")) return FiCommand;
  return FiBox;
};

const sorts = [
  { key: "default", label: "Default" },
  { key: "newest", label: "Newest" },
  { key: "low", label: "Price: Low to High" },
  { key: "high", label: "Price: High to Low" },
];

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("q") || "";
  const catParam = searchParams.get("cat");
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setSelectedCat(catParam ? Number(catParam) : null);
    setSelectedBrand(null);
  }, [catParam]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.log("Failed to load shop data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (id) => {
    setSelectedCat(id === selectedCat ? null : id);
    setSelectedBrand(null); // brands belong to a category, so reset
  };

  const clearFilters = () => {
    setSearchParams({});
    setSelectedCat(null);
    setSelectedBrand(null);
    setSort("default");
  };

  const categoryProducts = products.filter(
    (p) => selectedCat === null || p.category_id === selectedCat,
  );

  const brands = [
    ...new Set(categoryProducts.map((p) => p.brand).filter(Boolean)),
  ].sort();

  const q = search.trim().toLowerCase();

  const visibleProducts = categoryProducts
    .filter((p) => !selectedBrand || p.brand === selectedBrand)
    .filter(
      (p) =>
        !q ||
        p.name?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q),
    )
    .sort((a, b) => {
      if (sort === "low") return Number(a.price) - Number(b.price);
      if (sort === "high") return Number(b.price) - Number(a.price);
      if (sort === "newest")
        return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });

  const countFor = (id) => products.filter((p) => p.category_id === id).length;

  const activeTitle =
    categories.find((c) => c.id === selectedCat)?.name || "All Products";

  const sidebarItem = (active) =>
    `flex items-center gap-4 px-6 py-5 text-base border-l-4 transition shrink-0 whitespace-nowrap ${
      active
        ? "border-[#0a355f] bg-blue-50 text-[#0a355f] font-semibold"
        : "border-transparent text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="px-6 py-8 flex flex-col md:flex-row gap-8">
      {/* sidebar */}
      <aside className="md:w-72 shrink-0">
        <div className="md:sticky md:top-6 flex md:flex-col overflow-x-auto md:overflow-hidden border border-gray-200 rounded-2xl bg-white">
          <button
            onClick={() => handleCategoryClick(null)}
            className={sidebarItem(selectedCat === null)}
          >
            <FiGrid size={22} />
            <span className="flex-1 text-left">All Products</span>
            <span className="text-sm text-gray-400">{products.length}</span>
          </button>

          {categories.map((cat) => {
            const Icon = iconFor(cat.name);
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className={sidebarItem(selectedCat === cat.id)}
              >
                <Icon size={22} />
                <span className="flex-1 text-left">{cat.name}</span>
                <span className="text-sm text-gray-400">
                  {countFor(cat.id)}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 min-w-0">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-4">
          <Link to="/" className="hover:text-gray-900">
            Home
          </Link>
          <FiChevronRight size={14} />
          {selectedCat === null ? (
            <span className="font-semibold text-gray-800">Shop</span>
          ) : (
            <>
              <button onClick={clearFilters} className="hover:text-gray-900">
                Shop
              </button>
              <FiChevronRight size={14} />
              <span className="font-semibold text-gray-800">{activeTitle}</span>
            </>
          )}
        </nav>
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              {activeTitle}
            </h2>
            {search && (
              <p className="text-sm text-gray-500 mt-1">
                Results for "{search}"
              </p>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {visibleProducts.length} products
          </p>
        </div>

        {/* brand chips, empty when the category has no brands */}
        {brands.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => setSelectedBrand(null)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                selectedBrand === null
                  ? "bg-[#0a355f] text-white border-[#0a355f]"
                  : "bg-white text-gray-600 hover:border-gray-400"
              }`}
            >
              All Brands
            </button>
            {brands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  setSelectedBrand(brand === selectedBrand ? null : brand)
                }
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
                  selectedBrand === brand
                    ? "bg-[#0a355f] text-white border-[#0a355f]"
                    : "bg-white text-gray-600 hover:border-gray-400"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        )}

        {/* sort tabs */}
        <div className="flex gap-6 border-b mt-6 overflow-x-auto">
          {sorts.map((s) => (
            <button
              key={s.key}
              onClick={() => setSort(s.key)}
              className={`pb-3 text-sm whitespace-nowrap transition ${
                sort === s.key
                  ? "text-[#0a355f] font-semibold border-b-2 border-[#0a355f] -mb-px"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* products */}
        {loading ? (
          <p className="text-center text-gray-500 py-20">Loading products...</p>
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600">No products match your filters.</p>
            <button
              onClick={clearFilters}
              className="mt-3 text-sm font-semibold text-[#0a355f] underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Shop;
