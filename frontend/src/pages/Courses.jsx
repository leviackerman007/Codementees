import { Link, useLocation } from "react-router-dom";
import { coursesData } from "../data/coursesData";

export default function Courses() {
  const location = useLocation();

  return (
    <section className="bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Programs
          </h1>
          <p className="text-gray-600 max-w-2xl">
            Choose from our industry-focused programs designed to make you
            job-ready with hands-on learning and expert mentorship.
          </p>
        </div>

        {/* COURSES GRID */}
        <div className="grid md:grid-cols-2 gap-8">
          {coursesData.map((course) => (
            <div
              key={course.id}
              className="border rounded-lg p-6 flex flex-col
                         transition-all duration-300
                         hover:shadow-lg hover:-translate-y-1"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {course.title}
              </h3>

              <p className="text-gray-600 mb-4">
                {course.description}
              </p>

              <div className="text-sm text-gray-500 mb-6 space-y-1">
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {course.duration}
                </p>
                <p>
                  <span className="font-medium">Level:</span>{" "}
                  {course.level}
                </p>
              </div>

              <Link
                to={`/courses/${course.id}`}
                state={{ backgroundLocation: location }}
                className="mt-auto text-black font-medium
                           inline-flex items-center gap-1
                           hover:gap-2 transition-all"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
