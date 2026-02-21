import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
    const { user } = useAuth();
    const location = useLocation();

    const linkStyle = (path) =>
        `px-4 py-2 rounded-md ${location.pathname === path ?
            "bg-primary text-bg"
            : "hover:bg-surface"
        }`;

    return (
        <div className="min-h-screen flex surface">
            {/* SIDEBAR */}
            <aside className="w-64 surface-elevated border-r border-default p-6 hidden md:flex flex-col gap-4">
                <h2 className="text-lg font-semibold mb-6">
                    Dashboard
                </h2>
                <Link to="/dashboard" className={linkStyle("/dashboard")}>
                    Overview
                </Link>
                {user?.role==="mentor" && (
                <Link to="/dashboard/mentor" className={linkStyle("/dashboard/mentor")}>
                    My Courses
                </Link>
                )}
                {user?.role==="admin" && (
                <Link to="/dashboard/admin" className={linkStyle("/dashboard/admin")}>
                    Admin Panel
                </Link>
                )}
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    )
}