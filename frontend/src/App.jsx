import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseDetailModal from "./components/CourseDetailModal";
import About from "./pages/About"
import MainLayout from "./layouts/MainLayout";

export default function App() {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/courses/:id" element={<CourseDetailModal />} />
        </Routes>
      )}
    </>
  );
}
