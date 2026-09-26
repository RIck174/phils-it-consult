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

  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 300, behavior: "smooth" });
    }
  };
  const [products, setProducts] = useState([]);
  const title =
    type === "hotdeals"
      ? "Hot Deals"
      : type === "featured"
        ? "Hot Products"
        : type === "all"
          ? "Gadgets"
          : "Best Selling";

  const displayProducts =
    type === "featured" || type === "hotdeals"
      ? products.slice(0, 7)
      : type === "all"
        ? products.slice(0, 12)
        : products;
  const isCarousel = type === "bestselling";
  const isHotDeals = type === "hotdeals";

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await api.get(`/products`);
      setProducts(response.data);
    };

    fetchProduct();
  }, []);

  const CartButton = ({ product, size = 14, className = "" }) => (
    <button
      onClick={(e) => handleAdd(e, product)}
      disabled={product.stock_quantity <= 0}
      className={`bg-violet-600 hover:bg-violet-700 text-white p-1.5 rounded-md transition disabled:bg-gray-300 disabled:cursor-not-allowed ${className}`}
    >
      {added[product.id] ? (
        <FiCheck size={size} />
      ) : (
        <FiShoppingCart size={size} />
      )}
    </button>
  );

  return (
    <div className="px-6 py-1">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <div className="w-12 h-1 bg-gray-400 rounded-full mt-1"></div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/shop"
            className="text-sm text-gray-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            Explore more <FiArrowRight size={14} />
          </Link>
          {isCarousel && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll(-1)}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                ‹
              </button>
              <button
                onClick={() => scroll(1)}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:text-gray-700"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        className={
          isCarousel
            ? "flex gap-0 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide bg-gradient-to-r from-[#050818] via-[#0d0f2e] to-[#1a1440] rounded-xl p-4"
            : type === "featured" || isHotDeals
              ? "flex gap-3"
              : "grid gap-4 grid-cols-3 sm:grid-cols-4 md:grid-cols-6"
        }
      >
        {displayProducts.map((product, index) => (
          <Link
            to={`/shop/${product.id}`}
            key={product.id}
            className={`relative flex-shrink-0 flex flex-col ${isCarousel ? "snap-start w-52 p-3 border-r border-white/10" : "rounded-lg p-3 pb-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200 border border-gray-200 bg-white"} ${type === "featured" || isHotDeals ? "w-48" : ""}`}
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
            ) : isCarousel ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-extrabold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    BEST SALE
                  </span>
                </div>
                <div className="bg-white/5 rounded-lg mb-2 flex items-center justify-center h-24">
                  <img
                    src={product.image_url || noImage}
                    onError={(e) => (e.target.src = noImage)}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <h3 className="font-semibold text-xs text-white line-clamp-2 min-h-[2rem]">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                  <span className="text-yellow-400">★★★★★</span>
                  <span>(150)</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-white">
                    GH₵{Number(product.price).toFixed(2)}
                  </span>
                  <CartButton product={product} size={12} />
                </div>
              </>
            ) : type === "all" ? (
              <>
                {isNewProduct(product.created_at) && (
                  <span className="absolute top-2 left-2 bg-violet-600 text-white text-[9px] font-bold px-2 py-0.5 rounded">
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
    </div>
  );
};

export default Products;
