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
    <div
      className={`relative rounded-2xl overflow-hidden flex flex-col justify-end p-4 ${className}`}
    >
      <img
        src={card.image}
        alt={card.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"></div>

      <div className="relative z-10 text-white">
        {card.eyebrow && (
          <p className="text-[10px] font-semibold uppercase tracking-wide opacity-90 mb-1">
            {card.eyebrow}
          </p>
        )}
        <h3 className="font-bold text-base leading-tight max-w-[75%]">
          {card.title}
        </h3>
        {card.subtitle && (
          <p className="text-xs mt-1 opacity-90 max-w-[70%]">{card.subtitle}</p>
        )}
        {card.price && <p className="text-xs mt-1 opacity-90">{card.price}</p>}
        <button className="mt-3 text-xs font-semibold px-4 py-2 rounded-full bg-white text-gray-900 w-fit">
          {card.buttonText}
        </button>
      </div>
    </div>
  );
};

const SpotlightGrid = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full px-6 py-5">
      <SpotlightCard card={spotlightCards[0]} className="h-72" />
      <SpotlightCard card={spotlightCards[1]} className="h-72" />
      <div className="grid grid-rows-2 gap-4">
        <SpotlightCard card={spotlightCards[2]} className="h-32" />
        <SpotlightCard card={spotlightCards[3]} className="h-32" />
      </div>
    </div>
  );
};

export default SpotlightGrid;
