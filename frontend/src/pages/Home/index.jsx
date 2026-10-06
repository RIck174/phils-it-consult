import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TechStore from "../../assets/SL.png";
import ItService from "../../assets/stux-network-connection-414415_1920.jpg";
import WorkTransform from "../../assets/WorkspaceTransformation.jpg";
import DigitalSolution from "../../assets/web.jpg";

import Products from "../../components/Products";
import ServicesNav from "../../components/ServicesNav";
import SpotlightCard from "../../components/spotlightCard";
import FeaturedCollections from "../../components/FeaturedCollectections";
import ServicesSpotlightSection from "../../components/ServicesSpotlightSection";
import NewArrivals from "../../components/NewArrivals";
import AppDownloadBanner from "../../components/AppDownloadBanner";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import {
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
  FiTruck,
  FiShield,
  FiTool,
  FiRefreshCw,
} from "react-icons/fi";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef(null);
  const navigate = useNavigate();

  const slides = [
    {
      badge: "TECH STORE",
      titleLines: ["Future Technology,", "Delivered Today."],
      subtitle: "Explore high-performance laptops, accessories, and smart devices.",
      productImage: TechStore,
      buttonText: "Shop Gadgets",
      target: "/shop",
    },
    {
      badge: "ENTERPRISE SUPPORT",
      titleLines: ["Professional IT Services", "for Your Business."],
      subtitle: "Network infrastructure, hardware diagnostics, and secure cloud setups.",
      productImage: ItService,
      buttonText: "IT Support",
      target: "/services/it-services",
    },
    {
      badge: "DIGITAL AGENCY",
      titleLines: ["Modern Web & Software", "Solutions Built to Scale."],
      subtitle: "Custom business websites and high-converting web applications.",
      productImage: DigitalSolution,
      buttonText: "Get Started",
      target: "/services",
    },
    {
      badge: "WORKSPACE DESIGN",
      titleLines: ["Ergonomic Workspaces", "Made Effortless."],
      subtitle: "Transform your office into a productive, modern work environment.",
      productImage: WorkTransform,
      buttonText: "Explore Setups",
      target: "/services",
    },
  ];

  return (
    <div className="bg-slate-50/60 min-h-screen">
      {/* 1. Hero Swiper Section */}
      <div className="relative bg-slate-950 overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          speed={900}
          loop
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="h-[360px] sm:h-[400px] lg:h-[440px]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-full flex items-center px-6 sm:px-12 lg:px-20 overflow-hidden"
                style={{
                  backgroundImage: `url(${slide.productImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/40"></div>

                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 bg-blue-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider shadow-sm">
                    {slide.badge}
                  </span>
                  <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight mb-2.5">
                    {slide.titleLines.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <p className="text-slate-300 text-xs sm:text-sm mb-6 max-w-md leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => navigate(slide.target)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-md shadow-blue-600/30 cursor-pointer"
                    >
                      {slide.buttonText} <FiArrowRight size={14} />
                    </button>
                    <button
                      onClick={() => navigate("/services")}
                      className="text-slate-200 hover:text-white border border-white/20 hover:border-white/40 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition cursor-pointer"
                    >
                      All Services
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
        >
          <FiChevronLeft size={16} />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition border border-white/10 cursor-pointer"
        >
          <FiChevronRight size={16} />
        </button>

        {/* Slide Counter Indicator */}
        <div className="absolute bottom-4 right-8 z-20 flex items-center gap-2.5 text-white/80 text-[11px] font-mono font-semibold">
          <span className="text-blue-400">
            {String(activeSlide + 1).padStart(2, "0")}
          </span>
          <span className="w-8 h-px bg-white/25"></span>
          <span>{String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>

      {/* 2. Slim Confidence / Trust Bar (Warranty removed as requested) */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2.5 px-4">
        <div className="max-w-[1536px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-3 text-xs px-2 sm:px-4">
          <div className="flex items-center justify-center gap-2">
            <FiTruck className="text-blue-400 shrink-0" size={16} />
            <div>
              <span className="font-semibold text-white block text-xs leading-none">
                Free Delivery
              </span>
              <span className="text-[10px] text-slate-400">Orders over GH₵500</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiShield className="text-emerald-400 shrink-0" size={16} />
            <div>
              <span className="font-semibold text-white block text-xs leading-none">
                100% Protected
              </span>
              <span className="text-[10px] text-slate-400">Secure transactions</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiTool className="text-indigo-400 shrink-0" size={16} />
            <div>
              <span className="font-semibold text-white block text-xs leading-none">
                IT Support
              </span>
              <span className="text-[10px] text-slate-400">Certified technicians</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <FiRefreshCw className="text-cyan-400 shrink-0" size={16} />
            <div>
              <span className="font-semibold text-white block text-xs leading-none">
                Easy Returns
              </span>
              <span className="text-[10px] text-slate-400">30-day exchange window</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Services Navigation Bar (Tech Store Sorted First) */}
      <ServicesNav />

      {/* 4. Main Page Content - Cleanly Spaced Layout with Expanded Width */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 space-y-6 sm:space-y-8 my-4 sm:my-6">
        {/* Spotlight Grid Highlights */}
        <section>
          <SpotlightCard />
        </section>

        {/* Featured Collections */}
        <section className="bg-slate-100/80 rounded-2xl p-4 sm:p-6">
          <FeaturedCollections />
        </section>

        {/* Hot Deals Products */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/70 shadow-xs">
          <Products type="hotdeals" />
        </section>

        {/* Strategic Placement: Services Spotlight Section */}
        <section>
          <ServicesSpotlightSection />
        </section>

        {/* Best Selling Carousel (Auto-scrolling 10 items) */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/70 shadow-xs">
          <Products type="bestselling" />
        </section>

        {/* New Arrivals */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/70 shadow-xs">
          <NewArrivals />
        </section>

        {/* All Products / Gadgets Showcase */}
        <section className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/70 shadow-xs">
          <Products type="all" />
        </section>

        {/* Download Website App Banner */}
        <AppDownloadBanner />
      </main>
    </div>
  );
};

export default Home;
