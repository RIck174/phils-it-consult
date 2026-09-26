import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiCode,
  FiMonitor,
  FiPenTool,
  FiTool,
  FiHome,
} from "react-icons/fi";

const highlights = [
  { icon: FiCode, label: "Website Design & Development" },
  { icon: FiTool, label: "IT Support & Setup" },
  { icon: FiPenTool, label: "Branding & Graphics" },
  { icon: FiMonitor, label: "Workspace Transformation" },
];

const ServicesSpotlightSection = () => {
  return (
    <div className="px-6 py-8">
      {/* banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-slate-950 to-blue-950 px-8 py-12 md:px-14 shadow-lg">
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-600/30 blur-3xl"></div>
        <div className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full bg-indigo-700/20 blur-3xl"></div>

        <div className="relative z-10 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <span className="inline-block text-[10px] font-bold uppercase tracking-widest bg-blue-600 text-white px-2 py-1 rounded-md">
              Beyond the Store
            </span>
            <h2 className="text-white text-3xl md:text-4xl font-bold mt-4 leading-tight">
              Need a website that works as hard as you do?
            </h2>
            <p className="text-gray-300 text-sm md:text-base mt-3 max-w-md leading-relaxed">
              From stunning websites to reliable IT support, we design, build
              and maintain the technology that helps your business grow.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-white text-gray-900 text-sm font-semibold px-5 py-3 rounded-lg mt-6 hover:bg-gray-200 transition"
            >
              Check Us Out <FiArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm hover:bg-white/10 transition"
              >
                <Icon className="text-blue-400 shrink-0" size={20} />
                <span className="text-white text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* IT Services + Workspace Transformation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {/* IT Services */}
        <div className="relative rounded-2xl p-8 flex flex-col justify-between min-h-[380px] bg-white text-[#0a355f] border border-gray-200">
          <div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[#0a355f]/10 text-[#0a355f]">
              <FiTool size={22} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-sky-700">
              IT Services
            </p>
            <h3 className="text-2xl font-semibold leading-snug">
              Reliable support for the work that matters.
            </h3>
            <p className="text-sm mt-2 leading-relaxed text-slate-600">
              Network issues, hardware faults, security concerns, we fix the
              problems that slow your business down.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "Network & Wi-Fi issues",
                "Hardware repairs",
                "Security & backups",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#0a355f]"></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/services/it-services"
            className="inline-flex items-center gap-2 w-fit text-sm font-semibold px-5 py-3 rounded-full mt-6 bg-[#0a355f] text-white hover:bg-[#0d4680] transition"
          >
            Get IT Support <FiArrowRight size={14} />
          </Link>
        </div>

        {/* Workspace Transformation */}
        <div className="relative rounded-2xl p-8 flex flex-col justify-between min-h-[380px] bg-[#faf3ea] text-[#4a2f1c]">
          <div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-5 bg-[#4a2f1c]/10 text-[#4a2f1c]">
              <FiHome size={22} />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-[#6b4527]">
              Workspace Transformation
            </p>
            <h3 className="text-2xl font-bold leading-snug">
              Spaces where your team does their best work.
            </h3>
            <p className="text-sm mt-2 leading-relaxed text-[#6b4527]">
              From layout planning to full setup, we help you build an office
              that works as hard as you do.
            </p>
            <ul className="mt-5 space-y-2">
              {[
                "Space planning & design",
                "Ergonomic furniture",
                "Full setup & installation",
              ].map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#4a2f1c]"></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 w-fit text-sm font-semibold px-5 py-3 rounded-full mt-6 bg-[#4a2f1c] text-white hover:bg-[#3a2416] transition"
          >
            Explore Workspaces <FiArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesSpotlightSection;
