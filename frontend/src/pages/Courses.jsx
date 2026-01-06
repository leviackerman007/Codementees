export default function Courses() {
    const courses = [
        {
            title: "Full Stack Development",
            desc: "Master frontend and backend development with real-world projects.",
            duration: "6 Months",
            level: "Beginner to Advanced",
        },
        {
            title: "Data Science & Machine Learning",
            desc: "Learn data analysis, machine learning models, and deployment.",
            duration: "5 Months",
            level: "Intermediate",
        },
        {
            title: "DSA & Interview Preparation",
            desc: "Strengthen problem-solving skills and crack technical interviews.",
            duration: "4 Months",
            level: "All Levels",
        },
        {
            title: "Career Guidance Program",
            desc: "Resume building, mock interviews, and career mentoring.",
            duration: "2 Months",
            level: "All Levels",
        },
    ];


    return (
        <>
            <section className="bg-white">
                <div className='max-w-7xl mx-auto px-6 pt-28 pb-20'>
                    {/* PAGE HEADER */}
                    <div className="text-4xl font-bold text-gray-900 mb-4">
                        <h1>
                            Our Programs
                        </h1>
                        <p className="text-gray-600 max-w-2xl">
                            Choose from our industry-focused programs designed to make you
                            job-ready with hands-on learning and expert mentorship.
                        </p>
                    </div>

                    {/* COURSES GRID */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {courses.map((course, idx) => (
                            <div
                                key={idx}
                                className="border rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                <h3 className="text-xl font-semibold mb-3 texrt-gray-900">
                                    {course.title}
                                </h3>

                                <p className="text-gray-600 mb-4">
                                    {course.desc}
                                </p>

                                <div className="text-sm text-gray-500 mb-6 space-y-1">
                                    <p><span className="font-medium">Duration:</span> {course.duration}</p>
                                    <p><span className="font-medium">Level:</span> {course.level}</p>
                                </div>

                                <button className="text-black font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                                    View Details →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </>
    )
}