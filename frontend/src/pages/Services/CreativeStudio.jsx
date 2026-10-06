import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import {
  FiArrowRight,
  FiAward,
  FiPenTool,
  FiVideo,
  FiMonitor,
  FiCheckCircle,
  FiChevronDown,
  FiSend,
  FiSmartphone,
  FiLayers,
  FiCheck,
  FiPhone,
  FiMail,
  FiMapPin,
  FiArrowUpRight,
} from "react-icons/fi";
import productCampaign from "../../assets/WhatsApp Image 2026-09-17 at 9.46.34 PM.jpeg";
import Culturecampaign from "../../assets/WhatsApp Image 12026-09-17 at 9.46.34 PM.jpeg";
import Consumer from "../../assets/WhatsApp Image2 2026-09-17 at 9.46.34 PM.jpeg";
import techStoreImg from "../../assets/TechStore1.jpg";

const services = [
  {
    icon: FiMonitor,
    num: "01",
    tag: "Core Service",
    title: "Custom Websites & Online Stores",
    text: "Clean, fast websites and e-commerce platforms built specifically for your business. No bloated templates that take forever to load on mobile data.",
    points: [
      "Company websites & landing pages",
      "Online stores with local payment setup",
      "Client portals & custom dashboards",
      "Fast loading speeds on Ghanaian networks",
    ],
  },
  {
    icon: FiAward,
    num: "02",
    tag: "Branding",
    title: "Logos & Brand Identity",
    text: "A distinct visual identity that makes your business look established and memorable across social media, letterheads, and physical signage.",
    points: [
      "Primary & secondary logo packages",
      "Color palettes & font pairing rules",
      "Letterhead, invoices & business cards",
      "Social media profile & cover templates",
    ],
  },
  {
    icon: FiLayers,
    num: "03",
    tag: "Design",
    title: "UI/UX & Mobile App Design",
    text: "We design how your software or website will look and feel before coding begins, so you can test user flows and make adjustments early.",
    points: [
      "Interactive Figma wireframes",
      "User-friendly mobile navigation",
      "Checkout & signup flow optimization",
      "Clickable prototypes for client approval",
    ],
  },
  {
    icon: FiVideo,
    num: "04",
    tag: "Media",
    title: "Video Editing & Social Content",
    text: "Short-form video edits, promotional clips, and product reels formatted for Instagram, TikTok, and corporate presentations.",
    points: [
      "Product showcase reels",
      "Clean subtitles & motion graphics",
      "Sound design & audio leveling",
      "Vertical formats for mobile feeds",
    ],
  },
  {
    icon: FiPenTool,
    num: "05",
    tag: "Collateral",
    title: "Graphic Design & Print Media",
    text: "Professional brochures, roll-up banners, event flyers, and proposal pitch decks prepared for high-resolution print or digital sharing.",
    points: [
      "Company profiles & investor pitch decks",
      "Roll-up banners & billboard artwork",
      "Flyers, event badges & brochures",
      "Print-ready CMYK files for your printer",
    ],
  },
];

const pillars = [
  {
    title: "Custom Built, Zero Bloat",
    desc: "We don't use heavy WordPress themes stuffed with 40 plugins. We write clean code that loads fast even on slow mobile connections.",
  },
  {
    title: "Designed for Phones First",
    desc: "Most of your clients in Accra will visit from a smartphone. Every button, menu, and image is tested on real mobile devices.",
  },
  {
    title: "You Own Everything",
    desc: "Your domain, code, and graphics belong to you. We don't hold your business hostage with hidden renewal fees.",
  },
  {
    title: "Accra-Based Team",
    desc: "Need to make changes or discuss a new feature? You can call us, chat on WhatsApp, or meet with us directly in Accra.",
  },
];

