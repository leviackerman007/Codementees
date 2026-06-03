import { useState, useEffect } from "react";
import { coursesData } from "../data/coursesData";
import { getCourses } from "../services/courseService";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"
import CourseCard from "../components/CourseCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProgramsSection() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                if (data && data.courses && data.courses.length > 0) {
                    setCourses(data.courses.slice(0, 3));
                } else {
                    setCourses(coursesData.slice(0, 3));
                }
            } catch (err) {
                console.error("Failed to load courses for homepage, using fallback:", err);
                setCourses(coursesData.slice(0, 3));
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    return (
        <section className="surface">
            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* HEADER */}
                <div className="text-center mb-14">
                    <h2 className="text-3xl font-bold">
                        Onboarding Pathways
                    </h2>
                    <p className="mt-3 text-secondary">
                        Ramp up fast using interactive, structured training modules
                    </p>
                </div>

                {/* PROGRAM CARDS */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner size="lg" className="text-teal-600" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {courses.map((course, idx) => (
                            <motion.div
                                key={course.id || course._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="flex flex-col h-full"
                            >
                                <CourseCard course={course} variant="soft"/>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-12">
                    <Link to="/courses" className="btn btn-primary">
                        View All Paths
                    </Link>
                </div>
            </div>
        </section>
    )
}