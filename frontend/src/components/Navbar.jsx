import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/PHILS CONSULT.jpg.jpeg";
import api from "../utils/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [catId, setCatId] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (catId) params.set("cat", catId);
    navigate(`/shop?${params.toString()}`);
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.05)] sticky top-0 z-40">
      <div className="max-w-[1536px] mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-8 lg:px-10 py-3">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src={logo}
            alt="PHILS-IT CONSULT"
            className="h-12 w-12 sm:h-13 sm:w-13 object-cover rounded-full border border-blue-100 shadow-xs group-hover:scale-105 transition-transform"
          />
          <div className="font-extrabold leading-tight">
            <span className="text-blue-700 text-base sm:text-lg tracking-tight block">
              PHIL'S-IT
            </span>
            <span className="text-slate-800 text-xs sm:text-sm tracking-wider uppercase font-bold block">
              CONSULT
            </span>
          </div>
        </Link>

        {/* Support Phone - Directly on Navbar without rounded background */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 px-2">
          <span className="text-xl">📞</span>
          <div className="leading-tight">
            <p className="text-xs text-slate-500 font-medium">Call Us on</p>
            <p className="font-bold text-slate-900 text-sm tracking-tight">
              030 397 2421
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex-1 max-w-xl flex items-center border border-slate-200 focus-within:border-blue-500 rounded-lg overflow-hidden bg-white transition"
        >
          <select
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            className="py-1.5 px-2.5 border-r border-slate-200 outline-none text-xs bg-slate-50 text-slate-700 font-medium cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search computers, services, parts..."
            className="py-1.5 px-3 flex-1 text-xs text-slate-900 outline-none placeholder-slate-400"
          />
          <button
            type="submit"
            aria-label="Search"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 self-stretch flex items-center justify-center transition cursor-pointer"
          >
            <FiSearch size={14} />
          </button>
        </form>

        {/* User Account & Cart */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <Link
            to="/auth"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-50 transition"
          >
            <FiUser size={16} className="text-slate-500" />
            <span className="hidden sm:inline">
              {user ? user.name || "Account" : "Sign In"}
            </span>
          </Link>

          <Link
            to="/cart"
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 transition"
            aria-label="Cart"
          >
            <FiShoppingCart size={16} />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
