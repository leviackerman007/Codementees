import { useEffect, useState } from "react";
import api from "../../services/api";

export default function MentorDashboard() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    duration: "",
    level: "",
    techStack: "",
    includes: "",
    price: "",
  });

  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses/my-courses")
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  }

  const togglePublish = async (id) => {
    try {
      await api.patch(`/courses/${id}/toggle`);
      fetchCourses();
    } catch (err) {
      alert("Failed to update course status");
    }
  }
  const deleteCourse = async (id) => {
    try {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    } catch (err) {
      alert("Failed to delete course");
    }
  }


  useEffect(() => {
    fetchCourses();
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/courses", {
        ...form,
        techStack: form.techStack.split(","),
        includes: form.includes.split(","),
      });

      alert("Course Created Successfully");
      fetchCourses();
    } catch (err) {
      console.log(err.response?.data)
      alert(err.response?.data?.message || "Course Creation Failed");
    }
  };

  return (

    <div>

      {/* CREATE FORM */}
      <div className="max-w-2xl">
        <h1 className="text-2xl font-semibold mb-6">
          Create New Course
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="title"
            placeholder="Course Title"
            className="input"
            onChange={handleChange}
          />

          <textarea
            name="description"
            placeholder="Course Description"
            className="input"
            onChange={handleChange}
          />

          <input
            name="duration"
            placeholder="Duration (e.g. 8 weeks)"
            className="input"
            onChange={handleChange}
          />

          <input
            name="level"
            placeholder="Level (Beginner/Advanced)"
            className="input"
            onChange={handleChange}
          />

          <input
            name="techStack"
            placeholder="Tech Stack (comma separated)"
            className="input"
            onChange={handleChange}
          />

          <input
            name="includes"
            placeholder="Includes (comma separated)"
            className="input"
            onChange={handleChange}
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            className="input"
            onChange={handleChange}
          />

          <button type="submit" className="btn btn-primary">
            Create Course
          </button>
        </form>
      </div>

      {/* MY COURSES */}
      <div>
        <h2 className="text-xl font-semibold mb-6">
          My Courses
        </h2>

        {courses.length === 0 ? (
          <p>No courses created yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="card flex flex-col gap-4">
                <h3 className="font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-muted mb-3">
                  {course.description}
                </p>
                <div className="text-xs text-muted mb-3">
                  Rs {course.price}
                </div>

                <div className="text-xs mb-4">
                  Status: {course.isPublished ? "Published" : "Draft"}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(course._id)}
                    className="btn btn-secondary text-sm"
                  >
                    {course.isPublished ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => deleteCourse(course._id)}
                    className="btn btn-primary text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

            ))}
          </div>
        )}
      </div>
    </div>
  );
}