import { Link } from "react-router-dom";

const Tabs = () => {
  return (
    <div className="border border-gray-200 rounded-lg w-56 shadow-sm h-fit">
      <p className="px-4 py-3 font-bold text-xs text-gray-500 uppercase tracking-widest border-b">
        EXPLORE
      </p>
      <Link
        className="block px-4 py-3 border-b border-gray-100 text-gray-800 font-medium hover:bg-blue-50 hover:text-gray-700 transition"
        to="/shop"
      >
        Tech Store
      </Link>
      <Link
        className="block px-4 py-3 border-b border-gray-100 text-gray-800 font-medium hover:bg-blue-50 hover:text-gray-700 transition"
        to="/services"
      >
        Creative Studio
      </Link>
      <Link
        className="block px-4 py-3 border-b border-gray-100 text-gray-800 font-medium hover:bg-blue-50 hover:text-gray-700 transition"
        to="/services"
      >
        IT Services
      </Link>
      <Link
        className="block px-4 py-3 border-b border-gray-100 text-gray-800 font-medium hover:bg-blue-50 hover:text-gray-700 transition"
        to="/services"
      >
        Workspace Transformation
      </Link>
    </div>
  );
};
export default Tabs;
