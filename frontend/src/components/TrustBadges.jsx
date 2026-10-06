import {
  FiShield,
  FiTruck,
  FiRefreshCw,
  FiHeadphones,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";

const badges = [
  {
    icon: FiShield,
    title: "100% Secure Payment",
    text: "Your transactions are safe and encrypted.",
  },
  {
    icon: FiTruck,
    title: "Fast & Free Delivery",
    text: "Free shipping on all orders over GH₵500.",
  },
  {
    icon: FiRefreshCw,
    title: "30-Day Easy Returns",
    text: "Hassle-free returns and refunds.",
  },
  {
    icon: FiHeadphones,
    title: "24/7 Customer Support",
    text: "We're here to help anytime you need.",
  },
  {
    icon: FiAward,
    title: "Official Warranty",
    text: "Genuine products with official warranty.",
  },
];

const TrustBadges = () => {
  return (
    <div className="px-6 py-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {badges.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="bg-blue-50 rounded-xl p-3 flex flex-col gap-1"
          >
            <Icon size={18} className="text-blue-600" />
            <h3 className="text-xs font-bold text-gray-900 mt-0.5">{title}</h3>
            <p className="text-[11px] text-gray-500 leading-snug">{text}</p>

            <a
              href="#"
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-0.5"
            >
              Learn More <FiArrowRight size={10} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
