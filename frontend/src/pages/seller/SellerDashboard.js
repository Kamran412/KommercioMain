import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SellerRunAds from "../../components/seller/SellerRunAds";
import { motion } from "framer-motion";
import {
  FiPackage,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiPlus,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useAuthStore, useOrderStore } from "../../store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function SellerDashboard() {
  const { user, logout } = useAuthStore();
  const { analytics, fetchAnalytics, sellerOrders, fetchSellerOrders } =
    useOrderStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
    fetchSellerOrders({ limit: 5 });
  }, []);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${(analytics?.totalRevenue || 0).toLocaleString("en-IN")}`,
      icon: <FiDollarSign />,
      color: "#22c55e",
      bg: "#dcfce7",
    },
    {
      label: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: <FiShoppingBag />,
      color: "#6c63ff",
      bg: "#ede9fe",
    },
    {
      label: "Total Products",
      value: analytics?.totalProducts || 0,
      icon: <FiPackage />,
      color: "#f59e0b",
      bg: "#fef3c7",
    },
    {
      label: "This Month",
      value: `₹${(
        analytics?.monthlyRevenue?.reduce((s, r) => s + r.revenue, 0) || 0
      ).toLocaleString("en-IN")}`,
      icon: <FiTrendingUp />,
      color: "#0ea5e9",
      bg: "#e0f2fe",
    },
  ];

  const ORDER_STATUS_COLOR = {
    placed: "#f59e0b",
    confirmed: "#6c63ff",
    shipped: "#8b5cf6",
    delivered: "#22c55e",
    cancelled: "#ef4444",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f8", display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 240,
          background: "linear-gradient(180deg, #0a0a1f 0%, #13132e 100%)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 100,
          padding: "24px 0",
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 24px 24px",
            borderBottom: "1px solid rgba(108,99,255,0.2)",
          }}
        >
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 20,
              fontWeight: 800,
              color: "#f0f0ff",
            }}
          >
            Komm<span style={{ color: "#ff6b35" }}>ercio</span>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#6c63ff",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            Seller Dashboard
          </div>
        </div>
        {/* Seller info */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid rgba(108,99,255,0.15)",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "linear-gradient(135deg, #6c63ff, #ff6b35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Syne'",
              fontWeight: 800,
              fontSize: 18,
              color: "#fff",
              marginBottom: 8,
            }}
          >
            {user?.shopName?.[0]?.toUpperCase()}
          </div>
          <div style={{ fontWeight: 700, color: "#f0f0ff", fontSize: 14 }}>
            {user?.shopName}
          </div>
          <div style={{ color: "#8888aa", fontSize: 12 }}>{user?.mobile}</div>
        </div>
        {/* Nav */}
        <nav style={{ flex: 1, padding: "16px 12px" }}>
          {[
            {
              label: "Dashboard",
              to: "/seller/dashboard",
              icon: <FiTrendingUp />,
            },
            { label: "Products", to: "/seller/products", icon: <FiPackage /> },
            { label: "Orders", to: "/seller/orders", icon: <FiShoppingBag /> },
            { label: "Profile", to: "/seller/profile", icon: <FiSettings /> },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                borderRadius: 10,
                color:
                  window.location.pathname === item.to ? "#6c63ff" : "#8888aa",
                background:
                  window.location.pathname === item.to
                    ? "rgba(108,99,255,0.12)"
                    : "transparent",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 4,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (window.location.pathname !== item.to) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#f0f0ff";
                }
              }}
              onMouseLeave={(e) => {
                if (window.location.pathname !== item.to) {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#8888aa";
                }
              }}
            >
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          style={{
            margin: "0 12px 16px",
            padding: "11px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "none",
            border: "none",
            color: "#ef4444",
            cursor: "pointer",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Main */}
      <div style={{ marginLeft: 240, flex: 1, padding: "32px 32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#1a1a3a",
                marginBottom: 4,
              }}
            >
              Welcome back, {user?.shopName}! 👋
            </h1>
            <p style={{ color: "#888", fontSize: 14 }}>
              Here's what's happening with your store today.
            </p>
          </div>
          <Link to="/seller/products/add">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
                fontFamily: "'Syne'",
              }}
            >
              <FiPlus /> Add Product
            </motion.button>
          </Link>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginBottom: 32,
          }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                border: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={{ color: "#888", fontSize: 13, marginBottom: 8 }}>
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#1a1a3a",
                    }}
                  >
                    {s.value}
                  </div>
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: s.bg,
                    color: s.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                  }}
                >
                  {s.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        {analytics?.monthlyRevenue?.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#1a1a3a",
                marginBottom: 20,
              }}
            >
              Revenue (Last 30 Days)
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11, fill: "#888" }} />
                <YAxis tick={{ fontSize: 11, fill: "#888" }} />
                <Tooltip
                  formatter={(v) => [
                    `₹${v.toLocaleString("en-IN")}`,
                    "Revenue",
                  ]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6c63ff"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#6c63ff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Orders */}
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 28,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* Seller Advertisement System */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              marginBottom: 28,
            }}
          >
            <SellerRunAds />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 18,
                fontWeight: 800,
                color: "#1a1a3a",
              }}
            >
              Recent Orders
            </div>
            <Link
              to="/seller/orders"
              style={{
                color: "#6c63ff",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              View All →
            </Link>
          </div>
          {sellerOrders.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#888" }}
            >
              No orders yet. Share your products to get started!
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f8ff" }}>
                  {["Order ID", "Buyer", "Product", "Amount", "Status"].map(
                    (h) => (
                      <th
                        key={h}
                        style={{
                          padding: "12px 16px",
                          textAlign: "left",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#888",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {sellerOrders.slice(0, 5).map((order, i) => (
                  <tr
                    key={order._id}
                    style={{ borderTop: "1px solid #f0f0f0" }}
                  >
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#6c63ff",
                      }}
                    >
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 14 }}>
                      {order.buyer?.username}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: 13,
                        color: "#555",
                        maxWidth: 180,
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.orderItems?.[0]?.name}
                        {order.orderItems?.length > 1 &&
                          ` +${order.orderItems.length - 1} more`}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontFamily: "'Syne'",
                        fontWeight: 800,
                        fontSize: 15,
                      }}
                    >
                      ₹{order.totalPrice?.toLocaleString("en-IN")}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "4px 12px",
                          borderRadius: 99,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            ORDER_STATUS_COLOR[order.orderStatus] + "20",
                          color:
                            ORDER_STATUS_COLOR[order.orderStatus] || "#888",
                          textTransform: "capitalize",
                        }}
                      >
                        {order.orderStatus?.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
