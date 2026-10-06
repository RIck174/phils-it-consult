import { useState } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa";
import {
  FiTag,
  FiShield,
  FiMapPin,
  FiRefreshCw,
  FiCheck,
} from "react-icons/fi";

/* ─── phone mockup – placeholder gradient that looks like a device ─── */
const PhoneMockup = () => (
  <div className="relative w-32 h-52 shrink-0">
    {/* outer shell */}
    <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-slate-800 to-slate-900 shadow-2xl border border-white/10" />
    {/* screen */}
    <div className="absolute inset-[6px] rounded-[16px] overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
      {/* fake app ui */}
      <div className="p-2 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="w-8 h-1.5 rounded-full bg-white/60" />
          <div className="w-4 h-4 rounded-full bg-white/20" />
        </div>
        {/* banner strip */}
        <div className="rounded-lg bg-white/20 h-14 flex items-center justify-center">
          <div className="text-white text-[9px] font-bold">Phil's IT</div>
        </div>
        {/* product rows */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5 bg-white/10 rounded-md px-1.5 py-1">
            <div className="w-5 h-5 rounded bg-white/20 shrink-0" />
            <div className="flex-1 space-y-0.5">
              <div className="h-1 rounded-full bg-white/50 w-3/4" />
              <div className="h-1 rounded-full bg-white/30 w-1/2" />
            </div>
            <div className="h-1.5 w-5 rounded-full bg-white/40" />
          </div>
        ))}
        {/* bottom nav */}
        <div className="flex justify-around pt-1">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`w-4 h-4 rounded-full ${i === 0 ? "bg-white/60" : "bg-white/20"}`} />
          ))}
        </div>
      </div>
    </div>
    {/* notch */}
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-2 bg-slate-800 rounded-full z-10" />
  </div>
);

/* ─── fake QR code made of divs ─── */
const QrCode = () => (
  <div className="w-16 h-16 shrink-0 grid grid-cols-8 gap-px p-1 bg-white rounded-lg border border-gray-200 shadow-xs">
    {Array.from({ length: 64 }, (_, i) => {
      // deterministic pattern that looks like a QR code
      const r = Math.floor(i / 8);
      const c = i % 8;
      const corner =
        (r < 3 && c < 3) || (r < 3 && c > 4) || (r > 4 && c < 3);
      const seed = ((r * 17 + c * 13 + r * c) % 7 < 4) || corner;
      return (
        <div key={i} className={`rounded-[1px] ${seed ? "bg-gray-900" : "bg-white"}`} />
      );
    })}
  </div>
);

const features = [
  { icon: FiTag, label: "Exclusive App Deals" },
  { icon: FiShield, label: "Faster & Secure Checkout" },
  { icon: FiMapPin, label: "Real-time Order Tracking" },
  { icon: FiRefreshCw, label: "Easy Returns & Support" },
];

const stats = [
  { value: "10K+", label: "Happy Customers" },
  { value: "500+", label: "Top Brands" },
  { value: "99%", label: "Satisfaction Rate" },
];

const AppDownloadBanner = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <section className="py-2">
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">

        {/* ── TOP ROW ── */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8">

          {/* Left – phone mockup */}
          <div className="flex items-end justify-center shrink-0 self-end md:self-auto">
            <PhoneMockup />
          </div>

          {/* Center – headline + buttons */}
          <div className="flex-1 space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-semibold border border-blue-100">
              📱 Coming Soon
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-snug">
              Shop Smarter with the<br className="hidden sm:block" />{" "}
              <span className="text-blue-600">Phil's IT App</span>
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto md:mx-0">
              Exclusive app-only offers, faster checkout, and real-time order tracking — all in your pocket.
            </p>

            {/* Store badges */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-1">
              <button className="flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl transition">
                <FaApple size={20} />
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-gray-300">Download on the</p>
                  <p className="text-sm font-bold">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-2.5 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl transition">
                <FaGooglePlay size={18} className="text-emerald-400" />
                <div className="text-left leading-tight">
                  <p className="text-[10px] text-gray-300">Get it on</p>
                  <p className="text-sm font-bold">Google Play</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right – feature list + QR code */}
          <div className="flex items-start gap-5 shrink-0">
            <ul className="space-y-2.5">
              {features.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    <Icon size={11} className="text-blue-600" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <div className="hidden sm:flex flex-col items-center gap-1.5">
              <QrCode />
              <p className="text-[10px] text-gray-400 font-medium text-center leading-tight">
                Scan to Download<br />the App
              </p>
            </div>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="border-t border-slate-100 mx-6" />

        {/* ── BOTTOM ROW ── */}
        <div className="flex flex-col md:flex-row items-center gap-6 px-6 sm:px-8 py-5">

          {/* Testimonial */}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
              What Our Customers Say
            </p>
            <blockquote className="flex items-start gap-3">
              <span className="text-3xl text-blue-200 font-serif leading-none">"</span>
              <div>
                <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
                  Phil's IT has the best collection of gadgets. Fast delivery, great prices and amazing customer service!
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[9px] font-bold text-blue-600">RF</div>
                  <div>
                    <p className="text-[11px] font-semibold text-gray-800">Robert Fox</p>
                    <p className="text-[10px] text-gray-400">Verified Buyer</p>
                  </div>
                </div>
              </div>
            </blockquote>
          </div>

          {/* Join Club / Email Signup */}
          <div className="flex-1 min-w-0 bg-gray-900 rounded-xl p-4 text-white">
            <h4 className="font-bold text-sm">Join Phil's IT Club</h4>
            <p className="text-xs text-gray-400 mt-0.5 mb-3">
              Get exclusive offers, new arrivals and discounts straight to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-400 outline-none focus:border-blue-400 transition"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition flex items-center gap-1 whitespace-nowrap"
              >
                {subscribed ? <><FiCheck size={12} /> Done!</> : "Subscribe"}
              </button>
            </form>
            <p className="text-[10px] text-gray-500 mt-1.5">No spam, unsubscribe anytime.</p>
          </div>

          {/* Stats */}
          <div className="flex md:flex-col gap-5 md:gap-3 shrink-0">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center md:text-right">
                <p className="text-lg font-extrabold text-gray-900 leading-none">{value}</p>
                <p className="text-[11px] text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AppDownloadBanner;
