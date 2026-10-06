import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const outOfStock = product.stock_quantity <= 0;

  const oldPrice = Number(product.old_price);
  const hasDiscount = oldPrice > Number(product.price);
  const discount = hasDiscount
    ? Math.round((1 - Number(product.price) / oldPrice) * 100)
    : 0;

  const badge = hasDiscount
    ? `-${discount}%`
    : product.is_featured
      ? "Featured"
      : null;

  const handleAdd = () => {
    addToCart({ ...product, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group relative border rounded-xl bg-white p-4 hover:shadow-lg transition flex flex-col">
      <Link to={`/shop/${product.id}`} className="block">
        <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-3">
          {badge && (
            <span className="absolute top-2 left-2 z-10 text-[10px] font-bold uppercase tracking-wide bg-blue-600 text-white px-2.5 py-1 rounded-full">
              {badge}
            </span>
          )}
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-44 object-contain p-3 group-hover:scale-105 transition duration-300"
          />
        </div>

        {product.brand && (
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            {product.brand}
          </p>
        )}
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2 min-h-10">
          {product.name}
        </h3>
      </Link>

      <div className="flex items-baseline gap-2 mt-2">
        <span className="text-lg font-bold text-gray-900">
          GH₵ {product.price}
        </span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">
            GH₵ {product.old_price}
          </span>
        )}
      </div>

      <div className="relative mt-auto pt-3">
        {added && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full whitespace-nowrap bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg animate-toast-pop">
            {product.name} added to cart
          </div>
        )}
        <button
          onClick={handleAdd}
          disabled={outOfStock}
          className="w-full flex items-center justify-center gap-2 bg-white text-black border border-black py-2.5 text-sm font-semibold rounded-full hover:bg-black hover:text-white active:scale-95 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed"
        >
          {!outOfStock && <FiShoppingCart size={16} />}
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
