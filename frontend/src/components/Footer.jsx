import { FiFacebook, FiTwitter, FiInstagram, FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/PHILS CONSULT.jpg.jpeg";

const footerLinks = [
  {
    title: "Tech Store",
    links: [
      { name: "All Products", path: "/shop" },
      { name: "Hot Deals", path: "/shop" },
      { name: "Laptops & Desktops", path: "/shop" },
      { name: "Accessories & Audio", path: "/shop" },
      { name: "Shopping Cart", path: "/cart" },
    ],
  },
  {
    title: "IT Services",
    links: [
      { name: "Enterprise IT Support", path: "/services/it-services" },
      { name: "Network Infrastructure", path: "/services/it-services" },
      { name: "Web & Design Studio", path: "/services/creative-studio" },
      { name: "Workspace Transformation", path: "/services" },
      { name: "Request a Quote", path: "/services" },
    ],
  },
  {
    title: "Customer Portal",
    links: [
      { name: "My Account", path: "/auth" },
      { name: "Order Tracking", path: "/cart" },
      { name: "Help Desk", path: "#" },
      { name: "Return Policy", path: "#" },
      { name: "Admin Dashboard", path: "/admin" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-12">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-10 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="PHIL'S-IT CONSULT"
                className="h-11 w-11 object-cover rounded-full border border-blue-500/30"
              />
              <div className="font-extrabold leading-tight">
                <span className="text-blue-500 text-base sm:text-lg tracking-tight block">
                  PHIL'S-IT
                </span>
                <span className="text-white text-xs sm:text-sm tracking-wider uppercase font-bold block">
                  CONSULT
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your trusted partner for high-performance technology hardware, smart devices, and enterprise IT consulting solutions.
            </p>

            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-center gap-2.5 text-slate-300">
                <FiPhone className="text-blue-400 shrink-0" size={14} />
                <span className="font-semibold">030 397 2421</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <FiMail className="text-blue-400 shrink-0" size={14} />
                <span>support@philsitconsult.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <FiMapPin className="text-blue-400 shrink-0" size={14} />
                <span>Greater Accra, Ghana</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
              >
                <FiFacebook size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
              >
                <FiTwitter size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
              >
                <FiInstagram size={14} />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-xs sm:text-sm font-bold uppercase tracking-wider mb-3.5">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-xs text-slate-400 hover:text-blue-400 transition inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Phil’s IT Consult. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-slate-400">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
