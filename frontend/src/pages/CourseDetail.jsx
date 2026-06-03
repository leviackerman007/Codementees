import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { coursesData } from "../data/coursesData";
import { getCourseById, getEnrolledCourses } from "../services/courseService";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";
import { toast } from "../utils/toast";
import EnrollButton from "../components/EnrollButton";
import LoadingSpinner from "../components/LoadingSpinner";

export default function CourseDetail({ modal = false }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isStatic, setIsStatic] = useState(false);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchCourseAndEnrollment = async () => {
            try {
                // If ID is one of our static course keys, skip API call to avoid 404s
                const staticMatch = coursesData.find(c => c.id === id);
                if (staticMatch) {
                    setCourse(staticMatch);
                    setIsStatic(true);
                    setLoading(false);
                    return;
                }

                // Query backend by mongoose ObjectId
                const data = await getCourseById(id);
                if (data && data.course) {
                    setCourse(data.course);
                    setIsStatic(false);
                    
                    // Check if current user is enrolled
                    if (user) {
                        try {
                            const enrollRes = await getEnrolledCourses();
                            const enrolled = enrollRes.enrollments?.some(e => e.course?._id === id);
                            setIsEnrolled(enrolled);
                        } catch (err) {
                            console.warn("Failed to check enrollments: ", err);
                        }
                    }
                } else {
                    throw new Error("Course not found in database");
                }
            } catch (err) {
                console.warn("Could not load course by ID, checking static list:", err);
                const staticFallback = coursesData.find(c => c.id === id);
                if (staticFallback) {
                    setCourse(staticFallback);
                    setIsStatic(true);
                } else {
                    setCourse(null);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCourseAndEnrollment();
    }, [id, user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <LoadingSpinner size="lg" className="text-teal-600" />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="surface py-24 text-center">
                <p className="text-muted">Course not found</p>
                <button className="btn btn-secondary mt-4" onClick={() => navigate("/courses")}>
                    Back to Courses
                </button>
            </div>
        );
    }

    const close = () => navigate(-1);

    const handleStaticEnrollClick = () => {
        if (!user) {
            toast.error("Please login first to enroll in courses.");
            navigate("/login");
            return;
        }
        toast.info("💡 This is a static program. To test real enrollments, create and publish a course via the Mentor Dashboard!");
    };

    const handleEnrollSuccess = () => {
        setIsEnrolled(true);
    };

    const content = (
        <motion.div className={`card max-w-3xl w-full relative z-50 p-6 md:p-8 ${modal ? "max-h-[85vh] overflow-y-auto no-scrollbar" : ""}`}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}>

            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                <h1 className="text-3xl font-bold">
                    {course.title}
                </h1>
                {isEnrolled && (
                    <span className="badge-soft text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-400">
                        ✓ Enrolled
                    </span>
                )}
            </div>

            <p className="mb-6 text-secondary leading-relaxed">
                {course.description}
            </p>

            <div className="grid sm:grid-cols-3 gap-4 text-sm bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-default mb-6">
                <div>
                    <span className="text-xs text-muted uppercase font-semibold">Duration</span>
                    <p className="font-semibold text-primary mt-0.5">{course.duration}</p>
                </div>
                <div>
                    <span className="text-xs text-muted uppercase font-semibold">Level</span>
                    <p className="font-semibold text-primary mt-0.5">{course.level}</p>
                </div>
                <div>
                    <span className="text-xs text-muted uppercase font-semibold">Technologies</span>
                    <p className="font-semibold text-primary mt-0.5 truncate">
                        {Array.isArray(course.techStack) ? course.techStack.join(", ") : "General"}
                    </p>
                </div>
            </div>

            <h2 className="text-lg font-semibold mb-3">
                What you'll learn
            </h2>

            <ul className="list-disc list-inside space-y-2 mb-6 text-secondary">
                {course.includes && course.includes.map((item, idx) => (
                    <li key={idx}>{item}</li>
                ))}
            </ul>

            {/* Syllabus & Content Preview */}
            {(course.syllabus?.length > 0 || course.content?.length > 0) && (
                <div className="mt-8 border-t border-default pt-6 space-y-6">
                    <h2 className="text-xl font-bold">Pathway Curriculum</h2>
                    
                    {course.syllabus?.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                                <span>📚</span> Syllabus Concepts
                            </h3>
                            <div className="grid md:grid-cols-2 gap-3">
                                {course.syllabus.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-default rounded-xl">
                                        <h4 className="font-semibold text-sm">{item.title}</h4>
                                        {item.description && <p className="text-xs text-muted mt-1">{item.description}</p>}
                                        {item.topics?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {item.topics.map((t, i) => (
                                                    <span key={i} className="badge-soft text-[10px] px-2 py-0.5">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {course.content?.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <h3 className="font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-2">
                                <span>🎬</span> Training Modules & Resources
                            </h3>
                            <div className="space-y-2">
                                {course.content.map((item, idx) => (
                                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/20 border border-default rounded-xl flex items-center gap-3">
                                        <span className="text-xl">
                                            {item.type === 'video' ? '🎬' : item.type === 'text' ? '📝' : '📎'}
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-sm">{item.title}</h4>
                                            {item.description && <p className="text-xs text-muted mt-0.5">{item.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            <div className="flex justify-end max-w-xs ml-auto mt-8">
                {isEnrolled ? (
                    <button
                        onClick={() => navigate(`/dashboard/student/course/${course._id}`)}
                        className="w-full btn btn-primary flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>📖</span>
                        <span>Resume Pathway</span>
                    </button>
                ) : isStatic ? (
                    <button onClick={handleStaticEnrollClick} className="w-full btn btn-primary cursor-pointer">
                        Enroll Now
                    </button>
                ) : (
                    <EnrollButton course={course} onEnrollSuccess={handleEnrollSuccess} />
                )}
            </div>
        </motion.div>
    );

    if (modal) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
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
                <button className="text-muted mb-6 inline-block hover:text-teal-600 transition" onClick={() => navigate(-1)}>
                    ← Back to Courses
                </button>
                {content}
            </div>
        </section>
    );
}