import { coursesData } from "../data/coursesData";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"
export default function ProgramsSection() {
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* HEADER */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Our Programs
                    </h2>
                    <p className="text-gray-600 mt-3">
                        Learn through structured programs designed for real careers
                    </p>
                </div>

                {/* PROGRAM CARDS */}

                <div className="grid md:grid-cols-3 gap-8">
                    {coursesData.slice(0, 3).map((course, idx) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="border rounded-xl p-6 flex flex-col h-full
                            hover:shadow-lg transition-all hover:-translate-y-1">
                            <h3 className="text-xl font-semibold mb-3">
                                {course.title}
                            </h3>
                            <p className="text-gray-600 mb-4">
                                {course.description}
                            </p>

                            <div className="text-sm text-gray-500 mb-6 space-y-1">
                                <p><span className="font-medium">Duration:</span> {course.duration}</p>
                                <p><span className="font-medium">Level:</span> {course.level}</p>
                            </div>
                            <Link
                                to={`/courses/${course.id}`}
                                className="mt-auto font-medium text-black inline-flex items-center gap-1 hover:gap-2 transition-all">
                                View Program →
                            </Link>
                        </motion.div>
                    ))}
                </div>
                {/* CTA */}
                <div className="text-center mt-12">
                    <Link to="/courses" className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition">
                        View All Programs
                    </Link>
                </div>
            </div>
        </section>
    )
}