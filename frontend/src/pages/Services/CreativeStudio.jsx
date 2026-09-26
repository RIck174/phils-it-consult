import { useState } from "react";
import {
  FiArrowRight,
  FiAward,
  FiPenTool,
  FiVideo,
  FiShare2,
  FiMonitor,
  FiCheckCircle,
  FiChevronDown,
  FiSend,
} from "react-icons/fi";
import productCampaign from "../../assets/WhatsApp Image 2026-09-17 at 9.46.34 PM.jpeg";
import Culturecampaign from "../../assets/WhatsApp Image 12026-09-17 at 9.46.34 PM.jpeg";
import Consumer from "../../assets/WhatsApp Image2 2026-09-17 at 9.46.34 PM.jpeg";
import fouth from "../../assets/TechStore1.jpg";

const services = [
  {
    icon: FiAward,
    num: "01",
    title: "Brand Identity",
    text: "Logos, visual systems and practical brand guidelines built for consistent use.",
  },
  {
    icon: FiPenTool,
    num: "02",
    title: "Graphic Design",
    text: "Campaign, print and digital assets that communicate without visual clutter.",
  },
  {
    icon: FiVideo,
    num: "03",
    title: "Video Editing",
    text: "Focused edits, motion graphics and campaign films prepared for every screen.",
  },
  {
    icon: FiShare2,
    num: "04",
    title: "Social Content",
    text: "A repeatable content system your team can publish with confidence.",
  },
  {
    icon: FiMonitor,
    num: "05",
    title: "Web Design",
    text: "Fast, precise websites designed around real customer actions and enquiries.",
  },
];

const stats = [
  { num: "01", label: "Strategy-led" },
  { num: "02", label: "Built in Accra" },
  { num: "03", label: "Multi-channel" },
  { num: "04", label: "Production-ready" },
];

const gallery = [
  {
    image: productCampaign,
    title: "Product campaign",
    tag: "ART DIRECTION",
  },
  {
    image: Culturecampaign,
    title: "Culture campaign",
    tag: "FILM & SOCIAL",
  },
  {
    image: fouth,
    title: "Consumer brand system",
    tag: "IDENTITY & DIGITAL",
  },
  {
    image: Consumer,
    title: "Consumer brand system",
    tag: "IDENTITY & DIGITAL",
  },
];

