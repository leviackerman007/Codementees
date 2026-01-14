import { useParams, useNavigate } from "react-router-dom"
import { coursesData } from "../data/coursesData"
import { moveItem } from "framer-motion";

export default function CourseDetailModal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const course = coursesData.find(c => c.id === id);
    if (!course) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => navigate(-1)}
            />
            {/* MODAL */}
            <div className="relative bg-white rounded-xl max-w-2xl w-full mx-6 p-8 shadow-xl">
                {/* CLOSE BUTTON */}
                <button
                    onClick={() => navigate(-1)}
                    className='absolute top-4 right-4 text-gray-400 hover:text-black'
                >
                    ✕
                </button>
                <h2 className="text-3xl font-bold mb-4">
                    {course.title}
                </h2>
                <p className="text-gray-600 mb-6">
                    {course.description}
                </p>

                <div className="flex gap-6 text-sm text-gray-500 mb-6">
                    <p><span className="font-medium">Duration:</span> {course.duration}</p>
                    <p><span className="font-medium">Level:</span> {course.level}</p>
                </div>

                <h3 className="font-semibold mb-2">
                    What you'll learn
                </h3>

                <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {course.includes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>

            </div>
        </div>

    )
}