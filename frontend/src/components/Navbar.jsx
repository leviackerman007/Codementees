import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

/* Animated Burger / Close Icon */
const MenuIcon = ({ open }) => (
  <div className="relative w-6 h-6">
    <span
      className={`absolute h-0.5 w-6 bg-current transition-all duration-300
      ${open ? "rotate-45 top-3" : "top-1"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-current transition-all duration-300
      ${open ? "opacity-0" : "top-3"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-current transition-all duration-300
      ${open ? "-rotate-45 top-3" : "top-5"}`}
    />
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 surface border-b border-default">
        <div className="flex justify-between items-center px-6 md:px-10 py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            Codementees
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-6 font-medium text-secondary">
            <Link className="hover:text-primary" to="/courses">Programs</Link>
            <Link className="hover:text-primary" to="/mentors">Mentors</Link>
            <Link className="hover:text-primary" to="/about">About</Link>
            <Link className="hover:text-primary" to="/contact">Contact</Link>
          </div>


          {/* Desktop Actions */}
          <div className="hidden md:flex gap-4 items-center relative">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md
             hover:opacity-80 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <>
                <span className="text-secondary text-sm">
                  Hi, {user.name}
                </span>

                <button
                  onClick={logout}
                  className="btn btn-secondary"
                >
                  Logout
                </button>
              </>) : (<>
                <Link to="/login"
                  className="text-secondary hover:text-primary">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                >
                  Join Now
                </Link>
              </>
            )}
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
              className="fixed top-15 right-0 h-[calc(100%-50px)] w-72 surface-elevated shadow-xl z-55 md:hidden"

              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-6 py-6 flex flex-col gap-5 font-medium text-secondary">
                <Link onClick={() => setIsOpen(false)} to="/courses">Programs</Link>
                <Link onClick={() => setIsOpen(false)} to="/mentors">Mentors</Link>
                <Link onClick={() => setIsOpen(false)} to="/about">About</Link>
                <Link onClick={() => setIsOpen(false)} to="/contact">Contact</Link>

                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-2 text-secondary"
                >
                  <span>{theme === "dark" ? "🌙" : "☀️"}</span>
                  <span>Toggle Theme</span>
                </button>

                {user ? (
                  <>
                    <span className="text-sm">
                      Hi, {user.name}
                    </span>

                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="btn btn-secondary"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <div className="pt-4 border-t border-default flex flex-col gap-3">
                      <Link onClick={() => setIsOpen(false)} to="/login">
                        Login
                      </Link>
                      <Link
                        onClick={() => setIsOpen(false)}
                        to="/signup"
                        className="btn btn-primary text-center"
                      >
                        Join Now
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
