import { Link, useLocation } from "react-router-dom";
import TechIcon from "../components/TechIcon";
import { techIconMap } from "../utils/techIcons";

export default function CourseCard({ course, variant = "primary" }) {
    const location = useLocation();
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty(
            "--x",
            `${e.clientX - rect.left}px`
        );
        e.currentTarget.style.setProperty(
            "--y",
            `${e.clientY - rect.top}px`
        );
    };

    const handleMouseLeave = (e) => {
        e.currentTarget.style.removeProperty("--x");
        e.currentTarget.style.removeProperty("--y");
    };
    return (
        <div
            className={`card card-${variant} flex flex-col h-full`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >

            {/* CONTENT */}
            <div className="flex flex-col flex-1">
                <h3 className="text-xl font-semibold mb-3">
                    {course.title}
                </h3>

                <p className="mb-4">
                    {course.description}
                </p>

                {/* TECH ICONS (optional on Home) */}
                {course.techStack && (
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-sm font-medium text-muted">
                            Technologies:
                        </span>
                        {course.techStack.map((tech) => {
                            const icon = techIconMap[tech];
                            if (!icon) return null;
                            return <TechIcon key={tech} icon={icon} />;
                        })}
                    </div>
                )}

                <div className="text-sm text-muted space-y-1 mb-6">
                    <p><strong>Duration:</strong> {course.duration}</p>
                    <p><strong>Level:</strong> {course.level}</p>
                </div>
            </div>

            {/* CTA — ALWAYS STICKS TO BOTTOM */}
            <Link
                to={`/courses/${course.id}`}
                state={{ backgroundLocation: location }}
                className="mt-auto font-medium inline-flex items-center gap-1
                   hover:gap-2 transition-all"
            >
                View Details →
            </Link>
        </div>
    );
}
