import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const items = [
  {
    src: "/videos/Hailuo_Video_A modern laptop with sleek met_549445447692648449.mp4",
    label: "Laptop",
    title: "Laptop Pro",
    subtitle: "Powerful performance, all-day battery.",
    price: "GH₵ 0.00",
  },
  {
    src: "/videos/PixVerse_V6_Fusion_540P_image1_A_modern_tablet.mp4",
    label: "Tablet",
    title: "Tablet Air",
    subtitle: "Light, fast and made for work on the go.",
    price: "GH₵ 0.00",
  },
  {
    src: "/videos/2026-08-27T18-56-51-353Z-6c3c201c.mp4",
    label: "Powerbank",
    title: "Powerbank Max",
    subtitle: "Fast charging that keeps up with you.",
    price: "GH₵ 0.00",
  },
];

const PcShowcase = () => {
  return (
    <div className="px-6 py-5">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">Top Deals</h2>
        <div className="w-12 h-1 bg-gray-400 rounded-full mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {items.map((item) => (
          <div
            key={item.src}
            className="relative h-64 rounded-2xl overflow-hidden bg-gray-900 shadow-sm  transition duration-300"
          >
            {/* video as background */}
            <video
              src={item.src}
              autoPlay
              loop
              muted
              playsInline
              disablePictureInPicture
              controlsList="nodownload noplaybackrate nofullscreen"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* dark fade from the left so the text stays readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            {/* text on top */}
            <div className="relative z-10 h-full p-6 flex flex-col justify-center max-w-[60%]">
              <span className="self-start text-[10px] font-bold uppercase tracking-wide bg-violet-600 text-white px-2 py-1 rounded-md">
                Just Arrived
              </span>
              <h3 className="text-white text-2xl font-bold mt-3 leading-tight">
                {item.title}
              </h3>
              <p className="text-gray-200 text-xs mt-1">{item.subtitle}</p>
              <p className="text-white font-bold mt-3">{item.price}</p>
              <Link
                to="/shop"
                className="self-start inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-4 py-2 rounded-lg mt-3 hover:bg-gray-100 transition"
              >
                Explore Now <FiArrowRight />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PcShowcase;
