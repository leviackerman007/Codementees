import { mentorsData } from "../data/mentorsData";
import MentorCard from "../components/MentorCard";

export default function Mentors() {
    return (
        <section className="surface py-20">
            <div className="max-w-7xl mx-auto px-6">
                {/* HEADER */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        Our Mentors
                    </h1>
                    <p className="max-w-2xl">
                        Learn from industry professionals with real-world experience
                        and a passion for teaching.
                    </p>
                </div>

                {/* GRID */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {mentorsData.map((mentor)=>(
                        <MentorCard key={mentor.id} mentor={mentor} />
                    ))}
                </div>
            </div>
        </section>
    )
}