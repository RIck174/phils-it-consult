import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const ServicesNav = ({ onSelect }) => {
  const [services, setServices] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      const response = await api.get("/services");
      setServices(response.data);
    };
    fetchServices();
  }, []);

  const handleClick = (service) => {
    if (service.name === "IT Services") {
      navigate("/services/it-services");
      return;
    } else if (service.name === "Creative Studio") {
      navigate("/services/creative-studio");
      return;
    }
    setActiveId(service.id);
    onSelect(service);
  };

  return (
    <div className="flex justify-center gap-15 px-6 py-3 border-b border-gray-200 bg-white overflow-x-auto">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => handleClick(service)}
          className={`text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition ${
            activeId === service.id
              ? "text-blue-600"
              : "text-gray-700 hover:text-blue-600"
          }`}
        >
          {service.name}
        </button>
      ))}
    </div>
  );
};

export default ServicesNav;