const CreativeStudio = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-blue-500">
            Creative Systems / Digital Execution
          </p>
          <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Creative work built with{" "}
            <span className="text-gray-500">technical precision.</span>
          </h1>
          <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <p className="max-w-xl text-lg leading-8 text-gray-400">
              Phil's-IT Consult helps Accra businesses shape clear brands,
              campaigns and digital experiences—without the agency theatre.
            </p>
            <a
              href="#request"
              className="inline-flex w-fit items-center gap-3 rounded-sm bg-blue-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Request This Service <FiArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-px border border-white/10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.num} className="px-5 py-4">
                <span className="text-xs font-bold text-blue-500">
                  {stat.num}
                </span>
                <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            {/* Left column: heading only */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                Capabilities / 05
              </p>
              <h2 className="mt-4 text-4xl font-bold tracking-tight">
                Services we offer
              </h2>
            </div>

            {/* Right column: description + cards grid together */}
            <div>
              <p className="max-w-xl text-base leading-7 text-gray-400">
                A focused team across identity, content and digital design. Each
                engagement is scoped around the work your business actually
                needs.
              </p>

              <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
                {services.map(({ icon: Icon, num, title, text }, index) => (
                  <div
                    key={title}
                    className={
                      index === 0
                        ? "group col-span-2 border border-transparent bg-black p-7 transition hover:border-blue-500"
                        : "group border border-transparent bg-black p-7 transition hover:border-blue-500"
                    }
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-blue-500 transition group-hover:border-blue-500 group-hover:text-blue-500">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="text-xs text-gray-500 transition">
                        {num}
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-bold">{title}</h3>
                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
                Selected Work / Direction Studies
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight">
                Work with a clear signal.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-gray-400">
              Campaign, culture and consumer-brand concepts showing how one
              system can work across formats.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((item) => (
              <div key={item.title}>
                <div className="h-72 w-full overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-bold">{item.title}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="request"
        className="border-b border-white/10 px-6 py-20 lg:px-10 lg:py-28"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
              Start a Project
            </p>
            <h2 className="mt-5 max-w-md text-4xl font-bold tracking-tight">
              Tell us what needs to be made.
            </h2>
            <p className="mt-5 max-w-sm text-base leading-7 text-gray-400">
              Send the rough brief. Our Accra team will review the scope and
              recommend a practical way forward.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="border border-white/10 p-6 sm:p-9"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Company Name
                <input
                  required
                  name="company"
                  className="mt-2 w-full border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  placeholder="e.g. Akwaaba Foods"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Contact Person
                <input
                  required
                  name="contact"
                  className="mt-2 w-full border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  placeholder="Your full name"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  placeholder="you@company.com"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400">
                Phone
                <input
                  required
                  type="tel"
                  name="phone"
                  className="mt-2 w-full border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  placeholder="+233 00 000 0000"
                />
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 sm:col-span-2">
                Service Type
                <div className="relative">
                  <select
                    name="service"
                    defaultValue=""
                    required
                    className="mt-2 w-full appearance-none border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none focus:border-blue-500"
                  >
                    <option value="" disabled className="text-black">
                      Choose a creative service
                    </option>
                    {services.map((service) => (
                      <option key={service.title} className="text-black">
                        {service.title}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-gray-500" />
                </div>
              </label>
              <label className="text-xs font-bold uppercase tracking-wide text-gray-400 sm:col-span-2">
                Message
                <textarea
                  required
                  name="message"
                  rows={4}
                  className="mt-2 w-full resize-none border border-white/10 bg-transparent px-3 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                  placeholder="What are you making, who is it for, and when do you need it?"
                />
              </label>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex w-fit items-center gap-3 bg-blue-500 px-6 py-4 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                <FiSend className="h-4 w-4" />{" "}
                {submitted ? "Request received" : "Send service request"}{" "}
                <FiArrowRight className="h-4 w-4" />
              </button>
              {submitted && (
                <p className="flex items-center gap-2 text-sm text-blue-500">
                  <FiCheckCircle className="h-4 w-4" /> Thanks — we'll be in
                  touch soon.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-500">
            More from Phil's-IT Consult
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Explore our other services.
          </h2>
          <div className="mt-10 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
            <a
              href="/services/it-services"
              className="group flex min-h-48 flex-col justify-between bg-black p-7 transition hover:bg-blue-500"
            >
              <span className="text-xs font-bold text-blue-500 transition group-hover:text-white">
                01
              </span>
              <div>
                <h3 className="text-xl font-bold">IT Services</h3>
                <p className="mt-2 max-w-md text-sm text-gray-400 transition group-hover:text-white/90">
                  Reliable support, networks and systems for productive Ghanaian
                  teams.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Learn More <FiArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
            <a
              href="/services/workspace-transformation"
              className="group flex min-h-48 flex-col justify-between bg-black p-7 transition hover:bg-blue-500"
            >
              <span className="text-xs font-bold text-blue-500 transition group-hover:text-white">
                02
              </span>
              <div>
                <h3 className="text-xl font-bold">Workspace Transformation</h3>
                <p className="mt-2 max-w-md text-sm text-gray-400 transition group-hover:text-white/90">
                  Better spaces, smarter tools and practical workflows built
                  around your people.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
                  Learn More <FiArrowRight className="h-4 w-4" />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="font-bold text-white">Phil's-IT Consult.</p>
          <p>Technology, creative and workspaces — from Accra.</p>
          <p>© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
};

export default CreativeStudio;
