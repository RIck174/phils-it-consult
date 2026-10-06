import { Link } from "react-router-dom";
import macbookImage from "../assets/TechStore.jpg";
import headphonesImage from "../assets/headphone.jpg";
import audioImage from "../assets/Headphone2.jpg";
import cameraImage from "../assets/camera.jpg";

const spotlightCards = [
  {
    image: macbookImage,
    eyebrow: "LIMITED TIME OFFER",
    title: "MacBook Air M2",
    subtitle: "Supercharged by M2.",
    price: "From $1099.00",
    buttonText: "Shop Now",
    theme: "dark", // dark overlay + white text, image fills card
  },
  {
    image: headphonesImage,
    eyebrow: "MEGA DEAL",
    title: "Grab Up to 40% Off",
    subtitle: "On selected items",
    buttonText: "Shop Deals",
    theme: "purple", // solid purple bg, image on the right side
  },
  {
    image: audioImage,
    title: "Sound That Moves You.",
    subtitle: "Premium audio experience for every moment.",
    buttonText: "Shop Audio",
    theme: "light-blue",
  },
  {
    image: cameraImage,
    title: "Capture Every Detail.",
    subtitle: "Professional cameras for professionals.",
    buttonText: "Shop Cameras",
    theme: "light-green",
  },
];

const SpotlightCard = ({ card, className = "" }) => {
  return (
    <Link
      to="/shop"
      className={`group relative rounded-2xl overflow-hidden flex flex-col justify-end p-4.5 sm:p-5 transition-transform duration-300 hover:scale-[1.01] shadow-xs hover:shadow-md cursor-pointer ${className}`}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15"></div>

      <div className="relative z-10 text-white">
        {card.eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-1">
            {card.eyebrow}
          </p>
        )}
        <h3 className="font-extrabold text-base sm:text-lg leading-tight max-w-[85%]">
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="text-xs text-slate-200 mt-1 max-w-[80%] line-clamp-1">
            {card.subtitle}
          </p>
        )}
        {card.price && (
          <p className="text-xs font-semibold text-emerald-400 mt-1">
            {card.price}
          </p>
        )}
        <span className="inline-block mt-3 text-xs font-bold px-3.5 py-1.5 rounded-full bg-white text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-xs">
          {card.buttonText}
        </span>
      </div>
    </Link>
  );
};

const SpotlightGrid = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      <SpotlightCard card={spotlightCards[0]} className="h-64 sm:h-72" />
      <SpotlightCard card={spotlightCards[1]} className="h-64 sm:h-72" />
      <div className="grid grid-rows-2 gap-4">
        <SpotlightCard card={spotlightCards[2]} className="h-32" />
        <SpotlightCard card={spotlightCards[3]} className="h-32" />
      </div>
    </div>
  );
};

export default SpotlightGrid;
