import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

/* Animated Burger / Close Icon */
const MenuIcon = ({ open }) => (
  <div className="relative w-6 h-6">
    <span
      className={`absolute h-0.5 w-6 bg-gray-900 dark:bg-gray-100 transition-all duration-300
      ${open ? "rotate-45 top-3" : "top-1"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-gray-900 dark:bg-gray-100 transition-all duration-300
      ${open ? "opacity-0" : "top-3"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-gray-900 dark:bg-gray-100 transition-all duration-300
      ${open ? "-rotate-45 top-3" : "top-5"}`}
    />
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b dark:border-gray-800">
        <div className="flex justify-between items-center px-6 md:px-10 py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Codementees
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 font-medium text-gray-700 dark:text-gray-300">
            <Link className="hover:text-black dark:hover:text-white" to="/courses">Programs</Link>
            <Link className="hover:text-black dark:hover:text-white" to="/mentors">Mentors</Link>
            <Link className="hover:text-black dark:hover:text-white" to="/about">About</Link>
            <Link className="hover:text-black dark:hover:text-white" to="/contact">Contact</Link>
          </div>


          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4 items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md
             hover:bg-gray-100 dark:hover:bg-gray-800
             transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>
            <Link to="/login"
              className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-md transition"
            >
              Join Now
            </Link>
          </div>

          {/* Mobile Burger */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(prev => !prev)}
            aria-label="Open Menu"
          >
            <MenuIcon open={isOpen} />
          </button>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* BACKDROP BLUR */}
            <motion.div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* SIDEBAR PANEL */}
            <motion.div
              className="fixed top-15 right-0 h-[calc(100%-64px)] w-72 bg-white dark:bg-gray-900 shadow-xl z-55 md:hidden"

              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-6 py-6 flex flex-col gap-5 font-medium text-gray-800 dark:text-gray-200">
                <Link onClick={() => setIsOpen(false)} to="/courses">Programs</Link>
                <Link onClick={() => setIsOpen(false)} to="/mentors">Mentors</Link>
                <Link onClick={() => setIsOpen(false)} to="/about">About</Link>
                <Link onClick={() => setIsOpen(false)} to="/contact">Contact</Link>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-left"
                >
                  <span>{theme === "dark" ? "🌙" : "☀️"}</span>
                  <span>Toggle Theme</span>
                </button>


                <div className="pt-4 border-t dark:border-gray-700 flex flex-col gap-3">
                  <Link onClick={() => setIsOpen(false)} to="/login">
                    Login
                  </Link>
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/register"
                    className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded text-center hover:bg-blue-700 transition"
                  >
                    Join Now
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
