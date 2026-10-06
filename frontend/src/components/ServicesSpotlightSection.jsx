import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCode,
  FiMonitor,
  FiPenTool,
  FiTool,
  FiHome,
  FiCheck,
} from "react-icons/fi";

const highlights = [
  { icon: FiCode, label: "Web Development" },
  { icon: FiTool, label: "On-Site IT Support" },
  { icon: FiPenTool, label: "Creative Branding" },
  { icon: FiMonitor, label: "Office Workspace Setup" },
];

const ServicesSpotlightSection = () => {
  return (
    <div className="py-2">
      {/* 1. Sleek Compact Solutions Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a142f] to-blue-950 p-6 sm:p-8 shadow-md border border-blue-900/30">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-12 w-64 h-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid gap-6 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2.5 py-0.5 rounded-full shadow-xs mb-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              IT Consulting & Solutions
            </span>
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight tracking-tight">
              Enterprise-Grade Technology for Growing Teams
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              We design custom websites, deploy secure network infrastructure, and provide fast on-demand IT diagnostics to keep your operations running smoothly.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
              >
                Explore Services <FiArrowRight size={13} />
              </Link>
              <Link
                to="/services/it-services"
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold px-3.5 py-2 rounded-xl transition cursor-pointer"
              >
                Book a Technician
              </Link>
            </div>
          </div>

          {/* Quick Highlight Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-2.5 backdrop-blur-md hover:bg-white/10 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <Icon size={14} />
                </div>
                <span className="text-white text-xs font-medium leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Compact, Proportional Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* IT Services Card */}
        <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 border border-blue-100">
                <FiTool size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                Diagnostics & Support
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Professional On-Site & Remote IT Services
            </h3>
            <p className="text-xs mt-1.5 leading-relaxed text-slate-600">
              Fast hardware repairs, business Wi-Fi setup, server backups, and preventative maintenance for offices and individuals.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-700">
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Network & Wi-Fi Setup
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Hardware Diagnosis
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Data Backup & Recovery
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                OS & Software Repair
              </span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Same-Day Availability</span>
            <Link
              to="/services/it-services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition"
            >
              Get IT Support <FiArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Workspace Transformation Card */}
        <div className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between bg-white text-slate-900 border border-slate-200/80 shadow-xs hover:shadow-md transition">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FiHome size={18} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Office & Studio
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              Modern Workspace Transformation
            </h3>
            <p className="text-xs mt-1.5 leading-relaxed text-slate-600">
              Turn your desk or entire corporate office into an ergonomic, high-productivity environment built around modern tech.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs text-slate-700">
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Ergonomic Desk Setup
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Cable Management
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Multi-Monitor Stations
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="text-emerald-500 shrink-0" size={13} />
                Audio/Video Studio Rig
              </span>
            </div>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Custom Office Planning</span>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
            >
              Explore Workspaces <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSpotlightSection;
