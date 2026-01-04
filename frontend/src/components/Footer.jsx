import { Link } from 'react-router-dom'


export default function Footer() {
    return (
        <footer className='bg-gray-900 text-gray-300'>
            {/* TOP SECTION */}
            <div className='max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4'>
                {/* BRAND */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">Codementees</h2>
                    <p className='text-gray-400 text-sm leading-relaxed'> Learn industry-ready skills with structured programs,
            real-world projects, and expert mentorship.</p>
                </div>
                {/* LINKS */}
                <div>
                    <h3 className='text-white font-semibold mb-4'>
                        Quick Links
                    </h3>
                    <ul className='space-y-2 text-sm'>
                        <li><Link to="/" className='hover:text-white transition'>Home</Link></li>
                        <li><Link to="/courses" className='hover:text-white transition'>Programs</Link></li>
                        <li><Link to="/mentors" className='hover:text-white transition'>Mentors</Link></li>
                        <li><Link to="/about" className='hover:text-white transition'>About</Link></li>
                        <li><Link to="/contact" className='hover:text-white transition'>Contact</Link></li>
                    </ul>
                </div>
                {/* PROGRAMS */}
                <div>
                    <h3 className='text-white font-semibold mb-4'>
                        Programs
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Full Stack Development</li>
                        <li>Data Science</li>
                        <li>DSA & Interview Preparation</li>
                        <li>Career Guidance</li>
                    </ul>
                </div>

                {/* CONTACT */}
                <div>
                    <h3 className='text-white font-semibold mb-4'>
                        Contact
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                        <li>Email: support@codementees.com</li>
                        <li>Phone: +91 98765 43210</li>
                        <li>Location: India</li>
                    </ul>
                </div>
            </div>
            {/* BOTTOM SECTION */}
            <div className='border-t border-gray-800'>
                <div className='max-w-7xl mx-auto px-6 py-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center'>
                    <p>
                        © {new Date().getFullYear()} Codementees. All rights reserved.
                    </p>

                    <div className='flex gap-4 mt-2 md:mt-0'>
                        <Link to="/privacy" className='hover:text-white'>
                            Privacy Policy
                        </Link>
                        <Link to="/terms" className='hover:text-white'>
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}