import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag, FiCpu, FiPenTool, FiLayout, FiGlobe } from "react-icons/fi";
import api from "../utils/api";

const serviceIcons = {
  "Tech Store": FiShoppingBag,
  "Digital Transformation": FiGlobe,
  "IT Services": FiCpu,
  "Web & Design Studio": FiPenTool,
  "Creative Studio": FiPenTool, // legacy fallback from DB
  "Workspace Transformation": FiLayout,
};

const defaultServices = [
  { id: 1, name: "Tech Store" },
  { id: 2, name: "Digital Transformation" },
  { id: 3, name: "IT Services" },
  { id: 4, name: "Workspace Transformation" },
  { id: 5, name: "Web & Design Studio" },
];

const ServicesNav = ({ onSelect }) => {
  const [services, setServices] = useState(defaultServices);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        if (response.data && response.data.length > 0) {
          // Ensure Tech Store is sorted first if present
          const sorted = [...response.data].sort((a, b) => {
            if (a.name.toLowerCase().includes("tech store")) return -1;
            if (b.name.toLowerCase().includes("tech store")) return 1;
            return a.id - b.id;
          });
          setServices(sorted);
        }
      } catch {
        // Keeps defaultServices fallback gracefully
      }
    };
    fetchServices();
  }, []);

  const handleClick = (service) => {
    setActiveId(service.id);
    if (service.name.toLowerCase().includes("tech store")) {
      navigate("/shop");
      return;
    } else if (
      service.name === "Digital Transformation" ||
      service.name === "Creative Studio" ||
      service.name === "Web & Design Studio"
    ) {
      navigate("/services/creative-studio");
      return;
    } else if (service.name === "IT Services") {
      navigate("/services/it-services");
      return;
    } else if (service.name === "Workspace Transformation") {
      navigate("/services/workspace-transformation");
      return;
    }
    if (onSelect) onSelect(service);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] sticky top-0 z-30">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 py-2 flex items-center justify-center gap-2 sm:gap-6 overflow-x-auto no-scrollbar">
        {services.map((service) => {
          const Icon = serviceIcons[service.name] || FiShoppingBag;
          const isActive = activeId === service.id;
          return (
            <button
              key={service.id}
              onClick={() => handleClick(service)}
              className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
              }`}
            >
              <Icon
                size={14}
                className={`transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-600"
                }`}
              />
              <span>{service.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesNav;
