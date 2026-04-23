import React, { useState, useEffect } from "react";
import axios from "axios";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("k_token")}` },
});

const SellerRunAds = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    adTitle: "",
    budget: "",
    duration: "",
    targetAudience: "",
  });
  const [ads, setAds] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, adsRes] = await Promise.all([
          axios.get("/api/products/my-products", authHeader()),
          axios.get("/api/ads/my", authHeader()),
        ]);
        setProducts(productsRes.data.products || []);
        setAds(adsRes.data.ads || []);
      } catch (err) {
        console.error(
          "Fetch error:",
          err.response?.data?.message || err.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await axios.post("/api/ads", form, authHeader());
      setMessage({ text: "Ad successfully created!", type: "success" });
      setAds([...ads, res.data.ad]);
      setForm({
        productId: "",
        adTitle: "",
        budget: "",
        duration: "",
        targetAudience: "",
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Error creating ad",
        type: "error",
      });
    } finally {
      setCreating(false);
    }
  };

  const s = {
    wrapper: { fontFamily: "'DM Sans', sans-serif", padding: "0" },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "700",
      color: "#111",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    badge: {
      background: "#f0f0f0",
      borderRadius: "20px",
      padding: "2px 10px",
      fontSize: "12px",
      fontWeight: "600",
      color: "#555",
    },
    card: {
      background: "#fff",
      borderRadius: "16px",
      border: "1px solid #eee",
      padding: "28px",
      marginBottom: "24px",
    },
    formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" },
    formGroup: { display: "flex", flexDirection: "column", gap: "6px" },
    label: {
      fontSize: "12px",
      fontWeight: "600",
      color: "#666",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    input: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1.5px solid #e8e8e8",
      fontSize: "14px",
      color: "#111",
      background: "#fafafa",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
    },
    select: {
      padding: "10px 14px",
      borderRadius: "10px",
      border: "1.5px solid #e8e8e8",
      fontSize: "14px",
      color: "#111",
      background: "#fafafa",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      cursor: "pointer",
    },
    fullWidth: { gridColumn: "1 / -1" },
    submitBtn: {
      gridColumn: "1 / -1",
      padding: "12px 24px",
      background: "#111",
      color: "#fff",
      border: "none",
      borderRadius: "10px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      marginTop: "4px",
    },
    msgSuccess: {
      background: "#f0fdf4",
      border: "1px solid #bbf7d0",
      color: "#15803d",
      borderRadius: "10px",
      padding: "10px 16px",
      fontSize: "13px",
      marginTop: "12px",
    },
    msgError: {
      background: "#fff1f2",
      border: "1px solid #fecdd3",
      color: "#be123c",
      borderRadius: "10px",
      padding: "10px 16px",
      fontSize: "13px",
      marginTop: "12px",
    },
    tableWrapper: { overflowX: "auto" },
    table: { width: "100%", borderCollapse: "collapse", fontSize: "13px" },
    th: {
      textAlign: "left",
      padding: "10px 14px",
      background: "#f7f7f7",
      color: "#666",
      fontWeight: "600",
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "1px solid #eee",
    },
    td: {
      padding: "12px 14px",
      borderBottom: "1px solid #f0f0f0",
      color: "#333",
      verticalAlign: "middle",
    },
    statusActive: {
      display: "inline-block",
      background: "#f0fdf4",
      color: "#15803d",
      borderRadius: "20px",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: "600",
    },
    statusInactive: {
      display: "inline-block",
      background: "#f7f7f7",
      color: "#888",
      borderRadius: "20px",
      padding: "3px 10px",
      fontSize: "11px",
      fontWeight: "600",
    },
    emptyState: { textAlign: "center", padding: "40px 20px", color: "#aaa" },
    progressBar: {
      height: "5px",
      background: "#f0f0f0",
      borderRadius: "99px",
      overflow: "hidden",
      minWidth: "80px",
      marginTop: "4px",
    },
  };

  if (loading)
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "#aaa",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );

  return (
    <div style={s.wrapper}>
      {/* Create Ad Form */}
      <div style={s.card}>
        <div style={s.sectionTitle}>
          <span>🎯</span> Create New Ad
        </div>
        <form onSubmit={handleSubmit}>
          <div style={s.formGrid}>
            <div style={{ ...s.formGroup, ...s.fullWidth }}>
              <label style={s.label}>Select Product</label>
              <select
                name="productId"
                value={form.productId}
                onChange={handleChange}
                required
                style={s.select}
              >
                <option value="">Choose a product to promote...</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ ...s.formGroup, ...s.fullWidth }}>
              <label style={s.label}>Ad Title</label>
              <input
                name="adTitle"
                placeholder="e.g. Summer Sale — 30% Off!"
                value={form.adTitle}
                onChange={handleChange}
                required
                style={s.input}
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Budget (₹)</label>
              <input
                name="budget"
                type="number"
                min="1"
                placeholder="500"
                value={form.budget}
                onChange={handleChange}
                required
                style={s.input}
              />
            </div>

            <div style={s.formGroup}>
              <label style={s.label}>Duration (Days)</label>
              <input
                name="duration"
                type="number"
                min="1"
                placeholder="7"
                value={form.duration}
                onChange={handleChange}
                required
                style={s.input}
              />
            </div>

            <div style={{ ...s.formGroup, ...s.fullWidth }}>
              <label style={s.label}>
                Target Audience{" "}
                <span
                  style={{
                    color: "#aaa",
                    fontWeight: 400,
                    textTransform: "none",
                  }}
                >
                  (optional)
                </span>
              </label>
              <input
                name="targetAudience"
                placeholder="e.g. Men 18–35, Fashion lovers..."
                value={form.targetAudience}
                onChange={handleChange}
                style={s.input}
              />
            </div>

            <button type="submit" style={s.submitBtn} disabled={creating}>
              {creating ? "Creating..." : "🚀 Launch Ad"}
            </button>
          </div>
        </form>
        {message.text && (
          <div style={message.type === "success" ? s.msgSuccess : s.msgError}>
            {message.text}
          </div>
        )}
      </div>

      {/* Ads Table */}
      <div style={s.card}>
        <div style={s.sectionTitle}>
          Your Ads <span style={s.badge}>{ads.length}</span>
        </div>

        {ads.length === 0 ? (
          <div style={s.emptyState}>
            <div style={{ fontSize: "36px", marginBottom: "10px" }}>📢</div>
            <div style={{ fontSize: "14px", fontWeight: "500" }}>
              No ads yet. Launch your first ad above!
            </div>
          </div>
        ) : (
          <div style={s.tableWrapper}>
            <table style={s.table}>
              <thead>
                <tr>
                  {[
                    "Product",
                    "Title",
                    "Budget",
                    "Spent",
                    "Remaining",
                    "Clicks",
                    "Impressions",
                    "Status",
                  ].map((h) => (
                    <th key={h} style={s.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ads.map((ad) => {
                  const spent = ad.budget - ad.remainingBudget;
                  const spentPct = (spent / ad.budget) * 100;
                  const fillColor =
                    spentPct > 70
                      ? "#ef4444"
                      : spentPct > 40
                      ? "#f59e0b"
                      : "#22c55e";
                  return (
                    <tr key={ad._id}>
                      <td style={s.td}>{ad.productId?.name || "—"}</td>
                      <td style={{ ...s.td, fontWeight: 600 }}>{ad.adTitle}</td>
                      <td style={s.td}>₹{ad.budget}</td>
                      <td style={s.td}>
                        <div>₹{spent}</div>
                        <div style={s.progressBar}>
                          <div
                            style={{
                              height: "100%",
                              width: `${Math.min(spentPct, 100)}%`,
                              background: fillColor,
                              borderRadius: "99px",
                            }}
                          />
                        </div>
                      </td>
                      <td style={s.td}>₹{ad.remainingBudget}</td>
                      <td style={s.td}>{ad.clicks ?? 0}</td>
                      <td style={s.td}>{ad.impressions ?? 0}</td>
                      <td style={s.td}>
                        <span
                          style={
                            ad.isActive !== false
                              ? s.statusActive
                              : s.statusInactive
                          }
                        >
                          {ad.isActive !== false ? "Active" : "Ended"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerRunAds;
