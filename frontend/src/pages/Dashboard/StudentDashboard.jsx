import { useState, useEffect } from "react";
import { getEnrolledCourses } from "../../services/courseService";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const data = await getEnrolledCourses();
      setEnrollments(data.enrollments || []);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-700 dark:text-red-400 mb-4">Error: {error}</p>
        <button
          onClick={fetchEnrollments}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Learning</h1>
          <p className="text-muted">Keep going. Your course streak starts here.</p>
        </div>
        <Link
          to="/courses"
          className="dash-cta"
        >
          Browse More Courses
        </Link>
      </div>

      {enrollments.length === 0 ? (
        <div className="panel text-center">
          <div className="text-4xl mb-4">Keep building</div>
          <h2 className="text-xl font-semibold mb-2">
            No Enrolled Courses Yet
          </h2>
          <p className="text-muted mb-6">
            Start your learning journey by enrolling in a course
          </p>
          <Link
            to="/courses"
            className="dash-cta inline-flex justify-center"
          >
            Explore Courses →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => {
            const course = enrollment.course;
            if (!course) return null;

            return (
              <div
                key={enrollment._id}
                className="dash-card overflow-hidden"
              >
                <div className="p-4 text-white" style={{ background: "var(--dash-gradient)" }}>
                  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                  <p className="text-sm opacity-90">
                    by {course.createdBy?.name || "Unknown Mentor"}
                  </p>
                </div>

                <div className="p-4">
                  <p className="text-muted text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {course.techStack && course.techStack.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {course.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 text-xs rounded-full"
                            style={{ background: "rgba(15, 118, 110, 0.12)", color: "rgb(var(--accent-strong))" }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted mb-4">
                    Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-muted mb-1">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full rounded-full h-2" style={{ background: "rgba(15, 118, 110, 0.15)" }}>
                      <div className="h-2 rounded-full" style={{ width: "0%", background: "rgb(var(--accent-strong))" }}></div>
                    </div>
                  </div>

                  <button className="w-full dash-cta">Continue Learning</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}