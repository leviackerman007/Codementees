import { useParams, useLocation, useNavigate } from "react-router-dom"
import { coursesData } from "../data/coursesData"
import { motion } from "framer-motion";

export default function CourseDetail({ modal = false }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const course = coursesData.find(c => c.id === id);

    if (!course) {
        return (
            <div className="surface py-24">
                <p className="text-center text-muted">Course not found</p>
            </div>
        );
    }

    const close = () => navigate(-1);

    const content = (
        <motion.div className="card max-w-3xl w-full relative z-50"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}>

            <h1 className="text-3xl font-bold mb-4">
                {course.title}
            </h1>
            <p className="mb-6">
                {course.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-muted mb-8">
                <p className="font-medium"><strong>Duration:</strong> {course.duration}</p>
                <p className="font-medium"><strong>Level:</strong> {course.level}</p>
                <p className="font-medium"><strong>Technologies:</strong> {course.techStack.join(", ")}</p>

            </div>

            <h2 className="text-lg font-semibold mb-3">
                What you'll learn
            </h2>

            <ul className="list-disc list-inside space-y-2 mb-6">
                {course.includes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>
            <div className="flex justify-end">
                <button className="btn btn-primary">
                    Enroll Now
                </button>
            </div>
        </motion.div>
    );

    if (modal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <motion.div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={close}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                />
                {content}
            </div>
        );
    }

    return (
        <section className="surface py-20">
            <div className="max-w-4xl mx-auto px-6">
                <button className="text-muted mb-6 inline-block" onClick={() => navigate(-1)}>
                    ← Back to Courses
                </button>
                {content}
            </div>
        </section>
    );
}