const projectHighlights = [
  {
    image: techStoreImg,
    title: "Phil's IT Store & Commerce Platform",
    category: "web",
    badge: "Web Application",
    description:
      "A complete e-commerce platform with live product filtering, dynamic variants, admin inventory management, and mobile-friendly checkout.",
  },
  {
    image: productCampaign,
    title: "Product Visual Direction",
    category: "brand",
    badge: "Art Direction",
    description:
      "Studio photography and product presentation guidelines created for social media ads and retail marketing.",
  },
  {
    image: Culturecampaign,
    title: "Brand Film & Social Campaign",
    category: "media",
    badge: "Video & Motion",
    description:
      "Short-form social storytelling and promotional reels prepared for multi-channel digital distribution.",
  },
  {
    image: Consumer,
    title: "Consumer Brand Identity Package",
    category: "brand",
    badge: "Identity Design",
    description:
      "Logo suite, typography system, and packaging mockups designed for an Accra retail consumer brand.",
  },
];

const steps = [
  {
    num: "01",
    name: "Scope & Discussion",
    text: "We sit down or hop on a call to understand what you need built, your timeline, and your budget.",
  },
  {
    num: "02",
    name: "Design & Preview",
    text: "We create visual mockups of the pages and brand assets so you can see exactly how it will look.",
  },
  {
    num: "03",
    name: "Development & Testing",
    text: "We write clean code, hook up your database, and test across iPhones, Androids, and laptops.",
  },
  {
    num: "04",
    name: "Launch & Handover",
    text: "We connect your domain, set up your business emails, and show you how to manage content yourself.",
  },
];

