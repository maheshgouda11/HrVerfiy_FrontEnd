import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Don't show header on login or signup page
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-50"
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              HRVerify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {["Home", "About", "Candidate", "Company"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`relative font-medium transition-colors duration-200 group ${
                  (item === "Home" && location.pathname === "/") ||
                  (item !== "Home" &&
                    location.pathname === `/${item.toLowerCase()}`)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {item}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-blue-600 transition-all duration-200 ${
                    (item === "Home" && location.pathname === "/") ||
                    (item !== "Home" &&
                      location.pathname === `/${item.toLowerCase()}`)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Signup
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden bg-white border-t border-slate-200"
        >
          <div className="py-4 space-y-4">
            {["Home", "About", "Candidate", "Company"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`block px-4 py-2 font-medium transition-colors ${
                  (item === "Home" && location.pathname === "/") ||
                  (item !== "Home" &&
                    location.pathname === `/${item.toLowerCase()}`)
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            ))}

            {/* Mobile Auth Buttons */}
            <Link
              to="/login"
              className="mx-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="mx-4 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Signup
            </Link>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
}
