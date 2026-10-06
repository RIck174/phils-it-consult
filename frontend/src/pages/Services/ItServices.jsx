import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/api";
import {
  FiArrowRight,
  FiAward,
  FiBriefcase,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiHardDrive,
  FiHeadphones,
  FiLock,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiTool,
  FiWifi,
  FiCalendar,
  FiCheck,
  FiArrowUpRight,
} from "react-icons/fi";

const features = [
  {
    icon: FiWifi,
    title: "Network setup",
    text: "Reliable office Wi-Fi, structured cabling and secure connectivity for your team.",
    points: ["Cat6 structured cabling", "Mesh Wi-Fi routers", "Switch & router setup"],
  },
  {
    icon: FiHeadphones,
    title: "Software support",
    text: "Keep essential business applications working smoothly, with clear guidance for staff.",
    points: ["OS & app troubleshooting", "Email configuration", "Quick remote assistance"],
  },
  {
    icon: FiBriefcase,
    title: "IT consulting",
    text: "Straightforward advice on technology decisions, upgrades and office moves.",
    points: ["Hardware procurement", "Office relocation planning", "Budget-friendly tech roadmaps"],
  },
  {
    icon: FiHardDrive,
    title: "Hardware troubleshooting",
    text: "Practical help with desktops, laptops, printers and the equipment your work depends on.",
    points: ["Laptop & PC repairs", "RAM & SSD speed upgrades", "Network printer setup"],
  },
  {
    icon: FiLock,
    title: "Cybersecurity basics",
    text: "Foundational protection for devices, accounts, backups and everyday business data.",
    points: ["Antivirus & firewall checks", "Daily cloud & local backups", "Safe staff password habits"],
  },
  {
    icon: FiTool,
    title: "System maintenance",
    text: "Proactive checks that reduce downtime and extend the life of your systems.",
    points: ["Routine hardware cleaning", "Software health checks", "Preventive disk audits"],
  },
];

const reasons = [
  {
    icon: FiMapPin,
    title: "Accra-based and responsive",
    text: "We understand the pace of Ghanaian businesses. Give us a call, agree on a date that works for your team, and we show up on-site.",
  },
  {
    icon: FiAward,
    title: "Advice you can act on",
    text: "No confusing jargon or oversized solutions — just clear recommendations matched to your actual business needs.",
  },
  {
    icon: FiClock,
    title: "Built for continuity",
    text: "We focus on dependable systems that keep your people productive, today and as you grow.",
  },
];

const faqs = [
  {
    q: "How do we schedule an on-site visit?",
    a: "It's simple: send your details through our request form or call us directly. We discuss your issue, pick a date and time that fits your working hours, and our technicians arrive at your office.",
  },
  {
    q: "Do you offer remote support as well?",
    a: "Yes. Many software glitches, email connection issues, and printer drivers can be solved remotely via AnyDesk or TeamViewer without waiting for a physical visit.",
  },
  {
    q: "Can you help set up an entire new office?",
    a: "Yes. From laying structured network cables to setting up Wi-Fi access points, printers, and individual employee laptops, we handle end-to-end office tech setups.",
  },
  {
    q: "Can we also buy computers and equipment through you?",
    a: "Yes! Through Phil's IT Store, we source quality tested laptops, desktop towers, monitors, and networking gear with local warranty.",
  },
];

