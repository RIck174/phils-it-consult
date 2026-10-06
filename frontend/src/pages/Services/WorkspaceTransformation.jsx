import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import {
  FiLayout,
  FiWifi,
  FiTv,
  FiServer,
  FiCheckCircle,
  FiArrowRight,
  FiSend,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheck,
  FiArrowUpRight,
  FiShield,
  FiSliders,
} from "react-icons/fi";
import workspaceHero from "../../assets/WorkspaceTransformation.jpg";
import cablingImg from "../../assets/stux-network-connection-414415_1920.jpg";
import officeImg from "../../assets/markusspiske-office-1734485_1920.jpg";

const services = [
  {
    icon: FiServer,
    title: "Structured Network Cabling",
    category: "Infrastructure",
    text: "Clean, high-performance Cat6 and fiber optic cabling installed through walls, conduits, and drop ceilings. Every desk gets a dedicated, labeled network drop.",
    points: [
      "Cat6/Cat6A certified cable runs",
      "Clean patch panels and numbered wall ports",
      "Under-floor and perimeter trunking",
      "Network cable testing and certification",
    ],
  },
  {
    icon: FiWifi,
    title: "High-Density Office Wi-Fi",
    category: "Wireless",
    text: "Enterprise mesh access points strategically mounted to eliminate dead zones. Designed to handle dozens of laptops and phones simultaneously without drops.",
    points: [
      "Zero dead-zone wireless coverage",
      "Separate secure staff and guest networks",
      "Seamless roaming between rooms and floors",
      "Bandwidth controls to stop video streaming lag",
    ],
  },
  {
    icon: FiTv,
    title: "Smart Boardroom & Conference AV",
    category: "Audio / Visual",
    text: "Modern meeting spaces equipped with wireless presentation displays, wide-angle conference cameras, and clear table microphones for Zoom and Teams.",
    points: [
      "Wall-mounted conference 4K screens",
      "One-click wireless screen sharing (no HDMI dongles)",
      "Wide-angle camera with table boundary mics",
      "Clean conference table cable management",
    ],
  },
  {
    icon: FiSliders,
    title: "Server Rack Organization",
    category: "Data Closets",
    text: "Transforming chaotic 'spaghetti' server cabinets into neatly routed, color-coded, labeled racks with proper airflow and surge protection.",
    points: [
      "Complete cable de-tangling and re-patching",
      "Color-coded patch cords for phones, PCs, and CCTV",
      "Rack-mount UPS battery backup installation",
      "Clear port labeling and network map documentation",
    ],
  },
  {
    icon: FiLayout,
    title: "Workstation Cable Management",
    category: "Ergonomics",
    text: "Tidy up employee desks with under-desk cable raceways, heavy-duty monitor arms, power strips, and ergonomic positioning for a productive space.",
    points: [
      "Under-desk cable trays and spine organizers",
      "Desk grommet power and USB outlets",
      "Single and dual monitor arm mounting",
      "Elimination of tripping hazards and tangled cords",
    ],
  },
  {
    icon: FiShield,
    title: "Office Access Control & CCTV",
    category: "Security",
    text: "Secure your premises with networked keycard or fingerprint entry for server rooms and main entrances, paired with clear IP camera surveillance.",
    points: [
      "Biometric and RFID door access systems",
      "Server room entry logging and restriction",
      "High-definition night-vision IP CCTV",
      "Remote phone viewing and motion alerts",
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Free On-Site Survey",
    desc: "We visit your office building in Accra, measure floor dimensions, check ceiling/conduit pathways, and understand your desk layout.",
  },
  {
    step: "02",
    title: "Itemized Proposal",
    desc: "You get a transparent quote detailing cable lengths, access point models, wall plates, and labor costs. No surprise additions.",
  },
  {
    step: "03",
    title: "Weekend / Evening Installation",
    desc: "We do the noisy drilling and trunking outside your working hours so your team never loses a single billable workday.",
  },
  {
    step: "04",
    title: "Testing & Handover",
    desc: "Every network drop is tested with a cable certifier, labeled clearly, and handed over with a complete layout diagram.",
  },
];

const WorkspaceTransformation = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setSending(true);
    setError("");
    try {
      await api.post("/service_requests", {
        companyName: data.get("company"),
        contactPerson: data.get("contact"),
        email: data.get("email"),
        phone: data.get("phone"),
        serviceType: data.get("service"),
        message: data.get("message"),
      });
      setSubmitted(true);
      form.reset();
    } catch {
      setError("Could not submit your survey request. Please try again or call us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. DEDICATED WORKSPACE NAVBAR (NO SHOPPING CART)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-950 text-white border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-blue-600 font-bold text-sm text-white">
              P
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                Phil's-IT Consult
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mt-0.5">
                Workspace & Cabling Engineering
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#services" className="hover:text-cyan-400 transition">
              Cabling & Wi-Fi
            </a>
            <a href="#process" className="hover:text-cyan-400 transition">
              Site Survey
            </a>
            <a href="#showcase" className="hover:text-cyan-400 transition">
              Our Installations
            </a>
            <Link
              to="/services/it-services"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <span>IT Support</span>
              <FiArrowUpRight size={13} />
            </Link>
            <Link
              to="/services/creative-studio"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <span>Web & Creative</span>
              <FiArrowUpRight size={13} />
            </Link>
            <Link to="/shop" className="text-slate-400 hover:text-white transition">
              Tech Store ↗
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#survey"
              className="inline-flex items-center gap-2 rounded bg-cyan-600 hover:bg-cyan-500 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition"
            >
              <span>Book Site Survey</span>
              <FiArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. ARCHITECTURAL HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-slate-950 text-white border-b border-slate-800 px-6 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 mb-6">
                <FiLayout className="text-cyan-400" />
                <span>Office Cabling & Workspace Engineering • Accra, Ghana</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                Transform your office into a clean, connected modern workspace.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Tired of messy wires under desks, Wi-Fi dead zones, and chaotic server closets? We design and install structured Cat6 cabling, zero-drop office Wi-Fi, and smart boardroom presentation screens across Accra.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#survey"
                  className="inline-flex items-center gap-2 rounded bg-cyan-600 hover:bg-cyan-500 px-6 py-3.5 text-sm font-bold text-white transition"
                >
                  <FiCalendar size={16} />
                  <span>Request a Free Office Site Survey</span>
                </a>
                <a
                  href="#services"
                  className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-5 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 transition"
                >
                  Explore Capabilities
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Zero Downtime</div>
                  <div className="text-xs text-slate-400 mt-1">Installed evenings & weekends</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Tested & Labeled</div>
                  <div className="text-xs text-slate-400 mt-1">Every Cat6 port numbered & certified</div>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Accra On-Site</div>
                  <div className="text-xs text-slate-400 mt-1">Free physical walk-through</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl overflow-hidden">
                <div className="aspect-[4/3] rounded-lg overflow-hidden relative">
                  <img
                    src={workspaceHero}
                    alt="Modern office workspace transformation in Accra"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 right-3 p-3 rounded bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">Accra Head Office Installation</span>
                      <span className="text-[11px] text-slate-400">Structured Cat6 + Mesh Wi-Fi Setup</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WHAT WE DO (STRUCTURED CABLING & WORKSPACE SERVICES)
      ───────────────────────────────────────────────────────────── */}
      <section id="services" className="px-6 py-20 lg:px-10 border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Infrastructure & Installations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-2">
              Everything your office needs to run without cable clutter.
            </h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              We take pride in neat, robust physical installations. No hanging wires, no unstable connections, and no confusion about which cable goes where.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md hover:border-cyan-500/50 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded bg-cyan-50 text-cyan-700 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                      {service.text}
                    </p>

                    <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
                      {service.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-2 text-xs text-slate-700">
                          <FiCheck className="text-cyan-600 shrink-0 mt-0.5" size={13} />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#survey"
                    className="mt-6 pt-4 border-t border-slate-100 text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center justify-between"
                  >
                    <span>Include in site survey</span>
                    <FiArrowRight size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. PHOTO PROOF / INSTALLATION SHOWCASE
      ───────────────────────────────────────────────────────────── */}
      <section id="showcase" className="px-6 py-20 lg:px-10 bg-slate-100 border-b border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              Real Installations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
              Clean workmanship in Ghanaian offices.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Photos of actual cabling pathways, server rack cleanups, and modern workstation setups.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="h-64 overflow-hidden">
                <img
                  src={cablingImg}
                  alt="Structured network cabling in server rack"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                  Data Infrastructure
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Structured Patch Panels & Server Racks
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Clean color-coded network cables bundled with hook-and-loop straps, labeled port numbers, and surge-protected UPS battery integration.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm">
              <div className="h-64 overflow-hidden">
                <img
                  src={officeImg}
                  alt="Modern workstation setup in Accra"
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                  Office Ergonomics
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Under-Desk Cable Management & Wi-Fi
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Concealed wiring harnesses that keep floors completely clean, dual monitor mounts, and high-speed Wi-Fi access points mounted overhead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW WE WORK (4-STEP REAL WORKFLOW)
      ───────────────────────────────────────────────────────────── */}
      <section id="process" className="px-6 py-20 lg:px-10 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">
              The Project Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 mt-1">
              How we carry out your office upgrade.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From the initial physical walkthrough to final cable testing, here is how we ensure zero disruption to your daily operations.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-xl border border-slate-200 bg-slate-50"
              >
                <span className="text-xs font-bold text-cyan-700 uppercase tracking-widest block">
                  Step {step.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-3">{step.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. SITE SURVEY / INQUIRY FORM
      ───────────────────────────────────────────────────────────── */}
      <section id="survey" className="px-6 py-20 lg:px-10 bg-slate-900 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Book an On-Site Survey
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
                Let's inspect your office space.
              </h2>
              <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                Tell us where your office is located in Accra and what you need upgraded. We'll set a convenient date to inspect the space and provide an itemized quote.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <FiPhone className="text-cyan-400" />
                  <span>Call or WhatsApp: +233 24 000 0000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <FiMail className="text-cyan-400" />
                  <span>Email: hello@philsitconsult.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <FiMapPin className="text-cyan-400" />
                  <span>Greater Accra On-Site Dispatch</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-slate-800 bg-slate-950 p-6 sm:p-9 shadow-xl space-y-4"
              >
                {submitted && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400 shrink-0" size={18} />
                    <span>Thanks! Your site survey request has been received. We will contact you to confirm the date.</span>
                  </div>
                )}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-md text-xs sm:text-sm font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      required
                      name="contact"
                      placeholder="e.g. Samuel Adjei"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Company Name *
                    </label>
                    <input
                      required
                      name="company"
                      placeholder="e.g. Apex Chambers"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      placeholder="samuel@company.com"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      placeholder="024 123 4567"
                      className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Primary Service Needed *
                  </label>
                  <select
                    name="service"
                    defaultValue="Structured Network Cabling"
                    className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.title} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Complete Office Move & Setup">
                      Complete Office Move & New Office Setup
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Office Location & Details *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell us where your office is located in Accra, approximate number of desks or rooms, and any convenient days for the survey..."
                    className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiSend size={14} />
                  <span>{sending ? "Submitting..." : "Schedule Site Survey"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CROSS-SERVICE CONNECTION CARDS (UNIQUE SPATIAL ENGINEERING DESIGN)
      ───────────────────────────────────────────────────────────── */}
      <section className="px-6 py-16 lg:px-10 bg-slate-100 border-t border-slate-200">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              More from Phil's-IT Consult
            </span>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              Explore our other capabilities
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              to="/services/it-services"
              className="p-6 rounded-xl bg-white border border-slate-200 hover:border-blue-600 transition group flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                  Support & Helpdesk
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition">
                  Managed IT Services
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Ongoing computer repairs, staff helpdesk, cloud backups, and antivirus defense for Accra offices.
                </p>
              </div>
              <span className="mt-5 text-xs font-bold text-blue-600 inline-flex items-center gap-1.5">
                <span>View IT Services</span>
                <FiArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/services/creative-studio"
              className="p-6 rounded-xl bg-[#090b10] border border-slate-800 text-white hover:border-slate-600 transition group flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  Web & Branding
                </span>
                <h4 className="text-lg font-bold text-white mt-2 group-hover:text-cyan-300 transition">
                  Websites & Creative Studio
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Bespoke business websites, online stores, logo identity packages, and promotional video content.
                </p>
              </div>
              <span className="mt-5 text-xs font-bold text-cyan-400 inline-flex items-center gap-1.5">
                <span>View Creative Studio</span>
                <FiArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/shop"
              className="p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-400 transition group flex flex-col justify-between shadow-sm"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                  Hardware & Equipment
                </span>
                <h4 className="text-lg font-bold text-slate-900 mt-2 group-hover:text-emerald-600 transition">
                  Phil's-IT Tech Store
                </h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Browse laptops, desktop PCs, monitors, and networking equipment with local Accra warranty.
                </p>
              </div>
              <span className="mt-5 text-xs font-bold text-emerald-600 inline-flex items-center gap-1.5">
                <span>Browse Store Products</span>
                <FiArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. DEDICATED WORKSPACE FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 lg:px-10 text-xs text-slate-500">
          <div>
            <span className="font-bold text-slate-900 text-sm block">Phil's-IT Consult</span>
            <span>Structured Cabling, Smart Boardrooms & Workspace Engineering • Accra, Ghana</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium text-slate-600">
            <a href="#services" className="hover:text-slate-900 transition">Cabling</a>
            <a href="#showcase" className="hover:text-slate-900 transition">Showcase</a>
            <a href="#process" className="hover:text-slate-900 transition">Process</a>
            <Link to="/services/it-services" className="hover:text-slate-900 transition">IT Support</Link>
            <Link to="/shop" className="hover:text-slate-900 transition">Tech Store</Link>
          </div>

          <p>© {new Date().getFullYear()} Phil's-IT Consult. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default WorkspaceTransformation;
