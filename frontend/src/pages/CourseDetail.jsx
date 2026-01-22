import { useParams,Link } from "react-router-dom"
import { coursesData } from "../data/coursesData"

export default function CourseDetail() {
    const { id } = useParams();
    const course = coursesData.find(c => c.id === id);

    if (!course) {
        return (
            <div className="surface py-24">
                <p className="text-center">Course not found</p>
            </div>
        );
    }
    return (
        <section className="surface py-20">
            <div className="max-w-4xl mx-auto px-6">
                <Link to='/courses' className="text-muted mb-6 inline-block">
                    ← Back to Courses
                </Link>

                <h1 className="text-4xl font-bold mb-4">
                    {course.title}
                </h1>

                <p className="mb-6">
                    {course.description}
                </p>

                <div className="flex gap-6 text-sm text-gray-500 mb-8">
                    <p className="font-medium"><strong>Duration:</strong> {course.duration}</p>
                    <p className="font-medium"><strong>Level:</strong> {course.level}</p>
                    <p className="font-medium"><strong>Technologies:</strong> {course.techStack.join(", ")}</p>
                    
                </div>

                <h2 className="text-xl font-semibold mb-3">
                    What you'll learn
                </h2>

                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {course.includes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        </section>
    )
}