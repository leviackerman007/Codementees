import { useEffect, useState } from "react";
import { getAdminStats, getAdminUsers, getAdminCourses } from "../../services/adminService";
import { toggleCoursePublish, deleteCourse } from "../../services/courseService";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAdminData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, coursesRes] = await Promise.all([
                getAdminStats(),
                getAdminUsers(1, 8),
                getAdminCourses(1, 8)
            ]);
            setStats(statsRes.stats || null);
            setUsers(usersRes.users || []);
            setCourses(coursesRes.courses || []);
            setError("");
        } catch (err) {
            setError(err.message || "Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData();
    }, []);

    const handleTogglePublish = async (id) => {
        try {
            await toggleCoursePublish(id);
            loadAdminData();
        } catch (err) {
            setError(err.message || "Failed to update course status");
        }
    };

    const handleDeleteCourse = async (id) => {
        try {
            await deleteCourse(id);
            loadAdminData();
        } catch (err) {
            setError(err.message || "Failed to delete course");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            <div>
                <h1 className="text-3xl font-semibold mb-2">Admin Control</h1>
                <p className="text-muted">Overview of platform activity and latest updates.</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* STATS */}
            <div className="dash-grid dash-grid-3 stagger">
                <div className="stat-card">
                    <p className="text-sm text-muted">Total Users</p>
                    <p className="stat-number">{stats?.totalUsers ?? 0}</p>
                    <span className="badge-soft">Active</span>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-muted">Mentors</p>
                    <p className="stat-number">{stats?.totalMentors ?? 0}</p>
                    <span className="badge-soft">Verified</span>
                </div>
                <div className="stat-card">
                    <p className="text-sm text-muted">Courses</p>
                    <p className="stat-number">{stats?.totalCourses ?? 0}</p>
                    <p className="text-xs text-muted">Published: {stats?.publishedCourses ?? 0}</p>
                </div>
            </div>

            {/* USERS */}
            <div className="panel">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Users</h2>
                    <span className="text-xs text-muted">Latest 8</span>
                </div>
                <div className="overflow-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-muted">
                            <tr>
                                <th className="py-2">Name</th>
                                <th className="py-2">Email</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-4 text-center text-muted">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="border-t">
                                        <td className="py-2">{user.name}</td>
                                        <td className="py-2">{user.email}</td>
                                        <td className="py-2 capitalize">{user.role}</td>
                                        <td className="py-2">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* COURSES */}
            <div className="panel">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Recent Courses</h2>
                    <span className="text-xs text-muted">Latest 8</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {courses.length === 0 ? (
                        <p className="text-muted">No courses available.</p>
                    ) : (
                        courses.map((course) => (
                            <div key={course._id} className="dash-card flex flex-col gap-3">
                                <div>
                                    <h3 className="font-semibold">{course.title}</h3>
                                    <p className="text-sm text-muted">{course.description}</p>
                                </div>
                                <div className="text-xs text-muted">
                                    Creator: {course.createdBy?.name || "Unknown"}
                                </div>
                                <div className="text-xs">
                                    Status: {course.isPublished ? "Published" : "Draft"}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleTogglePublish(course._id)}
                                        className="btn btn-secondary text-xs"
                                    >
                                        {course.isPublished ? "Unpublish" : "Publish"}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCourse(course._id)}
                                        className="btn btn-primary text-xs"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}