import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function DashboardLayout() {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    if (!user) {
        return <div className="p-8">Loading...</div>;
    }

    // ============================================
    // NAVBAR LINK STYLES
    // ============================================

    const linkStyle = (path) => {
        const isActive = location.pathname === path;
        return isActive ? 'dashboard-link dashboard-link-active' : 'dashboard-link';
    };

    return (
        <div className="dashboard-shell flex flex-col lg:flex-row">
            {/* ========== MOBILE HEADER ========== */}
            <div className="lg:hidden dashboard-topbar shadow sticky top-0 z-50">
                <div className="flex items-center justify-between px-4 py-3">
                    <h2 className="text-lg font-bold dashboard-brand">Workspace</h2>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 hover:bg-surface rounded-lg transition text-xl"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? '✕' : '☰'}
                    </button>
                </div>
            </div>

            {/* ========== SIDEBAR ========== */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } dashboard-sidebar shadow transition-all duration-300 relative flex flex-col hidden lg:flex`}
            >
                <div className="p-4 border-b border-default">
                    <h2 className={`dashboard-brand font-bold ${sidebarOpen ? 'text-xl' : 'text-center'}`}>
                        {sidebarOpen ? 'Workspace' : 'WS'}
                    </h2>
                </div>

                <nav className="p-4 space-y-2">
                    {/* Home */}
                    <Link
                        to="/dashboard"
                        className={linkStyle('/dashboard')}
                    >
                        {sidebarOpen ? 'Overview' : 'OV'}
                    </Link>

                    {/* STUDENT ONLY - User role */}
                    {user?.role === 'user' && (
                        <Link
                            to="/dashboard/student"
                            className={linkStyle('/dashboard/student')}
                        >
                            {sidebarOpen ? 'My Learning' : 'ML'}
                        </Link>
                    )}

                    {/* MENTOR ONLY - Mentor or Admin role */}
                    {(user?.role === 'mentor' || user?.role === 'admin') && (
                        <Link
                            to="/dashboard/mentor"
                            className={linkStyle('/dashboard/mentor')}
                        >
                            {sidebarOpen ? 'My Courses' : 'MC'}
                        </Link>
                    )}

                    {/* ADMIN ONLY - Admin role */}
                    {user?.role === 'admin' && (
                        <Link
                            to="/dashboard/admin"
                            className={linkStyle('/dashboard/admin')}
                        >
                            {sidebarOpen ? 'Admin Panel' : 'AD'}
                        </Link>
                    )}
                </nav>

            {/* Toggle Sidebar */}
                <div className="mt-auto p-4 border-t border-default">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full py-2.5 px-3 text-xs font-semibold bg-gradient-to-r from-teal-500/20 to-orange-500/20 border border-default rounded-lg hover:from-teal-500/30 hover:to-orange-500/30 transition duration-200 text-dash-ink dark:text-white"
                    >
                        {sidebarOpen ? '← Collapse' : '→ Expand'}
                    </button>
                </div>
            </aside>

            {/* ========== MOBILE DROPDOWN MENU ========== */}
            {mobileMenuOpen && (
                <nav className="lg:hidden fixed top-[61px] left-0 bottom-0 w-72 dashboard-sidebar border-r border-default p-4 space-y-2 overflow-y-auto z-40">
                    <Link
                        to="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={linkStyle('/dashboard')}
                    >
                        Overview
                    </Link>

                    {user?.role === 'user' && (
                        <Link
                            to="/dashboard/student"
                            onClick={() => setMobileMenuOpen(false)}
                            className={linkStyle('/dashboard/student')}
                        >
                            My Learning
                        </Link>
                    )}

                    {(user?.role === 'mentor' || user?.role === 'admin') && (
                        <Link
                            to="/dashboard/mentor"
                            onClick={() => setMobileMenuOpen(false)}
                            className={linkStyle('/dashboard/mentor')}
                        >
                            My Courses
                        </Link>
                    )}

                    {user?.role === 'admin' && (
                        <Link
                            to="/dashboard/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className={linkStyle('/dashboard/admin')}
                        >
                            Admin Panel
                        </Link>
                    )}

                    <div className="pt-4 mt-4 border-t border-default">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="dashboard-link"
                        >
                            Back to site
                        </Link>
                    </div>
                </nav>
            )}

            {/* ========== MAIN CONTENT ========== */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* TOP NAVBAR */}
                <header className="dashboard-topbar shadow hidden md:block sticky top-0 z-40">
                    <div className="flex justify-between items-center px-8 py-4">
                        <div>
                            <h1 className="text-2xl font-bold text-dash-ink dark:text-white">
                                Welcome, {user?.name}!
                            </h1>
                            <p className="text-sm text-muted">Track progress and manage your workspace.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted">
                                Role: <span className="font-semibold capitalize text-dash-ink dark:text-white">{user?.role}</span>
                            </span>
                            <Link
                                to="/"
                                className="dash-link text-sm"
                            >
                                Back to site
                            </Link>
                            <button
                                onClick={toggleTheme}
                                className="dash-link text-sm"
                                aria-label="Toggle theme"
                            >
                                {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                            </button>
                            <button onClick={logout} className="dash-btn">
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="dashboard-main flex-1 overflow-auto pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}