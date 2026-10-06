import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import SlidesTab from "./SlidesTab";

const empty = {
  name: "",
  brand: "",
  price: "",
  old_price: "",
  stock_quantity: "",
  category_id: "",
  description: "",
  image_url: "",
  is_featured: false,
};

const emptyVariant = {
  label: "",
  color_hex: "",
  image_url: "",
  price: "",
  stock_quantity: "",
};

const inputClass =
  "mt-1 w-full border rounded-md px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500";

const Field = ({ label, className = "", children }) => (
  <label className={`block text-sm text-gray-700 ${className}`}>
    {label}
    {children}
  </label>
);

/* ── Variant Manager (shown after product is saved / while editing) ── */
const VariantManager = ({ productId }) => {
  const [variants, setVariants] = useState([]);
  const [form, setForm] = useState(emptyVariant);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    try {
      const res = await api.get(`/products/${productId}/variants`);
      setVariants(res.data);
    } catch { /* silent */ }
  };

  useEffect(() => { load(); }, [productId]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data);
      setForm((f) => ({ ...f, image_url: res.data.url }));
    } catch (err) {
      setError("Image upload failed. Try a smaller image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.label.trim()) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      if (editingId) {
        await api.put(`/products/variants/${editingId}`, form);
        setSuccess(`Updated "${form.label}" successfully!`);
      } else {
        await api.post(`/products/${productId}/variants`, form);
        setSuccess(`Added "${form.label}" successfully!`);
      }
      setForm(emptyVariant);
      setEditingId(null);
      await load();
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to save variant");
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (v) => {
    setEditingId(v.id);
    setError("");
    setSuccess("");
    setForm({
      label: v.label,
      color_hex: v.color_hex || "",
      image_url: v.image_url || "",
      price: v.price || "",
      stock_quantity: v.stock_quantity,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this variant?")) return;
    try {
      await api.delete(`/products/variants/${id}`);
      await load();
      setSuccess("Variant deleted.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete variant");
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Product Variants ({variants.length})
        <span className="ml-2 text-xs text-gray-400 font-normal">
          (e.g. colors, styles, storage sizes)
        </span>
      </h3>

      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg flex items-center gap-2">
          <span>✓</span> {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg flex items-center gap-2">
          <span>⚠</span> {error}
        </div>
      )}

      {/* existing variants */}
      {variants.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-5">
          {variants.map((v) => (
            <div key={v.id} className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-gray-50 text-sm">
              {v.color_hex && (
                <span
                  className="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                  style={{ background: v.color_hex }}
                />
              )}
              {v.image_url && (
                <img src={v.image_url} alt={v.label} className="w-7 h-7 object-contain rounded" />
              )}
              <span className="font-medium text-gray-800">{v.label}</span>
              {v.price && <span className="text-gray-400 text-xs">GH₵{v.price}</span>}
              <span className={`text-xs ${v.stock_quantity <= 0 ? "text-red-500" : "text-green-600"}`}>
                {v.stock_quantity <= 0 ? "Out of stock" : `${v.stock_quantity} stock`}
              </span>
              <button
                onClick={() => startEdit(v)}
                className="text-blue-600 text-xs hover:underline ml-1"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(v.id)}
                className="text-red-500 text-xs hover:underline"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* add / edit form */}
      <form onSubmit={handleSave} className="bg-slate-50 border rounded-lg p-4">
        <p className="text-xs font-semibold text-gray-600 mb-3">
          {editingId ? "Edit variant" : "Add a variant"}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Field label="Label *">
            <input
              required
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              placeholder="e.g. Space Gray, 256GB, Red"
              className={inputClass}
            />
          </Field>

          <Field label="Color (optional)">
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={form.color_hex || "#000000"}
                onChange={(e) => setForm((f) => ({ ...f, color_hex: e.target.value }))}
                className="w-9 h-9 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={form.color_hex}
                onChange={(e) => setForm((f) => ({ ...f, color_hex: e.target.value }))}
                placeholder="#hex or leave empty"
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </Field>

          <Field label={`Price override (leave blank = same)`}>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>

          <Field label="Stock">
            <input
              type="number"
              min="0"
              value={form.stock_quantity}
              onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))}
              placeholder="0"
              className={inputClass}
            />
          </Field>

          <Field label="Variant image (upload or paste URL)" className="sm:col-span-2 lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="w-12 h-12 object-contain rounded border bg-white shrink-0" />
              ) : null}
              <input
                type="text"
                placeholder="Paste image URL (e.g. /images/... or https://...)"
                value={form.image_url || ""}
                onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full"
              />
              <label className="border rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer whitespace-nowrap bg-white shrink-0">
                {uploading ? "Uploading..." : "Browse file..."}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImage}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
              {form.image_url && (
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, image_url: "" }))}
                  className="text-xs text-red-500 hover:underline shrink-0"
                >
                  Clear
                </button>
              )}
            </div>
          </Field>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            {saving ? "Saving..." : editingId ? "Update variant" : "Add variant"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setForm(emptyVariant); }}
              className="border text-sm text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

