import { useState, useEffect } from "react";
import { coursesData } from "../data/coursesData";
import { getCourses } from "../services/courseService";
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        if (data && data.courses && data.courses.length > 0) {
          setCourses(data.courses);
        } else {
          // Fallback to static data if database is empty
          setCourses(coursesData);
        }
      } catch (err) {
        console.error("Failed to load courses from API, using fallback data:", err);
        setCourses(coursesData);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section className="surface py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">
            Onboarding Paths
          </h1>
          <p className="max-w-2xl text-secondary">
            Explore the training modules and onboarding pathways designed to get you
            fully oriented and productive on your new team.
          </p>
        </div>

        {/* COURSES GRID */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" className="text-teal-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id || course._id} course={course}/>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
