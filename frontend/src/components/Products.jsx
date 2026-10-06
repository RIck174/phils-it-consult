import { useState, useEffect, useRef } from "react";
import { FiShoppingCart, FiArrowRight, FiCheck } from "react-icons/fi";
import noImage from "../assets/Lap.jpg";
import { Link } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";

const Products = ({ type }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState({}); // { [productId]: true }

  const isNewProduct = (createdAt) => {
    if (!createdAt) return false;
    const daysSinceCreated =
      (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
    return daysSinceCreated <= 14;
  };

  const handleAdd = (e, product) => {
    e.preventDefault(); // stop the surrounding Link from navigating
    e.stopPropagation();
    if (product.stock_quantity <= 0) return;
    addToCart({ ...product, quantity: 1 });
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 240, behavior: "smooth" });
    }
  };
  const [products, setProducts] = useState([]);
  const title =
    type === "hotdeals"
      ? "Hot Deals"
      : type === "featured"
        ? "Hot Products"
        : type === "all"
          ? "Featured Gadgets"
          : "Best Selling";

  const displayProducts =
    type === "bestselling"
      ? products.slice(0, 10)
      : type === "featured" || type === "hotdeals"
        ? products.slice(0, 8)
        : type === "all"
          ? products.slice(0, 12)
          : products;
  const isCarousel = type === "bestselling";
  const isHotDeals = type === "hotdeals";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products`);
        if (response.data && response.data.length > 0) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      }
    };

    fetchProduct();
  }, []);

  // Autoscroll for Best Selling carousel
  useEffect(() => {
    if (!isCarousel || isPaused || displayProducts.length === 0) return;

    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          // Wrapped to end, jump smoothly back to the first product
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
        }
      }
    }, 2800);

    return () => clearInterval(timer);
  }, [isCarousel, isPaused, displayProducts.length]);

  const CartButton = ({ product, size = 14, className = "" }) => (
    <button
      onClick={(e) => handleAdd(e, product)}
      disabled={product.stock_quantity <= 0}
      className={`bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-md transition shadow-xs disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {added[product.id] ? (
        <FiCheck size={size} />
      ) : (
        <FiShoppingCart size={size} />
      )}
    </button>
  );

  return (
    <div className="py-2">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <div className="w-12 h-0.5 bg-blue-600 rounded-full mt-1.5"></div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="text-xs text-slate-600 hover:text-blue-600 font-semibold flex items-center gap-1 transition"
          >
            Explore all <FiArrowRight size={13} />
          </Link>
          {isCarousel && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scroll(-1)}
                className="w-7 h-7 rounded-full border border-slate-300/80 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 text-sm transition cursor-pointer shadow-xs"
                aria-label="Previous"
              >
                ‹
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-7 h-7 rounded-full border border-slate-300/80 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-600 text-sm transition cursor-pointer shadow-xs"
                aria-label="Next"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
      {/* ── BESTSELLING: full-width dark horizontal strip ── */}
      {isCarousel ? (
        <div className="rounded-2xl bg-[#111827] border border-white/5 shadow-xl overflow-hidden">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex overflow-x-auto scrollbar-none snap-x snap-mandatory divide-x divide-white/5"
          >
            {displayProducts.map((product, index) => {
              const oldPrice = Number(product.old_price);
              const hasDiscount = oldPrice > Number(product.price);
              return (
                <Link
                  to={`/shop/${product.id}`}
                  key={product.id}
                  className="snap-start flex-shrink-0 w-56 sm:w-60 flex flex-col p-4 hover:bg-white/5 transition-colors duration-150 group"
                >
                  {/* rank + badge */}
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-3xl font-black text-white/80 leading-none tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="bg-orange-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wide">
                      Best Seller
                    </span>
                  </div>

                  {/* product image */}
                  <div className="flex items-center justify-center h-28 mb-3">
                    <img
                      src={product.image_url || noImage}
                      onError={(e) => (e.target.src = noImage)}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* brand + name */}
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold truncate">
                    {product.brand || "Phil's IT"}
                  </p>
                  <h3 className="text-xs font-semibold text-white line-clamp-2 leading-snug mt-0.5 min-h-[2rem]">
                    {product.name}
                  </h3>

                  {/* pricing */}
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    {hasDiscount && (
                      <span className="text-[11px] text-gray-500 line-through">
                        GH₵{oldPrice.toFixed(2)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-white">
                      GH₵{Number(product.price).toFixed(2)}
                    </span>
                  </div>

                  {/* stars + cart */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-[11px]">★★★★★</span>
                      <span className="text-[10px] text-gray-400">
                        ({product.review_count || 150})
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAdd(e, product)}
                      disabled={product.stock_quantity <= 0}
                      className="w-7 h-7 rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer shrink-0"
                    >
                      {added[product.id] ? (
                        <FiCheck size={13} />
                      ) : (
                        <FiShoppingCart size={13} />
                      )}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className={
          type === "featured" || isHotDeals
            ? "flex gap-3.5 overflow-x-auto pb-2 scrollbar-none"
            : "grid gap-3.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        }
      >
        {displayProducts.map((product, index) => (
          <Link
            to={`/shop/${product.id}`}
            key={product.id}
            className={`relative flex-shrink-0 flex flex-col group rounded-xl p-3 pb-2 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border border-slate-200/80 bg-white ${type === "featured" || isHotDeals ? "w-44 sm:w-48" : ""}`}
          >
            {isHotDeals ? (
              <>
                <div className="bg-gray-50 rounded-lg mb-3 flex items-center justify-center h-32">
                  <img
                    src={product.image_url || noImage}
                    onError={(e) => (e.target.src = noImage)}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">
                  {product.brand}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-base font-bold text-gray-900">
                    GH₵{Number(product.price).toFixed(2)}
                  </span>
                  <CartButton product={product} size={14} />
                </div>
              </>
            ) : type === "all" ? (
              <>
                {isNewProduct(product.created_at) && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
                    NEW
                  </span>
                )}
                <div>
                  <div className="bg-gray-50 rounded-lg mb-2 flex items-center justify-center h-32">
                    <img
                      src={product.image_url || noImage}
                      onError={(e) => (e.target.src = noImage)}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 min-h-[2rem]">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="mt-auto pt-1">
                  <p className="text-sm font-bold text-gray-900">
                    GH₵{Number(product.price).toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                      <span className="text-yellow-400">★★★★</span>
                      <span>({product.review_count || 0})</span>
                    </div>
                    <CartButton product={product} size={14} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-50 rounded-lg mb-3 flex items-center justify-center h-32">
                  <img
                    src={product.image_url || noImage}
                    onError={(e) => (e.target.src = noImage)}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">
                  {product.brand}
                </p>
                <h3 className="font-bold text-base text-gray-900 mt-0.5">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-blue-700 font-bold text-lg">
                    GH₵ {product.price}
                  </span>
                  <button
                    onClick={(e) => handleAdd(e, product)}
                    disabled={product.stock_quantity <= 0}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2.5 rounded-full transition disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    {added[product.id] ? (
                      <FiCheck size={16} />
                    ) : (
                      <FiShoppingCart size={16} />
                    )}
                  </button>
                </div>
              </>
            )}
          </Link>
        ))}
      </div>
      )}
    </div>
  );
};

export default Products;
