import { useParams, useNavigate } from "react-router-dom"
import { coursesData } from "../data/coursesData"
import { motion } from "framer-motion"
import { useEffect } from "react";


export default function CourseDetailModal() {
    const { id } = useParams();
    const navigate = useNavigate();

    const course = coursesData.find(c => c.id === id);
    if (!course) return null;

    const listVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        show: { opacity: 1, y: 0 }
    };
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                navigate(-1);
            }
        };

        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        }
    }, [navigate]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >

            {/* BACKDROP */}
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => navigate(-1)}
            />
            {/* MODAL */}
            <motion.div
                className="relative bg-white rounded-xl max-w-2xl w-full mx-6 p-8 shadow-xl"
                tabIndex={-1}
                autoFocus
                initial={{ y: 40, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: 40, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
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

                <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    animate="show"
                    className="list-disc list-inside text-gray-600 space-y-1"
                >
                    {course.includes.map((item, idx) => (
                        <motion.li key={idx} variants={itemVariants}>{item}</motion.li>
                    ))}
                </motion.ul>

            </motion.div>
        </motion.div>

    )
}