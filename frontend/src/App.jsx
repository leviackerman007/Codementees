import { Routes, Route, useLocation } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";

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
