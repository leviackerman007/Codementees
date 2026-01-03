import {motion} from 'framer-motion';
export default function HeroSection(){
    return (
        <section className="bg-gray-50">
            <motion.div 
                initial={{opacity:0,y:30}}
                animate={{opacity:1,y:0}}
                transition={{duration:0.6, ease:"easeOut"}}
                className="max-w-6xl mx-auto px-6 py-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Learn Industry Ready Skills
                </h1>
                
                <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                    Learn from mentors who work in the industry and build real projects.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="bg-black text-white px-6 py-3 rounded">
                        Explore Programs
                    </button>
                    <button className="border px-6 py-3 rounded hover:bg-gray-100">
                        Talk to Mentor
                    </button>
                </div>
            </motion.div>
        </section>
    )
}