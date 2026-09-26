import { useState, useEffect } from "react";
import api from "../utils/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [brands, setBrands] = useState([]);

  const handleCategoryClick = async (id) => {
    setSelectedCat(selectedCat === id ? null : id);
    const response = await api.get(`/categories/${id}/brands`);
    setBrands(response.data);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await api.get(`/categories`);
      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full border border-gray-200 rounded-lg shadow-sm">
      <p className="px-4 py-3 font-bold text-xs text-gray-500 uppercase tracking-widest border-b">
        CATEGORIES
      </p>
      {categories.map((cat) => (
        <div key={cat.id}>
          <div
            onClick={() => handleCategoryClick(cat.id)}
            className="px-4 py-3 border-b border-gray-100 text-sm font-medium hover:bg-blue-50 cursor-pointer flex justify-between items-center"
          >
            {cat.name}
            <span className="text-xs text-gray-400">
              {selectedCat === cat.id ? "−" : "+"}
            </span>
          </div>
          {selectedCat === cat.id && (
            <div className="px-6 py-2 bg-gray-50 text-xs text-gray-600 space-y-1">
              {brands.map((b, i) => (
                <p key={i}>{b.brand}</p>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Categories;
