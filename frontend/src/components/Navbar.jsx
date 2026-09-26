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
    <nav>
      <div className="flex items-center gap-6 px-6 py-3 shadow-md bg-white">
        <img
          src={logo}
          alt="PHILS-IT CONSULT"
          className="h-16 rounded-full overflow-hidden"
        />
        <div className="font-semibold italic text-xl leading-tight">
          <p style={{ color: "#1400C8" }}>PHIL'S-IT</p>
          <p>CONSULT</p>
        </div>

        <div className="flex items-center gap-2 text-sm whitespace-nowrap px-11">
          <span>📞</span>
          <div>
            <p className="text-xs text-gray-500">Call Us on</p>
            <p className="font-bold">030 397 2421</p>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex-1 flex items-center border rounded-md overflow-hidden"
        >
          <select
            value={catId}
            onChange={(e) => setCatId(e.target.value)}
            className="py-2 px-3 border-r outline-none text-sm bg-gray-50"
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
            placeholder="Search for products..."
            className="py-2 px-3 flex-1 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 self-stretch"
          >
            <FiSearch size={18} />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <Link to="/auth" className="flex items-center gap-1">
            <FiUser size={24} />
            <span>Account</span>
          </Link>

          <Link to="/cart" className=" relative">
            <FiShoppingCart size={18} />
            <span className="absolute -top-2 -right-2 bg-green-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {cartItems.length}
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
