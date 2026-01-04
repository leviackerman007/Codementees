import {motion} from 'framer-motion';
import heroImage from '../assets/hero-image.png';

export default function HeroSection(){
    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto px-6 pt-28 pb-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">

                <motion.div 
                    initial={{opacity:0,y:30}}
                    animate={{opacity:1,y:0}}
                    transition={{duration:0.5, ease:"easeOut"}}
                    className="max-w-6xl mx-auto px-6 py-24 pb-20 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                        Learn Industry Ready Skills
                        <br className='hidden md:block'/>
                        with Expert Mentorship
                    </h1>
                    
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        Structured programs, real-world projects, and guidance from 
                        professionals to help you become job-ready.
                    </p>

                    
                    <div className="flex justify-center gap-4">
                        <button className="bg-black text-white px-6 py-3 rounded-md hover:bg-fray-800 transition">
                            Explore Programs
                        </button>
                        <button className="border border-gray-300 px-6 py-3 rounded-md hover:bg-gray-100 transition">
                            Talk to Mentor
                        </button>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{opacity:0, scale:0.95}}
                    animate={{opacity:1,scale:1}}
                    transition={{duration:0.5,ease:"easeOut",delay:0.1}}
                    className="flex justify-center"
                >
                    <img 
                        src={heroImage} 
                        alt="Learning Illustration" 
                        className="w-full max-w-md"
                    />

                </motion.div>
                </div>
            </div>
        </section>
    );
}