/* ── Product Form ── */
const ProductForm = ({ product, categories, onCancel, onSaved }) => {
  const [form, setForm] = useState(product || empty);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [savedId, setSavedId] = useState(product?.id || null);
  const [justCreated, setJustCreated] = useState(false);
  const isSubmittingRef = useRef(false);

  // For brand new products: allow defining variants before saving
  const [pendingVariants, setPendingVariants] = useState([]);
  const [newVar, setNewVar] = useState(emptyVariant);
  const [varUploading, setVarUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data);
      setForm((f) => ({ ...f, image_url: res.data.url }));
    } catch (err) {
      setError("Image upload failed. Use a JPEG, PNG or WEBP under 5MB.");
    } finally {
      setUploading(false);
    }
  };

  const handleVarImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setVarUploading(true);
    try {
      const data = new FormData();
      data.append("image", file);
      const res = await api.post("/upload", data);
      setNewVar((v) => ({ ...v, image_url: res.data.url }));
    } catch (err) {
      alert("Variant image upload failed.");
    } finally {
      setVarUploading(false);
    }
  };

  const addPendingVariant = (e) => {
    e.preventDefault();
    if (!newVar.label.trim()) return;
    setPendingVariants((prev) => [...prev, { ...newVar, id: Date.now() }]);
    setNewVar(emptyVariant);
  };

  const removePendingVariant = (id) => {
    setPendingVariants((prev) => prev.filter((x) => x.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setSaving(true);
    setError("");
    setSuccessMsg("");

    try {
      const payload = { ...form, category_id: form.category_id || null };
      let newProdId = savedId || product?.id;

      if (newProdId) {
        // Already exists / already saved -> update it (never duplicate)
        await api.put(`/products/${newProdId}`, payload);
      } else {
        // Brand new product -> create once
        const res = await api.post("/products", payload);
        newProdId = res.data.product?.id;
        
        // Save any pending variants that were queued
        if (newProdId && pendingVariants.length > 0) {
          for (const v of pendingVariants) {
            try {
              await api.post(`/products/${newProdId}/variants`, {
                label: v.label,
                color_hex: v.color_hex,
                image_url: v.image_url,
                price: v.price,
                stock_quantity: v.stock_quantity,
              });
            } catch (varErr) {
              console.error("Failed to save pending variant", v.label, varErr);
            }
          }
          setPendingVariants([]);
        }
        setJustCreated(true);
      }

      setSavedId(newProdId);
      setSuccessMsg(justCreated || savedId ? "Product updated successfully!" : "Product and variants created successfully!");
      onSaved();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Could not save the product.");
    } finally {
      setSaving(false);
      isSubmittingRef.current = false;
    }
  };

  const resetFormForNew = () => {
    setForm(empty);
    setSavedId(null);
    setJustCreated(false);
    setSuccessMsg("");
    setError("");
    setPendingVariants([]);
    setNewVar(emptyVariant);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded-lg p-6 relative">
      <div className="flex items-center justify-between pb-3 border-b mb-4">
        <h2 className="text-base font-bold text-gray-900">
          {savedId ? "Edit Product" : "New Product"}
        </h2>
        {savedId && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ✓ Saved in Store (ID: {savedId})
          </span>
        )}
      </div>

      {/* Prominent success notification with next steps */}
      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                <span>✓</span> {successMsg}
              </p>
              <p className="text-xs text-emerald-700 mt-0.5">
                The product is now in your catalog. You don't need to click save again.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {savedId && (
                <a
                  href={`/shop/${savedId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  View in Store ↗
                </a>
              )}
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition"
              >
                All Products
              </button>
              <button
                type="button"
                onClick={resetFormForNew}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
              >
                + Add Another
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-lg">
          ⚠ {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-6 mt-2">
        {/* image */}
        <div>
          <div className="aspect-square border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
            {form.image_url ? (
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-full object-contain p-3"
              />
            ) : (
              <span className="text-sm text-gray-400">No image</span>
            )}
          </div>
          <label className="mt-3 block w-full text-center border rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">
            {uploading
              ? "Uploading..."
              : form.image_url
                ? "Change image"
                : "Choose image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImage}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* fields */}
        <div className="grid sm:grid-cols-2 gap-4 content-start">
          <Field label="Name" className="sm:col-span-2">
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Brand">
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Category">
            <select
              name="category_id"
              value={form.category_id ?? ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">No category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Price (GH₵)">
            <input
              required
              type="number"
              min="0"
              step="0.01"
              name="price"
              value={form.price}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Old Price (GH₵) — for discount display">
            <input
              type="number"
              min="0"
              step="0.01"
              name="old_price"
              value={form.old_price || ""}
              onChange={handleChange}
              placeholder="Optional"
              className={inputClass}
            />
          </Field>
          <Field label="Stock">
            <input
              required
              type="number"
              min="0"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              rows={5}
              name="description"
              value={form.description}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
            />
          </Field>
          <label className="sm:col-span-2 flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
            />
            Mark as featured
          </label>
        </div>
      </div>

      <div className="flex gap-3 mt-6 pt-6 border-t">
        <button
          type="submit"
          disabled={saving || uploading}
          className="bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving
            ? (savedId ? "Updating product..." : "Saving product...")
            : (savedId ? "Update Product" : "Save product")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border text-sm text-gray-700 px-5 py-2.5 rounded-md hover:bg-gray-50 transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* ── VARIANTS SECTION ── */}
      {savedId ? (
        <VariantManager productId={savedId} />
      ) : (
        <div className="mt-8 border-t pt-6 bg-slate-50 p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Product Variants ({pendingVariants.length})
              </h3>
              <p className="text-xs text-gray-500">
                You can queue up variants (colors, styles, sizes) right now. They will be saved together when you click <b>Save product</b> above!
              </p>
            </div>
          </div>

          {/* List of pending variants added so far */}
          {pendingVariants.length > 0 && (
            <div className="flex flex-wrap gap-2.5 mb-5 p-3 bg-white rounded-lg border border-slate-200">
              {pendingVariants.map((v) => (
                <div key={v.id} className="flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-blue-50/50 text-xs font-medium">
                  {v.color_hex && (
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                      style={{ background: v.color_hex }}
                    />
                  )}
                  {v.image_url && (
                    <img src={v.image_url} alt="" className="w-6 h-6 object-contain rounded shrink-0" />
                  )}
                  <span className="font-semibold text-gray-800">{v.label}</span>
                  {v.price && <span className="text-gray-500">(GH₵{v.price})</span>}
                  <span className="text-gray-500">Qty: {v.stock_quantity || 0}</span>
                  <button
                    type="button"
                    onClick={() => removePendingVariant(v.id)}
                    className="text-red-500 hover:text-red-700 font-bold ml-1"
                    title="Remove variant"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form to add a variant to the pending list */}
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              + Add a variant to this product:
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <Field label="Variant Label *">
                <input
                  type="text"
                  placeholder="e.g. Space Gray, Silver, 256GB"
                  value={newVar.label}
                  onChange={(e) => setNewVar((v) => ({ ...v, label: e.target.value }))}
                  className={inputClass}
                />
              </Field>

              <Field label="Color (optional)">
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={newVar.color_hex || "#000000"}
                    onChange={(e) => setNewVar((v) => ({ ...v, color_hex: e.target.value }))}
                    className="w-9 h-9 rounded border cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="#hex code"
                    value={newVar.color_hex}
                    onChange={(e) => setNewVar((v) => ({ ...v, color_hex: e.target.value }))}
                    className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </Field>

              <Field label="Price override (optional)">
                <input
                  type="number"
                  placeholder="Leave empty to use base price"
                  value={newVar.price}
                  onChange={(e) => setNewVar((v) => ({ ...v, price: e.target.value }))}
                  className={inputClass}
                />
              </Field>

              <Field label="Stock">
                <input
                  type="number"
                  placeholder="0"
                  value={newVar.stock_quantity}
                  onChange={(e) => setNewVar((v) => ({ ...v, stock_quantity: e.target.value }))}
                  className={inputClass}
                />
              </Field>

              <Field label="Variant image (upload or URL)" className="sm:col-span-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
                  {newVar.image_url ? (
                    <img src={newVar.image_url} alt="" className="w-12 h-12 object-contain rounded border bg-white shrink-0" />
                  ) : null}
                  <input
                    type="text"
                    placeholder="Paste image URL (optional)"
                    value={newVar.image_url || ""}
                    onChange={(e) => setNewVar((v) => ({ ...v, image_url: e.target.value }))}
                    className="flex-1 border rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500 w-full"
                  />
                  <label className="border rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer whitespace-nowrap bg-white shrink-0">
                    {varUploading ? "Uploading..." : "Browse file..."}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleVarImage}
                      disabled={varUploading}
                      className="hidden"
                    />
                  </label>
                  {newVar.image_url && (
                    <button
                      type="button"
                      onClick={() => setNewVar((v) => ({ ...v, image_url: "" }))}
                      className="text-xs text-red-500 hover:underline shrink-0"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </Field>
            </div>

            <button
              type="button"
              onClick={addPendingVariant}
              disabled={!newVar.label.trim()}
              className="mt-4 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
            >
              + Add variant to list
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

const menu = [
  { key: "add", label: "Add product" },
  { key: "all", label: "All products" },
  { key: "variants", label: "Product Variants" },
  { key: "slide-add", label: "Add slide" },
  { key: "slide-all", label: "All slides" },
];

const ProductsTab = () => {
  const [view, setView] = useState("add");
  const [selectedVariantProductId, setSelectedVariantProductId] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/categories"),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        if (prodRes.data.length > 0 && !selectedVariantProductId) {
          setSelectedVariantProductId(prodRes.data[0].id);
        }
      } catch (error) {
        console.log("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [reload]);

  const goTo = (key) => {
    setEditing(null);
    setView(key);
  };

  const startEdit = (product) => {
    setEditing(product);
    setView("add");
  };

  const handleSaved = () => {
    setReload((r) => r + 1);
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}"?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      setReload((r) => r + 1);
    } catch (error) {
      alert("Could not delete this product.");
    }
  };

  const q = search.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q),
  );

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <div>
      {/* sub menu */}
      <div className="flex gap-6 border-b">
        {menu.map((m) => (
          <button
            key={m.key}
            onClick={() => goTo(m.key)}
            className={`pb-3 text-sm transition cursor-pointer ${
              view === m.key
                ? "text-blue-700 font-medium border-b-2 border-blue-600 -mb-px"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {view === "slide-add" || view === "slide-all" ? (
          <SlidesTab
            view={view === "slide-add" ? "add" : "all"}
            setView={(v) => setView(v === "add" ? "slide-add" : "slide-all")}
          />
        ) : view === "add" ? (
          <ProductForm
            key={editing?.id ?? "new"}
            product={editing}
            categories={categories}
            onCancel={() => goTo("all")}
            onSaved={handleSaved}
          />
        ) : view === "variants" ? (
          <div className="bg-white border rounded-xl p-6 shadow-xs">
            <h2 className="text-base font-bold text-gray-900 mb-1">Manage Product Variants</h2>
            <p className="text-xs text-gray-500 mb-6">Select any product to view, add, or customize its color, style, or size variants.</p>
            
            <div className="max-w-md mb-6">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Select Product:
              </label>
              <select
                value={selectedVariantProductId || ""}
                onChange={(e) => setSelectedVariantProductId(e.target.value ? Number(e.target.value) : "")}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-white font-medium text-gray-800 outline-none focus:border-blue-500"
              >
                <option value="">-- Choose a product --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.brand ? `(${p.brand})` : ""} - GH₵{p.price}
                  </option>
                ))}
              </select>
            </div>

            {selectedVariantProductId ? (
              <div>
                {(() => {
                  const currProd = products.find((x) => x.id === Number(selectedVariantProductId));
                  return currProd ? (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center gap-4">
                      {currProd.image_url && (
                        <img src={currProd.image_url} alt="" className="w-16 h-16 object-contain rounded-lg bg-white p-1 border" />
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">{currProd.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Base Price: GH₵{currProd.price} • Stock: {currProd.stock_quantity}</p>
                      </div>
                    </div>
                  ) : null;
                })()}

                <VariantManager productId={selectedVariantProductId} />
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-gray-50">
                <p className="text-sm font-medium text-gray-600">Please choose a product from the dropdown above to view and add variants.</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, brand or description"
                className="w-full max-w-md border bg-white rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <p className="text-sm text-gray-500 shrink-0">
                {visible.length} products
              </p>
            </div>

            {visible.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-16">
                {products.length === 0
                  ? "No products yet."
                  : "No products match your search."}
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
                {visible.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white border rounded-lg overflow-hidden flex flex-col"
                  >
                    <div className="h-56 bg-gray-50 flex items-center justify-center">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-full h-full object-contain p-4"
                        />
                      ) : (
                        <span className="text-sm text-gray-400">No image</span>
                      )}
                    </div>

                    <div className="p-4 flex-1">
                      {p.brand && (
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      )}
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {p.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                        {p.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-semibold text-gray-900">
                          GH₵ {p.price}
                        </span>
                        <span
                          className={`text-xs ${p.stock_quantity <= 0 ? "text-red-600" : "text-gray-500"}`}
                        >
                          {p.stock_quantity <= 0
                            ? "Out of stock"
                            : `${p.stock_quantity} in stock`}
                        </span>
                      </div>
                    </div>

                    <div className="flex border-t text-xs font-semibold divide-x">
                      <button
                        onClick={() => startEdit(p)}
                        className="flex-1 py-2.5 text-blue-600 hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedVariantProductId(p.id);
                          setView("variants");
                        }}
                        className="flex-1 py-2.5 text-indigo-600 hover:bg-gray-50 transition"
                      >
                        Variants
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="flex-1 py-2.5 text-gray-500 hover:text-red-600 hover:bg-gray-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductsTab;
