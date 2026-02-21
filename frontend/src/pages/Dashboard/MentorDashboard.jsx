import { useState } from "react";
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
    } catch (err) {
      alert("Course Creation Failed");
    }
  };

  return (
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
  );
}