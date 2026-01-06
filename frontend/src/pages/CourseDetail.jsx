import {useParams} from "react-router-dom"
import { coursesData } from "../data/coursesData"

export default function CourseDetail() {
    const {id} = useParams();
    const course=coursesData.find(c=>c.id===id);

    if(!course){
        return (
            <div className="max-w-4xl mx-auto px-6 py-24">
                <h1 className="text-2xl font-bold">Course not found</h1>
            </div>
        );
    }
    return (
        <section className="bg-white">
            <div className="max-w-4xl mx-auto px-6 pt-28 pb-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {course.title}
                </h1>
                
                <p className="text-gray-600 mb-6">
                    {course.description}
                </p>

                <div className="flex gap-6 text-sm text-gray-500 mb-8">
                    <p className="font-medium"><span>Duration:</span> {course.duration}</p>
                    <p className="font-medium"><span>Level:</span> {course.level}</p>
                </div>

                <h2 className="text-xl font-semibold mb-3">
                    What you'll learn
                </h2>

                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {course.includes.map((item,idx)=>(
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>
        </section>
    )
}