import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from "react-icons/fi";
import { Link } from "react-router-dom";

const columns = [
  {
    title: "Shop",
    links: [
      "All Products",
      "Best Sellers",
      "New Arrivals",
      "Deals",
      "Categories",
    ],
  },
  {
    title: "Customer Service",
    links: [
      "Help Center",
      "Track Order",
      "Returns & Refunds",
      "Shipping Info",
      "Contact Us",
    ],
  },
  {
    title: "Company",
    links: ["About Us", "Careers", "Press", "Blog", "Affiliate Program"],
  },
  {
    title: "Legal",
    links: [
      "Terms & Conditions",
      "Privacy Policy",
      "Refund Policy",
      "Cookie Policy",
    ],
  },
];

const Footer = () => {
  return (
    <div className="px-6 py-4 mb-0">
      <footer className="bg-black text-gray-400 px-6 py-10  rounded-t-3xl">
        <div className="mx-auto max-w-7xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <span className="flex items-center gap-1 text-xl font-bold text-white">
              <span className="text-violet-500">X</span> Example
            </span>
            <p className="text-xs text-gray-500 mt-3 leading-relaxed max-w-xs">
              Your one-stop destination for the latest tech products and
              gadgets. Quality you can trust.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="hover:text-white transition">
                <FiFacebook size={15} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiTwitter size={15} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiInstagram size={15} />
              </a>
              <a href="#" className="hover:text-white transition">
                <FiYoutube size={15} />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-white text-sm font-semibold mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      to="#"
                      className="text-xs text-gray-400 hover:text-white transition"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-7xl border-t border-white/10 mt-8 pt-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Example. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
