import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiWifi,
  FiCpu,
  FiShield,
  FiPrinter,
  FiServer,
  FiCheck,
} from "react-icons/fi";

const problems = [
  "Network & Wi-Fi issues",
  "Slow or failing computers",
  "Email & data security",
  "Printer & hardware faults",
  "Server & backup problems",
];

const ItServicesCard = () => {
  return (
    <div className="px-6 py-4">
      <div className="relative overflow-hidden rounded-2xl bg-sky-100 border border-sky-200 p-5 md:p-6 grid gap-5 md:grid-cols-5 items-center">
        {/* left: network radar graphic */}
        <div className="md:col-span-2 flex justify-center">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-sky-300"></div>
            <div className="absolute inset-4 rounded-full border border-sky-300"></div>
            <div className="absolute inset-8 rounded-full border border-sky-300 bg-sky-200/60"></div>

            {/* center */}
            <div className="relative z-10 w-14 h-14 rounded-full bg-[#0a355f] text-white flex items-center justify-center shadow-lg">
              <FiWifi size={22} />
            </div>

            {/* floating icons */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-[#0a355f] flex items-center justify-center shadow-md">
              <FiShield size={14} />
            </div>
            <div className="absolute bottom-3 left-1 w-8 h-8 rounded-full bg-white text-[#0a355f] flex items-center justify-center shadow-md">
              <FiCpu size={14} />
            </div>
            <div className="absolute bottom-3 right-1 w-8 h-8 rounded-full bg-white text-[#0a355f] flex items-center justify-center shadow-md">
              <FiServer size={14} />
            </div>
            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-[#0a355f] flex items-center justify-center shadow-md">
              <FiPrinter size={14} />
            </div>
          </div>
        </div>

        {/* right: text */}
        <div className="md:col-span-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-sky-700">
            IT Services · On-site & Remote
          </p>
          <h2 className="text-[#0a355f] text-xl md:text-2xl font-bold mt-1 leading-tight">
            When your tech breaks, your business shouldn't stop.
          </h2>
          <p className="text-slate-600 text-sm mt-2 max-w-lg leading-relaxed">
            We diagnose and fix the problems companies run into every day, so
            your team can get back to work.
          </p>

          <ul className="flex flex-wrap gap-1.5 mt-3">
            {problems.map((p) => (
              <li
                key={p}
                className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1 text-[11px] font-medium text-[#0a355f] shadow-sm"
              >
                <FiCheck className="text-emerald-600" size={12} />
                {p}
              </li>
            ))}
          </ul>

          <Link
            to="/services/it-services"
            className="inline-flex items-center gap-2 bg-[#0a355f] text-white text-sm font-semibold px-5 py-2 rounded-full mt-4 hover:bg-[#0d4680] transition"
          >
            Fix My IT Problem <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItServicesCard;
