import { Link, useLocation } from "react-router-dom";
import { coursesData } from "../data/coursesData";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const location = useLocation();

  return (
    <section className="surface py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* PAGE HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-4">
            Our Programs
          </h1>
          <p className="max-w-2xl">
            Choose from our industry-focused programs designed to make you
            job-ready with hands-on learning and expert mentorship.
          </p>
        </div>

        {/* COURSES GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {coursesData.map((course) => (
            <CourseCard key={course.id} course={course}/>
          ))}
        </div>

      </div>
    </section>
  );
}
