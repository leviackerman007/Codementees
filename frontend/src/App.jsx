import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";
import Mentors from "./pages/Mentors";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MentorDashboard from "./pages/Dashboard/MentorDashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import DashboardLayout from "./layouts/DashboardLayout";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";

export default function App() {
  const location = useLocation();
  const state = location.state;

  return (
    <>
      {/* NORMAL PAGE ROUTES */}
      <Routes location={state?.backgroundLocation || location}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          <Route
            path="student"
            element={
              <RoleGuard allowedRoles={['user']}>
                <StudentDashboard />
              </RoleGuard>
            }
          />

          <Route
            path="mentor"
            element={
              <RoleGuard allowedRoles={['mentor', 'admin']}>
                <MentorDashboard />
              </RoleGuard>
            }
          />

          <Route
            path="admin"
            element={
              <RoleGuard allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleGuard>
            }
          />
        </Route>
      </Routes>

      {/* MODAL ROUTE */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/courses/:id"
            element={<CourseDetail modal />}
          />
        </Routes>
      )}
    </>
  );
}
