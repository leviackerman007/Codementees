import { coursesData } from "../data/coursesData";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard";
export default function ProgramsSection() {
    return (
        <section className="surface">
            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* HEADER */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold">
                        Our Programs
                    </h2>
                    <p className="mt-3">
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
                            <CourseCard course={course} variant="soft"/>
                        </motion.div>
                    ))}
                </div>
                {/* CTA */}
                <div className="text-center mt-12">
                    <Link to="/courses" className="btn btn-primary">
                        View All Programs
                    </Link>
                </div>
            </div>
        </section>
    )
}