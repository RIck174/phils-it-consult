import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FiMinus,
  FiPlus,
  FiTruck,
  FiCreditCard,
  FiHeadphones,
  FiChevronRight,
} from "react-icons/fi";
import api from "../../utils/api";
import { useCart } from "../../context/CartContext";
import ProductCard from "../../components/ProductCard";

// edit these to match what you really offer
const perks = [
  {
    icon: FiTruck,
    title: "Fast Delivery",
    text: "Delivery available in Accra",
  },
  {
    icon: FiCreditCard,
    title: "Secure Payments",
    text: "Safe and easy ways to pay",
  },
  { icon: FiHeadphones, title: "Support", text: "Call us on 030 397 2421" },
];

const tabs = [
  { key: "description", label: "Description" },
  { key: "info", label: "Additional Information" },
  { key: "reviews", label: "Reviews" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const [prodRes, catRes, allRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
          api.get("/products"),
        ]);
        const p = prodRes.data;
        setProduct(p);
        setCategory(catRes.data.find((c) => c.id === p.category_id) || null);
        setRelated(
          allRes.data
            .filter((x) => x.category_id === p.category_id && x.id !== p.id)
            .slice(0, 4),
        );
        setQuantity(1);
        setTab("description");
        window.scrollTo(0, 0);
      } catch (error) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 py-32">Loading...</p>;
  }

  if (notFound || !product) {
    return (
      <div className="text-center py-32">
        <p className="text-gray-600">Product not found.</p>
        <Link
          to="/shop"
          className="text-sm font-semibold text-[#0a355f] underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  const stock = product.stock_quantity;
  const outOfStock = stock <= 0;

  const oldPrice = Number(product.old_price);
  const hasDiscount = oldPrice > Number(product.price);

  const handleAdd = () => addToCart({ ...product, quantity });
  const handleBuyNow = () => {
    handleAdd();
    navigate("/cart");
  };

  const details = [
    ["Brand", product.brand],
    ["Category", category?.name],
    ["Availability", outOfStock ? "Out of stock" : `${stock} in stock`],
    ["Added on", new Date(product.created_at).toLocaleDateString()],
  ].filter(([, value]) => value);

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto">
      {/* breadcrumb */}
      <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-gray-900">
          Home
        </Link>
        <FiChevronRight size={14} />
        <Link to="/shop" className="hover:text-gray-900">
          Shop
        </Link>
        {category && (
          <>
            <FiChevronRight size={14} />
            <Link
              to={`/shop?cat=${category.id}`}
              className="hover:text-gray-900"
            >
              {category.name}
            </Link>
          </>
        )}
        <FiChevronRight size={14} />
        <span className="font-semibold text-gray-800">{product.name}</span>
      </nav>

      {/* top: image + info */}
      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div className="border rounded-2xl bg-white p-6 flex items-center justify-center">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-80 md:h-105 object-contain"
          />
        </div>

        <div>
          {category && <p className="text-sm text-gray-500">{category.name}</p>}
          <h1 className="text-3xl font-bold text-gray-900 mt-1">
            {product.name}
          </h1>
          {product.brand && (
            <p className="text-sm text-gray-500 mt-1">
              Brand: <span className="font-semibold">{product.brand}</span>
            </p>
          )}
          <p className="text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-bold text-gray-900">
              GH₵ {product.price}
            </span>
            {hasDiscount && (
              <span className="text-lg text-gray-400 line-through">
                GH₵ {product.old_price}
              </span>
            )}
          </div>

          {/* quantity + stock */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiMinus size={16} />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                disabled={outOfStock}
                className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40"
              >
                <FiPlus size={16} />
              </button>
            </div>

            {outOfStock ? (
              <span className="text-sm text-red-600">Out of stock</span>
            ) : stock <= 10 ? (
              <span className="text-sm text-amber-600">
                Only {stock} left, hurry up!
              </span>
            ) : (
              <span className="text-sm text-emerald-600">In stock</span>
            )}
          </div>

          {/* buttons */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="bg-[#0a355f] text-white text-sm font-semibold px-8 py-3 rounded-lg hover:bg-[#0d4680] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Buy Now
            </button>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className="border-2 border-[#0a355f] text-[#0a355f] text-sm font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 transition disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>

          {/* perks */}
          <div className="border-t mt-8 pt-5 space-y-4">
            {perks.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <Icon className="text-[#0a355f] mt-0.5 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{title}</p>
                  <p className="text-xs text-gray-500">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* tabs */}
      <div className="mt-14 border-t pt-8">
        <div className="flex justify-center gap-8 border-b">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-3 text-sm md:text-base transition ${
                tab === t.key
                  ? "text-[#0a355f] font-semibold border-b-2 border-[#0a355f] -mb-px"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === "description" && (
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              {product.description || "No description yet."}
            </p>
          )}

          {tab === "info" && (
            <div className="rounded-xl overflow-hidden border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#0a355f] text-white text-left">
                    <th className="px-4 py-3 font-semibold">Specification</th>
                    <th className="px-4 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {details.map(([label, value], i) => (
                    <tr
                      key={label}
                      className={i % 2 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3 text-gray-600 w-1/3">{label}</td>
                      <td className="px-4 py-3 text-gray-900">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "reviews" && (
            <p className="text-center text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>

      {/* related */}
      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-3">
            Related Products
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
