import { useState, useEffect } from "react";
import api from "../../utils/api";

const inputClass =
  "mt-1 w-full border rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500";

const Field = ({ label, hint, className = "", children }) => (
  <label className={`block text-sm text-gray-700 ${className}`}>
    {label}
    {children}
    {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
  </label>
);

const SlideForm = ({ products, onCancel, onSaved }) => {
  const [form, setForm] = useState({
    product_id: "",
    video_url: "",
    badge: "Just Arrived",
    display_order: 0,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("video", file);
      const res = await api.post("/upload/video", data);
      setForm((f) => ({ ...f, video_url: res.data.url }));
    } catch (err) {
      setError("Video upload failed. Use an MP4, WEBM or MOV under 50MB.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/featured-slides", {
        ...form,
        display_order: Number(form.display_order) || 0,
      });
      onSaved();
    } catch (err) {
      setError("Could not save the slide.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6">
      <h2 className="text-base font-semibold text-gray-900">New slide</h2>

      <div className="grid lg:grid-cols-[320px_1fr] gap-6 mt-6">
        {/* video */}
        <div>
          <div className="aspect-video border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
            {form.video_url ? (
              <video
                key={form.video_url}
                src={form.video_url}
                controls
                muted
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm text-gray-400">No video</span>
            )}
          </div>
          <label className="mt-3 block w-full text-center border rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            {uploading
              ? "Uploading, please wait..."
              : form.video_url
                ? "Change video"
                : "Choose video"}
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideo}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* fields */}
        <div className="grid sm:grid-cols-2 gap-4 content-start">
          <Field label="Product" className="sm:col-span-2">
            <select
              required
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="" disabled>
                Choose a product
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Badge text">
            <input
              name="badge"
              value={form.badge}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Display order" hint="Lower numbers show first.">
            <input
              type="number"
              min="0"
              name="display_order"
              value={form.display_order}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-5">{error}</p>}

      <div className="flex gap-3 mt-6 pt-6 border-t">
        <button
          type="submit"
          disabled={saving || uploading || !form.video_url}
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save slide"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border text-sm text-gray-700 px-5 py-2 rounded-md hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const menu = [
  { key: "add", label: "Add slide" },
  { key: "all", label: "All slides" },
];

const SlidesTab = ({ view, setView }) => {
  const [slides, setSlides] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [slideRes, prodRes] = await Promise.all([
          api.get("/featured-slides"),
          api.get("/products"),
        ]);
        setSlides(slideRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.log("Failed to load slides");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  const handleSaved = () => {
    setView("all");
    setReload((r) => r + 1);
  };

  const handleDelete = async (slide) => {
    if (!window.confirm(`Delete the slide for "${slide.name}"?`)) return;
    try {
      await api.delete(`/featured-slides/${slide.id}`);
      setReload((r) => r + 1);
    } catch (error) {
      alert("Could not delete this slide.");
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      <div>
        {view === "add" ? (
          <SlideForm
            products={products}
            onCancel={() => setView("all")}
            onSaved={handleSaved}
          />
        ) : slides.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-16">
            No slides yet. The New Arrivals video card stays hidden until you
            add one.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((s) => (
              <div
                key={s.id}
                className="bg-white border rounded-lg overflow-hidden flex flex-col"
              >
                <video
                  src={s.video_url}
                  controls
                  muted
                  className="w-full aspect-video bg-black object-cover"
                />
                <div className="p-4 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                    {s.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {s.badge || "No badge"} · Order {s.display_order}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(s)}
                  className="py-2.5 text-sm text-gray-500 hover:text-red-600 hover:bg-gray-50 border-t transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlidesTab;
