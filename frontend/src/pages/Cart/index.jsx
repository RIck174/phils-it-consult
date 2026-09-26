import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  FiMinus,
  FiPlus,
  FiTrash2,
  FiShoppingBag,
  FiArrowLeft,
} from "react-icons/fi";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="px-6 py-20 max-w-3xl mx-auto text-center">
        <FiShoppingBag className="mx-auto text-gray-300" size={56} />
        <h1 className="text-2xl font-semibold text-gray-900 mt-4">
          Your cart is empty
        </h1>
        <p className="text-gray-500 mt-1">
          Browse the shop and add something you like.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-[#0a355f] text-white text-sm font-semibold px-6 py-3 rounded-full mt-6 hover:bg-[#0d4680] transition"
        >
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
      >
        <FiArrowLeft size={16} /> Back to Shop
      </Link>
      <h1 className="text-3xl font-semibold text-gray-900 mt-4">Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10 mt-8">
        {/* items */}
        <div className="lg:col-span-2">
          <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 text-xs font-semibold uppercase tracking-wide text-gray-400 pb-3 border-b">
            <span>Product</span>
            <span>Quantity</span>
            <span>Price</span>
            <span>Subtotal</span>
          </div>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid sm:grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center py-5 border-b"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-16 h-16 object-contain bg-gray-50 rounded-lg p-1 shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 line-clamp-2">
                    {item.name}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    <FiTrash2 size={12} /> Remove
                  </button>
                </div>
              </div>

              <div className="flex items-center border rounded-lg w-fit">
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="px-2.5 py-1.5 hover:bg-gray-100"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      Math.min(
                        item.stock_quantity ?? Infinity,
                        item.quantity + 1,
                      ),
                    )
                  }
                  className="px-2.5 py-1.5 hover:bg-gray-100"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <p className="text-sm text-gray-700">GH₵ {item.price}</p>

              <p className="text-sm font-semibold text-gray-900">
                GH₵ {(Number(item.price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* summary */}
        <div className="border rounded-2xl p-6 h-fit">
          <h2 className="font-semibold text-gray-900">Cart Summary</h2>

          <div className="flex items-center justify-between text-sm text-gray-600 mt-4">
            <span>Subtotal</span>
            <span>GH₵ {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between font-semibold text-gray-900 mt-3 pt-3 border-t">
            <span>Total</span>
            <span>GH₵ {subtotal.toFixed(2)}</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-[#0a355f] text-white text-sm font-semibold py-3 rounded-full mt-6 hover:bg-[#0d4680] transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
