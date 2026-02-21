import { Link } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

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
              className="p-2 rounded-md hover:opacity-80 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </button>

            {user ? (
              <>
                <Link
                  to='/dashboard'
                  className="px-5 py-2 rounded-full border border-default hover:bg-surface transition"
                >
                  Dashboard
                </Link>
                <ProfileDropdown user={user} logout={logout} />
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

          <div className="md:hidden flex items-center gap-3">
            {user && (
              <Link
                to="/dashboard"
                className="px-4 py-1.5 rounded-full border border-default text-sm"
              >
                Dashboard
              </Link>
            )}
            {/* Mobile Burger */}
            <button
              onClick={() => setIsOpen(prev => !prev)}
              aria-label="Open Menu"
            >
              <MenuIcon open={isOpen} />
            </button>
          </div>
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
              className="fixed top-[64px] right-0 h-[calc(100%-50px)] w-72 surface-elevated shadow-xl z-[60] md:hidden"

              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-6 py-6 flex flex-col gap-5 font-medium text-secondary">
                {user && (
                  <div className="flex items-center gap-3 pb-4 border-b border-default">
                    <div className="w-10 h-10 rounded-full bg-primary text-bg flex items-center justify-center font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </div>
                  </div>
                )}
                {user && (
                  <>
                    <Link onClick={() => setIsOpen(false)} to="/dashboard">
                      Dashboard
                    </Link>
                    {user.role==="mentor" && (
                      <Link onClick={()=>setIsOpen(false)} to="/dashboard/mentor">
                        Mentor Panel
                      </Link>
                    )}
                    {user.role==="admin" && (
                      <Link onClick={()=>setIsOpen(false)} to="/dashboard/admin">
                        Admin Panel
                      </Link>
                    )}
                  </>
                )}
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
