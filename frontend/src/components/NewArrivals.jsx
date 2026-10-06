import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiCheck,
} from "react-icons/fi";
import noImage from "../assets/Lap.jpg";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

const isNewProduct = (createdAt) => {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
  return days <= 14;
};

const NewArrivals = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [slides, setSlides] = useState([]);
  const [dot, setDot] = useState(0);
  const [added, setAdded] = useState({});

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
    api.get("/featured-slides").then((res) => setSlides(res.data));
  }, []);

  const handleAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock_quantity <= 0) return;
    addToCart({ ...product, quantity: 1 });
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(
      () => setAdded((prev) => ({ ...prev, [product.id]: false })),
      1500,
    );
  };

  if (products.length === 0 || slides.length === 0) return null;

  const sorted = [...products].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at),
  );
  const gridItems = sorted.slice(0, 4);
  const active = slides[dot] || slides[0];

  return (
    <div className="py-2">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            New Arrivals
          </h2>
          <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-1.5"></div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight size={14} />
          </Link>
          {slides.length > 1 && (
            <>
              <button
                onClick={() =>
                  setDot((d) => (d - 1 + slides.length) % slides.length)
                }
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <FiChevronLeft size={12} />
              </button>
              <button
                onClick={() => setDot((d) => (d + 1) % slides.length)}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                <FiChevronRight size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 relative rounded-xl overflow-hidden p-6 flex flex-col justify-between min-h-[220px]">
          <video
            key={active.video_url}
            src={active.video_url}
            autoPlay
            loop
            muted
            playsInline
            disablePictureInPicture
            controlsList="nodownload noplaybackrate nofullscreen"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1440] via-[#1a1440]/80 to-transparent"></div>

          <Link
            to={`/shop/${active.product_id}`}
            className="relative z-10 block"
          >
            {active.badge && (
              <span className="inline-block bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded mb-3">
                {active.badge}
              </span>
            )}
            <h3 className="text-white text-xl font-bold leading-snug line-clamp-2">
              {active.name}
            </h3>
            {active.brand && (
              <p className="text-gray-400 text-[10px] uppercase tracking-wide mt-1">
                {active.brand}
              </p>
            )}
            {active.description && (
              <p className="text-gray-300 text-xs mt-2 line-clamp-2 max-w-[85%]">
                {active.description}
              </p>
            )}
            <p className="text-white text-lg font-bold mt-3">
              GH₵ {Number(active.price).toFixed(2)}
            </p>
            <span className="inline-flex items-center gap-1 text-white text-sm font-semibold mt-3">
              Explore Now <FiArrowRight size={14} />
            </span>
          </Link>

          {slides.length > 1 && (
            <div className="relative z-10 flex gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setDot(i)}
                  className={`w-1.5 h-1.5 rounded-full ${dot === i ? "bg-white" : "bg-white/30"}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 items-stretch">
          {gridItems.map((item) => (
            <Link
              to={`/shop/${item.id}`}
              key={item.id}
              className="relative border border-gray-200 rounded-xl p-3 hover:shadow-md transition flex flex-col h-full bg-white"
            >
              {isNewProduct(item.created_at) && (
                <span className="absolute top-2 left-2 z-10 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-xs">
                  NEW
                </span>
              )}
              <div className="bg-gray-50 rounded-lg mb-2 flex items-center justify-center h-28 shrink-0 overflow-hidden">
                <img
                  src={item.image_url || noImage}
                  onError={(e) => (e.target.src = noImage)}
                  alt={item.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[2rem]">
                {item.name}
              </h3>
              <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 min-h-[2rem]">
                {item.description || " "}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                <p className="text-sm font-bold text-gray-900">
                  GH₵ {Number(item.price).toFixed(2)}
                </p>
                <button
                  onClick={(e) => handleAdd(e, item)}
                  disabled={item.stock_quantity <= 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                >
                  {added[item.id] ? (
                    <FiCheck size={14} />
                  ) : (
                    <FiShoppingCart size={14} />
                  )}
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
