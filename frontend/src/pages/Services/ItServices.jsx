import { useState } from "react";
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
} from "react-icons/fi";

const features = [
  {
    icon: FiWifi,
    title: "Network setup",
    text: "Reliable office Wi-Fi, structured cabling and secure connectivity for your team.",
  },
  {
    icon: FiHeadphones,
    title: "Software support",
    text: "Keep essential business applications working smoothly, with clear guidance for staff.",
  },
  {
    icon: FiBriefcase,
    title: "IT consulting",
    text: "Straightforward advice on technology decisions, upgrades and office moves.",
  },
  {
    icon: FiHardDrive,
    title: "Hardware troubleshooting",
    text: "Practical help with desktops, laptops, printers and the equipment your work depends on.",
  },
  {
    icon: FiLock,
    title: "Cybersecurity basics",
    text: "Foundational protection for devices, accounts, backups and everyday business data.",
  },
  {
    icon: FiTool,
    title: "System maintenance",
    text: "Proactive checks that reduce downtime and extend the life of your systems.",
  },
];

const reasons = [
  {
    icon: FiMapPin,
    title: "Accra-based and responsive",
    text: "We understand the pace of Ghanaian businesses and can be close when hands-on help matters.",
  },
  {
    icon: FiAward,
    title: "Advice you can act on",
    text: "No confusing jargon or oversized solutions — just clear recommendations matched to your needs.",
  },
  {
    icon: FiClock,
    title: "Built for continuity",
    text: "We focus on dependable systems that keep your people productive, today and as you grow.",
  },
];

const ItServices = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8fc] text-[#10253f]">
      <section
        id="top"
        className="relative border-b border-[#d9e3ee] bg-[#0a3562] text-white"
      >
        <div className="mx-auto grid max-w-7xl items-end gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-28">
          <div className="relative z-10 max-w-3xl">
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
                On-site and remote support
              </span>
            </div>
          </div>
          <div className="relative hidden min-h-[350px] lg:block">
            <div className="absolute right-0 top-0 h-full w-[78%] border-l border-t border-[#5b8db9] bg-[#0d416f] p-8">
              <div className="flex items-center justify-between border-b border-blue-300/20 pb-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-200">
                <span>Support desk</span>
                <span className="flex items-center gap-2 text-[#a7dfc1]">
                  <span className="h-2 w-2 rounded-full bg-[#65c891]" />{" "}
                  Available
                </span>
              </div>
              <div className="mt-12 space-y-5">
                <div className="h-3 w-3/4 bg-blue-200/25" />
                <div className="h-3 w-full bg-blue-200/15" />
                <div className="h-3 w-2/3 bg-blue-200/15" />
              </div>
              <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                <span className="text-6xl font-semibold tracking-[-0.06em] text-white/90">
                  24/7
                </span>
                <span className="max-w-[120px] text-right text-xs leading-5 text-blue-200">
                  clear answers when your team needs them
                </span>
              </div>
            </div>
            <div className="absolute bottom-8 left-0 w-48 border-l-4 border-[#f4b942] bg-white p-5 text-[#10253f] shadow-xl">
              <p className="text-3xl font-semibold tracking-tight">
                Built to last.
              </p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                Technology that supports your business, not the other way
                around.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-3 w-1/3 bg-[#f4b942]" />
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
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
        <div className="grid border-l border-t border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="group border-b border-r border-slate-200 p-7 transition hover:bg-[#0a3562] hover:text-white"
            >
              <Icon className="h-7 w-7 text-[#1877c9] transition group-hover:text-[#f4b942]" />
              <h3 className="mt-14 text-lg font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-500 transition group-hover:text-blue-100">
                {text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#e7eff7]">
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
              Share a few details and a member of our Accra team will get back
              to you with a clear next step.
            </p>
            <div className="mt-12 space-y-4 text-sm text-blue-100">
              <p className="flex items-center gap-3">
                <FiPhone className="h-4 w-4 text-[#f4b942]" /> +233 24 000 0000
              </p>
              <p className="flex items-center gap-3">
                <FiMail className="h-4 w-4 text-[#f4b942]" />{" "}
                hello@philsitconsult.com
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 text-[#10253f] sm:p-9"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="text-sm font-semibold">
                Company Name
                <input
                  required
                  name="company"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="Your company"
                />
              </label>
              <label className="text-sm font-semibold">
                Contact Person
                <input
                  required
                  name="contact"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="Your name"
                />
              </label>
              <label className="text-sm font-semibold">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="you@company.com"
                />
              </label>
              <label className="text-sm font-semibold">
                Phone
                <input
                  required
                  type="tel"
                  name="phone"
                  className="mt-2 w-full border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="+233 ..."
                />
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Service Type
                <div className="relative">
                  <select
                    name="service"
                    defaultValue=""
                    className="mt-2 w-full appearance-none border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none focus:border-[#1877c9]"
                    required
                  >
                    <option value="" disabled>
                      Select a service
                    </option>
                    {features.map((feature) => (
                      <option key={feature.title}>{feature.title}</option>
                    ))}
                  </select>
                  <FiChevronDown className="pointer-events-none absolute right-1 top-4 h-4 w-4 text-slate-400" />
                </div>
              </label>
              <label className="text-sm font-semibold sm:col-span-2">
                Message
                <textarea
                  required
                  name="message"
                  rows={3}
                  className="mt-2 w-full resize-none border-b border-slate-300 bg-transparent px-0 py-3 text-sm outline-none transition focus:border-[#1877c9]"
                  placeholder="What would you like help with?"
                />
              </label>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex w-fit items-center gap-3 bg-[#f4b942] px-6 py-4 text-sm font-bold text-[#10253f] transition hover:bg-[#ffd16a]"
              >
                <FiSend className="h-4 w-4" />{" "}
                {submitted ? "Request received" : "Send request"}
              </button>
              {submitted && (
                <p className="flex items-center gap-2 text-sm text-[#1877c9]">
                  <FiCheckCircle className="h-4 w-4" /> Thanks — we'll be in
                  touch soon.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="font-bold text-[#0a3562]">Phil's-IT Consult</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <span>Accra, Ghana</span>
            <span>hello@philsitconsult.com</span>
            <span>+233 24 000 0000</span>
          </div>
          <p>© {new Date().getFullYear()} Phil's-IT Consult</p>
        </div>
      </footer>
    </main>
  );
};

export default ItServices;
