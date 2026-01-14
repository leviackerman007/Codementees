import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import CourseDetailModal from "./components/CourseDetailModal";
import About from "./pages/About"
export default function App() {
  const location=useLocation();
  const backgroundLocation=location.state?.backgroundLocation;
  return (
    <>
      <Navbar />
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/about" element={<About />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path="/courses/:id" element={<CourseDetailModal />} />
        </Routes>
      )}
    </>
  );
}
