import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProfileDropdown({ user, logout }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {/* Avatar */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full bg-primary text-bg font-semibold flex items-center justify-center"
            >
                {user.name.charAt(0).toUpperCase()}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 mt-2 w-52 surface-elevated rounded-lg shadow-lg z-50"
                    >
                        <div className="p-3 border-b border-default">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted">{user.email}</p>
                        </div>

                        <div className="flex flex-col p-2 text-sm">
                            <Link to="/dashboard" className="px-3 py-2 hover:bg-surface rounded">
                                Dashboard
                            </Link>

                            {user.role === "mentor" && (
                                <Link to="/dashboard/mentor" className="px-3 py-2 hover:bg-surface rounded">
                                    Mentor Panel
                                </Link>
                            )}

                            {user.role === "admin" && (
                                <Link to="/dashboard/admin" className="px-3 py-2 hover:bg-surface rounded">
                                    Admin Panel
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                className="text-left px-3 py-2 hover:bg-surface rounded"
                            >
                                Logout
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}