import { Link, useLocation } from "react-router-dom";
import TechIcon from "../components/TechIcon";
import { techIconMap } from "../utils/techIcons";

export default function CourseCard({ course }) {
    const location = useLocation();

    return (
        <div className="card flex flex-col">
            <h3 className="text-xl font-semibold mb-3">
                {course.title}
            </h3>

            <p className="mb-4">
                {course.description}
            </p>

            {/* TECH ICONS */}
            <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium">
                    Technologies:
                </span>
                {course.techStack.map((tech) => {
                    const icon = techIconMap[tech];
                    if (!icon) return null;
                    return (
                        <TechIcon key={tech} icon={icon} />
                    )
                })}
            </div>

            <div className="text-sm mb-6 space-y-1">
                <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {course.duration}
                </p>
                <p>
                    <span className="font-medium">Level:</span>{" "}
                    {course.level}
                </p>
            </div>

            <Link
                to={`/courses/${course.id}`}
                state={{ backgroundLocation: location }}
                className="mt-auto font-medium
                           inline-flex items-center gap-1
                           hover:gap-2 transition-all"
            >
                View Details →
            </Link>
        </div>
    )
}