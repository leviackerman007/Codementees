import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* Animated Burger / Close Icon */
const MenuIcon = ({ open }) => (
  <div className="relative w-6 h-6">
    <span
      className={`absolute h-0.5 w-6 bg-black transition-all duration-300
      ${open ? "rotate-45 top-3" : "top-1"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-black transition-all duration-300
      ${open ? "opacity-0" : "top-3"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-black transition-all duration-300
      ${open ? "-rotate-45 top-3" : "top-5"}`}
    />
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-[60] bg-white border-b">
        <div className="flex justify-between items-center px-6 md:px-10 py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-gray-900">
            Codementees
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 font-medium text-gray-700">
            <Link className="hover:text-black" to="/courses">Programs</Link>
            <Link className="hover:text-black" to="/mentors">Mentors</Link>
            <Link className="hover:text-black" to="/about">About</Link>
            <Link className="hover:text-black" to="/contact">Contact</Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4 items-center">
            <Link to="/login" className="text-gray-600 hover:text-black">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition"
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
              className="fixed top-[60px] right-0 h-[calc(100%-64px)] w-72 bg-white shadow-xl z-[55] md:hidden"

              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-6 py-6 flex flex-col gap-5 font-medium text-gray-800">
                <Link onClick={() => setIsOpen(false)} to="/courses">Programs</Link>
                <Link onClick={() => setIsOpen(false)} to="/mentors">Mentors</Link>
                <Link onClick={() => setIsOpen(false)} to="/about">About</Link>
                <Link onClick={() => setIsOpen(false)} to="/contact">Contact</Link>

                <div className="pt-4 border-t flex flex-col gap-3">
                  <Link onClick={() => setIsOpen(false)} to="/login">
                    Login
                  </Link>
                  <Link
                    onClick={() => setIsOpen(false)}
                    to="/register"
                    className="bg-black text-white px-4 py-2 rounded text-center hover:bg-blue-700 transition"
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
