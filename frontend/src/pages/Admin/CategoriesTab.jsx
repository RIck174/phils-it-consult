import { useState, useEffect } from "react";
import api from "../../utils/api";

const CategoriesTab = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get("/categories"),
          api.get("/products"),
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.log("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  const countFor = (id) => products.filter((p) => p.category_id === id).length;

  const handleAdd = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    if (
      categories.some((c) => c.name?.toLowerCase() === trimmed.toLowerCase())
    ) {
      setError("That category already exists.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      await api.post("/categories", { name: trimmed });
      setName("");
      setReload((r) => r + 1);
    } catch (err) {
      setError("Could not add the category.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      setReload((r) => r + 1);
    } catch (err) {
      alert("Could not delete this category.");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleAdd} className="flex gap-3">
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError("");
          }}
          placeholder="New category name"
          className="flex-1 border bg-white rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {saving ? "Adding..." : "Add category"}
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      <div className="bg-white border rounded-lg mt-6">
        <div className="flex items-center justify-between px-4 py-3 border-b text-xs text-gray-500">
          <span>Category</span>
          <span>{categories.length} total</span>
        </div>

        {categories.length === 0 ? (
          <p className="px-4 py-10 text-sm text-gray-500 text-center">
            No categories yet. Add your first one above.
          </p>
        ) : (
          <ul className="divide-y">
            {categories.map((c) => {
              const count = countFor(c.id);
              return (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                  </div>
                  {count > 0 ? (
                    <span className="text-xs text-gray-400">In use</span>
                  ) : (
                    <button
                      onClick={() => handleDelete(c)}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriesTab;