const ItServices = () => {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

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
      setError("Could not send your request. Please try again or call us directly.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8fc] text-[#10253f] font-sans selection:bg-[#f4b942] selection:text-[#10253f]">
      {/* ─────────────────────────────────────────────────────────────
          1. DEDICATED ARCHITECTURAL IT NAVBAR (NO E-COMMERCE CART)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0a3562] text-white border-b border-[#1b4b7a] shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="h-8 w-1.5 bg-[#f4b942]" />
            <div>
              <span className="text-xl font-bold tracking-tight text-white block leading-none">
                Phil's-IT Consult
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8ec7f2] block mt-0.5">
                IT Support & Consulting
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.16em] text-blue-100">
            <a href="#services" className="hover:text-[#f4b942] transition">
              What We Do
            </a>
            <a href="#why-us" className="hover:text-[#f4b942] transition">
              Why Us
            </a>
            <a href="#faq" className="hover:text-[#f4b942] transition">
              FAQ
            </a>
            <Link
              to="/services/workspace-transformation"
              className="text-[#8ec7f2] hover:text-white transition flex items-center gap-1"
            >
              <span>Workspace & Cabling</span>
              <FiArrowUpRight size={13} />
            </Link>
            <Link
              to="/services/creative-studio"
              className="text-[#8ec7f2] hover:text-white transition flex items-center gap-1"
            >
              <span>Creative Studio</span>
              <FiArrowUpRight size={13} />
            </Link>
            <Link
              to="/shop"
              className="text-blue-200 hover:text-white transition"
            >
              Tech Store ↗
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="tel:+233240000000"
              className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#8ec7f2]"
            >
              <FiPhone className="text-[#f4b942]" /> +233 24 000 0000
            </a>
            <a
              href="#request"
              className="inline-flex items-center gap-2 rounded-sm bg-[#f4b942] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#10253f] transition hover:bg-[#ffd16a]"
            >
              <span>Request Support</span>
              <FiArrowRight size={13} />
            </a>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. EDITORIAL HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section
        id="top"
        className="relative border-b border-[#d9e3ee] bg-[#0a3562] text-white"
      >
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative z-10 max-w-3xl"
          >
            <p className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-[#8ec7f2]">
              <span className="h-px w-10 bg-[#8ec7f2]" />
              IT Services / Accra
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Reliable IT support for the work that matters.
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100">
              Phil's-IT Consult helps Accra businesses keep their technology
              dependable, secure and ready for the next working day.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#request"
                className="inline-flex w-fit items-center gap-3 rounded-sm bg-[#f4b942] px-6 py-4 text-sm font-bold text-[#10253f] transition hover:bg-[#ffd16a]"
              >
                Request This Service <FiArrowRight className="h-4 w-4" />
              </a>
              <span className="text-sm text-blue-200">
                On-site and remote support across Accra
              </span>
            </div>
          </motion.div>

          {/* Right Column: Architectural Desk Card with Honest Scheduling Workflow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative hidden min-h-[380px] lg:block"
          >
            <div className="absolute right-0 top-0 h-full w-[82%] border-l border-t border-[#5b8db9] bg-[#0d416f] p-8 shadow-xl">
              <div className="flex items-center justify-between border-b border-blue-300/20 pb-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                <span>Support desk</span>
                <span className="flex items-center gap-2 text-[#a7dfc1]">
                  <span className="h-2 w-2 rounded-full bg-[#65c891]" />{" "}
                  Available for booking
                </span>
              </div>

              {/* Realistic 3-Step Scheduling Workflow */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-[#f4b942] mt-0.5">01</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Reach Out
                    </h4>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Send your inquiry or call us about what needs fixing or configuring.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-[#f4b942] mt-0.5">02</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Agree on a Date
                    </h4>
                    <p className="text-xs text-blue-200 mt-0.5">
                      We coordinate our schedules and agree on a convenient day and time.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-xs font-bold text-[#f4b942] mt-0.5">03</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      On-Site Resolution
                    </h4>
                    <p className="text-xs text-blue-200 mt-0.5">
                      Our technicians show up at your office and resolve the problem properly.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between border-t border-blue-300/20 pt-4">
                <span className="text-3xl font-semibold tracking-[-0.04em] text-white/90">
                  Accra
                </span>
                <span className="max-w-[140px] text-right text-xs leading-5 text-blue-200">
                  hands-on support when your team needs it
                </span>
              </div>
            </div>

            {/* Overlapping White Badge */}
            <div className="absolute bottom-6 left-0 w-52 border-l-4 border-[#f4b942] bg-white p-5 text-[#10253f] shadow-2xl">
              <p className="text-2xl font-semibold tracking-tight">
                Built to last.
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Technology that supports your business, not the other way
                around.
              </p>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 h-2 w-1/3 bg-[#f4b942]" />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. WHAT WE DO (ARCHITECTURAL GRID WITH SUBTLE HOVER LIFT)
      ───────────────────────────────────────────────────────────── */}
      <section id="services" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1877c9]">
              What we do
            </p>
            <h2 className="mt-4 max-w-sm text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#0a3562]">
              The practical support behind productive teams.
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-7 text-slate-600">
            From a new office setup in Accra to the small issue slowing down a
            busy afternoon, our team brings structure, care and technical
            know-how to the everyday.
          </p>
        </div>

        <div className="grid border-l border-t border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-3 shadow-sm">
          {features.map(({ icon: Icon, title, text, points }) => (
            <motion.article
              key={title}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="group border-b border-r border-slate-200 p-8 transition-colors duration-200 hover:bg-[#0a3562] hover:text-white flex flex-col justify-between"
            >
              <div>
                <Icon className="h-7 w-7 text-[#1877c9] transition group-hover:text-[#f4b942]" />
                <h3 className="mt-8 text-lg font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-500 transition group-hover:text-blue-100">
                  {text}
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-100 group-hover:border-blue-300/20 space-y-1.5">
                {points.map((pt) => (
                  <div key={pt} className="flex items-center gap-2 text-xs text-slate-400 group-hover:text-blue-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1877c9] group-hover:bg-[#f4b942]" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. WHY PHIL'S-IT CONSULT
      ───────────────────────────────────────────────────────────── */}
      <section id="why-us" className="bg-[#e7eff7]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-10 lg:py-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1877c9]">
              Why Phil's-IT Consult
            </p>
            <h2 className="mt-4 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em] text-[#0a3562]">
              A calm, capable partner for your technology.
            </h2>
          </div>
          <div className="grid gap-0 border-t border-[#bdd0e2]">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="grid gap-5 border-b border-[#bdd0e2] py-7 sm:grid-cols-[48px_0.8fr_1.2fr] sm:items-start"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a3562] text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-[#0a3562]">{title}</h3>
                <p className="text-sm leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. FAQ ACCORDION SECTION
      ───────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-20 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1877c9]">
            Questions & Answers
          </p>
          <h2 className="mt-3 text-3xl font-semibold text-[#0a3562] tracking-tight">
            How we work with your business.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.q}
                className="border border-slate-200 bg-white rounded-sm overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between text-sm font-bold text-[#0a3562] hover:text-[#1877c9] transition"
                >
                  <span>{faq.q}</span>
                  <FiChevronDown
                    className={`text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#1877c9]" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. START A CONVERSATION (FORM)
      ───────────────────────────────────────────────────────────── */}
      <section id="request" className="bg-[#0a3562] text-white">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.7fr_1.3fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8ec7f2]">
              Start a conversation
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-semibold leading-tight tracking-[-0.04em]">
              Tell us what your business needs.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
              Share a few details. We will review what you need, get in touch, and agree on a convenient date for our team to assist.
            </p>
            <div className="mt-12 space-y-4 text-sm text-blue-100">
              <p className="flex items-center gap-3">
                <FiPhone className="h-4 w-4 text-[#f4b942]" /> +233 24 000 0000
              </p>
              <p className="flex items-center gap-3">
                <FiMail className="h-4 w-4 text-[#f4b942]" />{" "}
                hello@philsitconsult.com
              </p>
              <p className="flex items-center gap-3">
                <FiMapPin className="h-4 w-4 text-[#f4b942]" /> Accra, Ghana
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 text-[#10253f] sm:p-9 shadow-2xl rounded-sm"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Company Name *
                <input
                  required
                  name="company"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="Your company or business"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Contact Person *
                <input
                  required
                  name="contact"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="Your full name"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Email *
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="you@company.com"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-wide text-slate-700">
                Phone / WhatsApp *
                <input
                  required
                  type="tel"
                  name="phone"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="+233 24 000 0000"
                />
              </label>

              <label className="text-xs font-bold uppercase tracking-wide text-slate-700 sm:col-span-2">
                Service Type *
                <div className="relative">
                  <select
                    name="service"
                    defaultValue="Network setup"
                    className="mt-2 w-full appearance-none border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none focus:border-[#1877c9] cursor-pointer"
                    required
                  >
                    {features.map((feature) => (
                      <option key={feature.title} value={feature.title}>
                        {feature.title}
                      </option>
                    ))}
                    <option value="General IT Troubleshooting / Audit">
                      General IT Troubleshooting / Audit
                    </option>
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-1 top-4 h-4 w-4 text-slate-400" />
                </div>
              </label>

              <label className="text-xs font-bold uppercase tracking-wide text-slate-700 sm:col-span-2">
                Tell us about your issue or what needs to be set up *
                <textarea
                  required
                  name="message"
                  rows={3}
                  className="mt-2 w-full resize-none border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="Describe what's happening or when you would like our team to visit..."
                />
              </label>
            </div>

            {error && <p className="text-sm text-red-600 mt-6">{error}</p>}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-fit items-center gap-3 bg-[#f4b942] px-6 py-4 text-sm font-bold text-[#10253f] transition hover:bg-[#ffd16a] disabled:opacity-50"
              >
                <FiSend className="h-4 w-4" />{" "}
                {sending
                  ? "Sending..."
                  : submitted
                    ? "Request received"
                    : "Send request"}
              </button>
              {submitted && (
                <p className="flex items-center gap-2 text-sm text-[#1877c9] font-medium">
                  <FiCheckCircle className="h-4 w-4" /> Thanks! We will be in touch shortly to confirm a time.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. CROSS-SERVICE EXPLORATION (ARCHITECTURAL STYLE)
      ───────────────────────────────────────────────────────────── */}
      <section className="bg-[#e7eff7] border-t border-[#bdd0e2] py-16 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1877c9]">
              More from Phil's-IT Consult
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-[#0a3562]">
              Explore our other capabilities
            </h3>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Link
              to="/services/workspace-transformation"
              className="bg-white border border-[#bdd0e2] p-7 transition hover:border-[#0a3562] group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1877c9] block">
                  Office Infrastructure
                </span>
                <h4 className="mt-2 text-lg font-bold text-[#0a3562] group-hover:text-[#1877c9] transition">
                  Workspace Transformation
                </h4>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Structured Cat6 cabling, high-density office Wi-Fi, and smart boardroom presentation displays across Accra.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0a3562] group-hover:text-[#1877c9]">
                <span>Explore Office Cabling</span>
                <FiArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/services/creative-studio"
              className="bg-white border border-[#bdd0e2] p-7 transition hover:border-[#0a3562] group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1877c9] block">
                  Web & Brand Studio
                </span>
                <h4 className="mt-2 text-lg font-bold text-[#0a3562] group-hover:text-[#1877c9] transition">
                  Websites & Digital Studio
                </h4>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Bespoke business websites, e-commerce web applications, and complete logo and brand identity packages.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0a3562] group-hover:text-[#1877c9]">
                <span>Explore Web Studio</span>
                <FiArrowRight size={13} />
              </span>
            </Link>

            <Link
              to="/shop"
              className="bg-white border border-[#bdd0e2] p-7 transition hover:border-[#0a3562] group flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1877c9] block">
                  Hardware & Devices
                </span>
                <h4 className="mt-2 text-lg font-bold text-[#0a3562] group-hover:text-[#1877c9] transition">
                  Phil's-IT Tech Store
                </h4>
                <p className="mt-2 text-xs leading-5 text-slate-600">
                  Quality tested laptops, business desktop towers, monitors, and networking routers with local warranty.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[#0a3562] group-hover:text-[#1877c9]">
                <span>Browse Tech Store</span>
                <FiArrowRight size={13} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. DEDICATED IT SERVICES FOOTER (CLEAN & NON-DUPLICATIVE)
      ───────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div>
            <p className="font-bold text-[#0a3562] text-base">Phil's-IT Consult</p>
            <p className="text-xs text-slate-500 mt-0.5">Reliable IT support for the work that matters.</p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 font-semibold uppercase tracking-wider">
            <a href="#services" className="hover:text-[#0a3562] transition">What We Do</a>
            <a href="#why-us" className="hover:text-[#0a3562] transition">Why Us</a>
            <a href="#faq" className="hover:text-[#0a3562] transition">FAQ</a>
            <Link to="/services/creative-studio" className="hover:text-[#0a3562] transition">Creative Studio</Link>
            <Link to="/shop" className="hover:text-[#0a3562] transition">Tech Store</Link>
          </div>

          <div className="text-xs text-slate-500 text-left sm:text-right">
            <p>Accra, Ghana • +233 24 000 0000</p>
            <p className="mt-1">© {new Date().getFullYear()} Phil's-IT Consult</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default ItServices;
