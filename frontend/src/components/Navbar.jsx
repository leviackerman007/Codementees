import { Link } from "react-router-dom";
import { useState } from "react";
import {motion, AnimatePresence} from "framer-motion";

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
      <nav className="sticky top-0 z-50 bg-white border-b">
        <div className="flex justify-between items-center px-10 py-4">
          <Link to="/" className="text-xl font-bold">
            Codementees
          </Link>

          <div className="hidden md:flex gap-6 font-medium">
            <Link to="/courses">Programs</Link>
            <Link to="/mentors">Mentors</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div className="hidden md:flex gap-4 items-center">
            <Link to="/login" className="text-gray-600">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-black text-white px-4 py-2 rounded"
            >
              Join Now
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(prev=>!prev)}
          >
            <MenuIcon open={isOpen} />
          </button>
        </div>
      </nav>

      {/* MOBILE DROPDOWN*/}
      <AnimatePresence>
      {isOpen && (
          <motion.div
            className="absolute top-[64px] left-0 right-0 bg-white shadow-lg z-50 md:hidden"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            >
            <div className="px-6 py-6 flex flex-col gap-4 font-medium">
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
                  className="bg-black text-white px-4 py-2 rounded text-center"
                >
                  Join Now
                </Link>
              </div>
            </div>
          </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}
