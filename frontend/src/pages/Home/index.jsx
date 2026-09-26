import { useEffect, useState, useRef } from "react";
import TechStore from "../../assets/SL.png";
import ItService from "../../assets/stux-network-connection-414415_1920.jpg";
import WorkTransform from "../../assets/WorkspaceTransformation.jpg";
import DigitalSolution from "../../assets/web.jpg";
import Tabs from "../../components/Tabs";
import Products from "../../components/Products";
import Categories from "../../components/Categories";
import ServicesNav from "../../components/ServicesNav";
import SpotlightCard from "../../components/spotlightCard";
import FeaturedCollections from "../../components/FeaturedCollectections";
import TrustBadges from "../../components/TrustBadges";
import ServicesSpotlightSection from "../../components/ServicesSpotlightSection";
import NewArrivals from "../../components/NewArrivals";
import Reveal from "../../components/Reveal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import {
  FiPlay,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiTool,
  FiHome,
} from "react-icons/fi";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);
  const [selectedService, setSelectedService] = useState(null);
  const serviceDetailRef = useRef(null);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    serviceDetailRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  const slides = [
    {
      badge: "NEW LAUNCH",
      titleLines: ["Future", "Technology", "Today."],
      subtitle: "Explore the latest smart devices and innovations.",
      productImage: TechStore,
      buttonText: "Shop Now",
    },
    {
      badge: "TRUSTED PARTNER",
      titleLines: ["Professional", "IT Services", "for Business."],
      subtitle: "Expert support for your business technology needs",
      productImage: ItService,
      buttonText: "Learn More",
    },
    {
      badge: "GROW WITH US",
      titleLines: ["Digital", "Solutions", "Redefined."],
      subtitle: "Transform your business with cutting edge technology",
      productImage: DigitalSolution,
      buttonText: "Get Started",
    },
    {
      badge: "OFFICE UPGRADE",
      titleLines: ["Workspace", "Transformation", "Made Easy."],
      subtitle: "Create the perfect productive environment",
      productImage: WorkTransform,
      buttonText: "Explore",
    },
  ];

  return (
    <>
      <div className="relative bg-black">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={1000}
          loop
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-[480px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-[480px] flex items-center px-10 lg:px-20 overflow-hidden"
                style={{
                  backgroundImage: `url(${slide.productImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="absolute inset-0 bg-black/50"></div>

                <div className="relative z-10 max-w-md">
                  <span className="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {slide.badge}
                  </span>
                  <h1 className="text-white text-5xl font-extrabold leading-tight mb-4">
                    {slide.titleLines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="text-gray-300 text-sm mb-6">{slide.subtitle}</p>
                  <div className="flex items-center gap-5 mb-10">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 transition">
                      {slide.buttonText} <FiArrowRight />
                    </button>
                    <button className="flex items-center gap-2 text-white text-sm font-medium">
                      <span className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center">
                        <FiPlay size={12} />
                      </span>
                      Watch Video
                    </button>
                  </div>
                  <div className="flex gap-8">
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                      <FiTruck size={18} />
                      <div>
                        <p className="font-semibold text-white">
                          Free Delivery
                        </p>
                        <p>On orders over GH₵500</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                      <FiShield size={18} />
                      <div>
                        <p className="font-semibold text-white">
                          Secure Payment
                        </p>
                        <p>100% protected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                      <FiRefreshCw size={18} />
                      <div>
                        <p className="font-semibold text-white">Easy Returns</p>
                        <p>30 day return</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
        >
          <FiChevronLeft />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
        >
          <FiChevronRight />
        </button>

        <div className="absolute bottom-6 right-10 z-20 flex items-center gap-3 text-white text-xs font-semibold">
          <span>{String(activeSlide + 1).padStart(2, "0")}</span>
          <span className="w-16 h-px bg-white/30"></span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      <div className="px-6 py-1">
        <ServicesNav onSelect={handleServiceSelect} />
      </div>

      <div className="px-6 py-1">
        <SpotlightCard />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <FeaturedCollections />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <Products type="hotdeals" />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <NewArrivals />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <Products type="bestselling" />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <TrustBadges />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <Products type="all" />
      </div>

      <div className="mx-6 my-6 bg-gray-50 rounded-2xl overflow-hidden">
        <ServicesSpotlightSection />
      </div>
    </>
  );
};

export default Home;