const CreativeStudio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const displayedProjects =
    activeCategory === "all"
      ? projectHighlights
      : projectHighlights.filter((p) => p.category === activeCategory);

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
      setError("Could not send your request. Please try again or reach out on WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-[#e8ecf2] font-sans selection:bg-blue-600 selection:text-white">
      {/* ─────────────────────────────────────────────────────────────
          1. DEDICATED BESPOKE NAVBAR (NO SHOPPING CART)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#090b10]/95 backdrop-blur-md border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-sm text-white">
              P
            </span>
            <div>
              <span className="text-lg font-bold tracking-tight text-white block leading-none">
                Phil's-IT
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mt-0.5">
                Websites & Creative Studio
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#services" className="hover:text-white transition">
              What We Build
            </a>
            <a href="#work" className="hover:text-white transition">
              Our Work
            </a>
            <a href="#process" className="hover:text-white transition">
              How It Works
            </a>
            <Link
              to="/services/it-services"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <span>IT Support</span>
              <FiArrowUpRight size={13} />
            </Link>
            <Link
              to="/services/workspace-transformation"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <span>Workspace & Cabling</span>
              <FiArrowUpRight size={13} />
            </Link>
            <Link to="/shop" className="text-slate-400 hover:text-white transition">
              Tech Store ↗
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
            >
              <span>Start a Project</span>
              <FiArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. AUTHENTIC HUMAN HERO SECTION (NO AURORA BLURS, NO FAKE METRICS)
      ───────────────────────────────────────────────────────────── */}
      <section className="border-b border-white/10 px-6 py-16 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Direct, Honest Messaging */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-slate-300 mb-6">
                <span>Web Design & Brand Identity in Accra</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]">
                We build websites that actually help your business grow.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
                Whether you need an online store to sell products, a clean website for your company, or a fresh brand identity, we handle the design and write the code from start to finish.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
                >
                  <span>Talk to Us About Your Project</span>
                  <FiArrowRight size={15} />
                </a>
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                >
                  See Work We've Done
                </a>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {pillars.map((p) => (
                  <div key={p.title}>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">{p.title}</h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Actual Showcase of Real Work (Not a fake browser mockup) */}
            <div className="lg:col-span-5">
              <div className="border border-white/15 rounded-xl bg-[#0e121a] p-5 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400">
                  <span className="font-semibold text-white">Featured Project</span>
                  <span>Phil's IT Consult Store</span>
                </div>

                <div className="mt-4 rounded-lg overflow-hidden border border-white/10 bg-black aspect-[16/10] relative group">
                  <img
                    src={techStoreImg}
                    alt="E-commerce store built by Phil's IT Consult"
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Link
                      to="/shop"
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded shadow-lg"
                    >
                      View Live Store ↗
                    </Link>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">E-Commerce & Inventory Web App</span>
                    <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded font-medium">
                      Built in Accra
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    Custom web store engineered with product variant selection, shopping cart state, and an admin management portal.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-300">
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">React</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">Tailwind CSS</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">PostgreSQL</span>
                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded">Express API</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WHAT WE BUILD (SERVICES / CAPABILITIES)
      ───────────────────────────────────────────────────────────── */}
      <section id="services" className="border-b border-white/10 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Our Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
              Everything you need to look professional online.
            </h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">
              We focus on practical deliverables that solve real problems: attracting clients, showcasing your work, and making it easy to buy from you.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.title}
                  className="rounded-xl border border-white/10 bg-[#0e121a] p-7 flex flex-col justify-between hover:border-blue-500/50 transition duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Icon size={20} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        {service.num}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                      {service.text}
                    </p>

                    <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                      {service.points.map((pt) => (
                        <div key={pt} className="flex items-start gap-2 text-xs text-slate-300">
                          <FiCheck className="text-blue-400 shrink-0 mt-0.5" size={13} />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#contact"
                    className="mt-6 pt-4 border-t border-white/10 text-xs font-semibold text-blue-400 hover:text-white flex items-center justify-between"
                  >
                    <span>Request this service</span>
                    <FiArrowRight size={13} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. OUR WORK (PORTFOLIO SHOWCASE)
      ───────────────────────────────────────────────────────────── */}
      <section id="work" className="border-b border-white/10 px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Selected Work
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
                Recent projects and designs.
              </h2>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "All Work" },
                { id: "web", label: "Websites & Stores" },
                { id: "brand", label: "Branding" },
                { id: "media", label: "Media" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveCategory(f.id)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition cursor-pointer ${
                    activeCategory === f.id
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {displayedProjects.map((project) => (
              <div
                key={project.title}
                className="rounded-xl border border-white/10 bg-[#0e121a] overflow-hidden group hover:border-white/20 transition"
              >
                <div className="h-72 w-full overflow-hidden bg-black relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider border border-white/15">
                      {project.badge}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. HOW IT WORKS (NO JARGON, REAL PROCESS)
      ───────────────────────────────────────────────────────────── */}
      <section id="process" className="border-b border-white/10 px-6 py-20 lg:px-10 bg-white/[0.01]">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Simple Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
              How we work together.
            </h2>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              No endless meetings or confusing technical language. Just steady progress from idea to finished website.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.num}
                className="p-6 rounded-xl border border-white/10 bg-[#0e121a]"
              >
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">
                  Step {step.num}
                </span>
                <h3 className="text-base font-bold text-white mt-3">{step.name}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. CONTACT / PROJECT INQUIRY FORM
      ───────────────────────────────────────────────────────────── */}
      <section id="contact" className="px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Start a Conversation
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
                Have a project in mind? Let's talk.
              </h2>
              <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                Tell us what you want to build. We'll get back to you with a clear cost estimate and timeline.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <FiPhone className="text-blue-400" />
                  <span>Call or WhatsApp: +233 24 000 0000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <FiMail className="text-blue-400" />
                  <span>Email: hello@philsitconsult.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300">
                  <FiMapPin className="text-blue-400" />
                  <span>Accra, Ghana</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-white/10 bg-[#0e121a] p-6 sm:p-9 shadow-xl space-y-4"
              >
                {submitted && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-md text-xs sm:text-sm font-semibold flex items-center gap-2">
                    <FiCheckCircle className="text-emerald-400 shrink-0" size={18} />
                    <span>Thanks! We've received your project details and will be in touch shortly.</span>
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
                      placeholder="e.g. Kwame Mensah"
                      className="w-full bg-[#090b10] border border-white/15 focus:border-blue-500 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Company / Brand Name
                    </label>
                    <input
                      name="company"
                      placeholder="e.g. Mensah Logistics"
                      className="w-full bg-[#090b10] border border-white/15 focus:border-blue-500 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
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
                      placeholder="kwame@example.com"
                      className="w-full bg-[#090b10] border border-white/15 focus:border-blue-500 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
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
                      className="w-full bg-[#090b10] border border-white/15 focus:border-blue-500 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    What do you need built? *
                  </label>
                  <select
                    name="service"
                    defaultValue="Custom Websites & Online Stores"
                    className="w-full bg-[#090b10] border border-white/15 focus:border-blue-500 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition cursor-pointer"
                  >
                    {services.map((s) => (
                      <option key={s.title} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Complete Brand + Website Package">
                      Complete Brand + Website Package
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Tell us a bit about what you want *
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Briefly describe what your business does, any features you need, or reference websites you like..."
                    className="w-full bg-[#090b10] border border-white/15 focus:border-blue-500 rounded-md px-3.5 py-2.5 text-xs text-white outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <FiSend size={14} />
                  <span>{sending ? "Sending..." : "Submit Project Inquiry"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CROSS-SERVICE CONNECTION CARDS
      ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0a0d14] px-6 py-14 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              More from Phil's-IT Consult
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Explore our other capabilities
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <Link
              to="/services/it-services"
              className="p-6 rounded-xl border border-white/10 bg-[#07090e] hover:border-blue-500/60 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                  Technical Support
                </span>
                <h4 className="text-base font-bold text-white mt-2 group-hover:text-blue-400 transition">
                  Managed IT Services
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  On-site hardware repairs, computer maintenance, office Wi-Fi troubleshooting, and cybersecurity for Accra businesses.
                </p>
              </div>
              <span className="mt-5 text-xs font-bold text-slate-300 inline-flex items-center gap-1.5 group-hover:text-blue-400 transition">
                <span>View IT Services</span>
                <FiArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/services/workspace-transformation"
              className="p-6 rounded-xl border border-white/10 bg-[#07090e] hover:border-cyan-500/60 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                  Office Infrastructure
                </span>
                <h4 className="text-base font-bold text-white mt-2 group-hover:text-cyan-300 transition">
                  Workspace Transformation
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Structured Cat6 network cabling, high-density mesh Wi-Fi, smart conference room AV, and clean server rack installation.
                </p>
              </div>
              <span className="mt-5 text-xs font-bold text-slate-300 inline-flex items-center gap-1.5 group-hover:text-cyan-400 transition">
                <span>View Office Cabling</span>
                <FiArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/shop"
              className="p-6 rounded-xl border border-white/10 bg-[#07090e] hover:border-emerald-500/60 transition group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                  Hardware & Equipment
                </span>
                <h4 className="text-base font-bold text-white mt-2 group-hover:text-emerald-400 transition">
                  Phil's-IT Tech Store
                </h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Browse quality tested laptops, monitors, desktop towers, networking gear, and tech accessories with local warranty.
                </p>
              </div>
              <span className="mt-5 text-xs font-bold text-slate-300 inline-flex items-center gap-1.5 group-hover:text-emerald-400 transition">
                <span>Browse Tech Store</span>
                <FiArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. DEDICATED CLEAN FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 bg-[#07090e] py-8">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 lg:px-10 text-xs text-slate-500">
          <div>
            <span className="font-bold text-white text-sm block">Phil's-IT Consult</span>
            <span className="text-slate-400">Websites, Software & Brand Identity • Accra, Ghana</span>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-medium text-slate-400">
            <a href="#services" className="hover:text-white transition">Capabilities</a>
            <a href="#work" className="hover:text-white transition">Our Work</a>
            <Link to="/services/it-services" className="hover:text-white transition">IT Support</Link>
            <Link to="/services/workspace-transformation" className="hover:text-white transition">Office Cabling</Link>
            <Link to="/shop" className="hover:text-white transition">Tech Store</Link>
          </div>

          <p>© {new Date().getFullYear()} Phil's-IT Consult. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreativeStudio;
