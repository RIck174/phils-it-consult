import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiLock,
  FiMail,
  FiUser,
  FiEye,
  FiEyeOff,
  FiSun,
  FiMoon,
  FiCpu,
  FiCode,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiKey,
  FiShoppingCart,
  FiServer,
  FiPackage,
  FiTruck,
  FiHardDrive
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Failed to decode JWT payload:", e);
    return null;
  }
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        const { token, message } = response.data;

        let userData = { email: formData.email };
        const payload = decodeJwtPayload(token);
        if (payload) {
          userData = { ...userData, id: payload.id, role: payload.role };
        }

        login(userData, token);
        setSuccessMsg(message || "Authentication successful. Welcome back!");

        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long.");
          setLoading(false);
          return;
        }

        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Attempt automatic login post registration
        try {
          const loginRes = await api.post("/auth/login", {
            email: formData.email,
            password: formData.password,
          });
          const { token } = loginRes.data;
          let userData = { name: formData.name, email: formData.email };
          const payload = decodeJwtPayload(token);
          if (payload) {
            userData = { ...userData, id: payload.id, role: payload.role };
          }

          login(userData, token);
          setSuccessMsg("Account created! Access granted. Redirecting to store...");
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } catch (autoLoginErr) {
          setSuccessMsg("Account registered successfully! Please sign in.");
          setIsLogin(true);
        }
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        "Authentication server error. Please check your network and credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (mode) => {
    setIsLogin(mode);
    setError("");
    setSuccessMsg("");
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans ${
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-slate-100 text-slate-900"
      }`}
    >
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div
          className={`absolute inset-0 ${
            isDarkMode
              ? "bg-[radial-gradient(#38bdf8_1px,transparent_1px)]"
              : "bg-[radial-gradient(#0284c7_1px,transparent_1px)]"
          } [background-size:24px_24px]`}
        />
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full filter blur-3xl opacity-30 ${
            isDarkMode ? "bg-cyan-500" : "bg-blue-300"
          }`}
        />
        <div
          className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full filter blur-3xl opacity-30 ${
            isDarkMode ? "bg-indigo-600" : "bg-indigo-300"
          }`}
        />
      </div>

      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Side: Tech Store & IT Services Showcase Card */}
        <div
          className={`lg:col-span-5 flex flex-col justify-between space-y-8 p-6 lg:p-8 rounded-2xl border backdrop-blur-md shadow-2xl relative overflow-hidden transition-colors ${
            isDarkMode
              ? "bg-slate-900/70 border-slate-800 text-slate-100"
              : "bg-white/90 border-slate-200 text-slate-800"
          }`}
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono border ${
                  isDarkMode
                    ? "bg-blue-500/10 text-cyan-400 border-cyan-500/20"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                <FiShoppingCart />
                <span>PHIL'S-IT STORE v2.0</span>
              </div>

              {/* Dark/Light mode toggle */}
              <button
                type="button"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode
                    ? "border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700"
                    : "border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="Toggle visual theme"
              >
                {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight mb-3">
              Hardware, Accessories <span className="text-blue-500">&</span> IT Services
            </h1>
            <p
              className={`text-sm leading-relaxed mb-6 ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Sign in to manage your gear orders, request IT consultation, track hardware deliveries, and unlock tech store member perks.
            </p>

            {/* Interactive Hardware & System Status Terminal Component */}
            <div className="rounded-lg bg-slate-950 border border-slate-800 p-4 font-mono text-xs shadow-inner">
              <div className="flex items-center gap-1.5 mb-3 border-b border-slate-800/80 pb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-slate-500 text-[10px]">
                  system — phils-store.status
                </span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <p className="text-slate-500">$ store-cli status --inventory</p>
                <p className="text-emerald-400">
                  ✔ Laptops, Workstations & Gaming PCs in stock
                </p>
                <p className="text-cyan-400">
                  ⚡ Nationwide Express Delivery Active
                </p>
                <p className="text-slate-400">
                  &gt; Portal Mode:{" "}
                  <span className="text-amber-300">
                    {isLogin ? "CUSTOMER_SIGN_IN" : "REGISTER_NEW_CLIENT"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Tech Store Highlights */}
          <div className="space-y-3 pt-2">
            {[
              { text: "Verified Genuine Tech Hardware & Accessories", icon: FiPackage },
              { text: "Express Shipping & Order Tracking", icon: FiTruck },
              { text: "24/7 Professional IT Consulting & Support", icon: FiServer },
            ].map((item, i) => {
              const IconComp = item.icon;
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 text-xs font-mono ${
                    isDarkMode ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  <IconComp className="text-blue-500 shrink-0" />
                  <span>{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-7">
          <div
            className={`rounded-2xl border p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
              isDarkMode
                ? "bg-slate-900/80 border-slate-800 text-slate-100"
                : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {/* Header / Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-1">
                  {isLogin
                    ? "Sign in to access your tech orders and services"
                    : "Register to start shopping tech gear and request IT services"}
                </p>
              </div>

              {/* Segmented Control Switch */}
              <div
                className={`flex p-1 rounded-xl border self-start sm:self-auto ${
                  isDarkMode
                    ? "bg-slate-950/60 border-slate-800"
                    : "bg-slate-100 border-slate-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                  className={`relative px-4 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                    isLogin
                      ? "text-white"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isLogin && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <FiLock /> Sign In
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => switchMode(false)}
                  className={`relative px-4 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors cursor-pointer ${
                    !isLogin
                      ? "text-white"
                      : isDarkMode
                      ? "text-slate-400 hover:text-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {!isLogin && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <FiCode /> Register
                  </span>
                </button>
              </div>
            </div>

            {/* Error Notification */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-start gap-3"
                >
                  <FiAlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold uppercase tracking-wider mb-0.5">
                      Authentication Error
                    </p>
                    <p>{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Notification */}
            <AnimatePresence>
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-start gap-3"
                >
                  <FiCheckCircle size={18} className="shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold uppercase tracking-wider mb-0.5">
                      Status OK
                    </p>
                    <p>{successMsg}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiUser size={16} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Alex Johnson"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-950/80 border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-600"
                          : "bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </motion.div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiMail size={16} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="client@techstore.com"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-950/80 border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-600"
                        : "bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Password
                  </label>
                  {isLogin && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert("Password reset feature coming soon!");
                      }}
                      className="text-xs text-blue-500 hover:underline font-mono"
                    >
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiKey size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••••"
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-all ${
                      isDarkMode
                        ? "bg-slate-950/80 border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-600"
                        : "bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiLock size={16} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="••••••••••••"
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-sans focus:outline-none transition-all ${
                        isDarkMode
                          ? "bg-slate-950/80 border-slate-800 focus:border-blue-500 text-slate-100 placeholder-slate-600"
                          : "bg-slate-50 border-slate-300 focus:border-blue-600 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-6 rounded-xl font-mono text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 shadow-lg shadow-blue-500/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </div>
                ) : (
                  <>
                    <span>{isLogin ? "SIGN IN TO STORE" : "CREATE ACCOUNT"}</span>
                    <FiArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Footer / Helper Text */}
            <div
              className={`mt-8 pt-6 border-t flex items-center justify-between text-xs font-mono ${
                isDarkMode
                  ? "border-slate-800/60 text-slate-500"
                  : "border-slate-200 text-slate-500"
              }`}
            >
              <span className="flex items-center gap-1">
                <FiShield className="text-emerald-500" />
                256-bit TLS Encrypted
              </span>
              <button
                type="button"
                onClick={() => switchMode(!isLogin)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                {isLogin ? "Need an account? Register" : "Have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
