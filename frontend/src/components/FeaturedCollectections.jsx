import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import phone from "../assets/apple.jpg";
import game from "../assets/PC portable Gamer.jpg";
import campus from "../assets/newAirpods.jpg";
import home from "../assets/Tab.jpg";

const collections = [
  {
    title: "Apple Collection",
    subtitle: null,
    bg: "bg-gray-100",
    image: phone,
  },
  {
    title: "Gaming Zone",
    subtitle: "Level Up Your Game",
    bg: "bg-gray-50",
    image: game,
  },
  {
    title: "Back to Campus",
    subtitle: "Laptops, Storage & More",
    bg: "bg-indigo-50",
    image: campus,
  },
  {
    title: "Work From Home",
    subtitle: "Essentials for Productivity",
    bg: "bg-gray-50",
    image: home,
  },
];

const FeaturedCollections = () => {
  return (
    <div className="px-6 py-8">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Featured Collections
        </h2>
        <div className="flex items-center gap-3">
          <a
            href="/shop"
            className="text-sm text-gray-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight size={14} />
          </a>
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700">
            <FiChevronLeft size={12} />
          </button>
          <button className="w-6 h-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700">
            <FiChevronRight size={12} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {collections.map((item) => (
          <div
            key={item.title}
            className="relative rounded-xl overflow-hidden p-4 h-24 flex flex-col justify-center bg-white border border-gray-100"
          >
            <div className="relative z-10 max-w-[65%]">
              <h3 className="font-bold text-sm text-gray-900">{item.title}</h3>
              {item.subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>
              )}

              <a
                href="/shop"
                className="text-xs text-violet-600 font-semibold mt-1.5 inline-flex items-center gap-1"
              >
                Explore Now <FiArrowRight size={11} />
              </a>
            </div>

            <img
              src={item.image}
              alt={item.title}
              className="absolute right-2 bottom-0 h-20 w-20 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCollections;
