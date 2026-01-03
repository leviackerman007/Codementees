import { Link } from "react-router-dom";
import {useState} from 'react'

export default function Navbar() {
    const [isOpen,setIsOpen]=useState(false);
  return (
<nav className="sticky top-0 z-50 bg-white border-b">
      <div className="flex justify-between items-center px-10 py-4">

        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          Codementees
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex gap-6 font-medium">
          <Link className="hover:text-gray-600" to="/courses">Programs</Link>
          <Link className="hover:text-gray-600" to="/mentors">Mentors</Link>
          <Link className="hover:text-gray-600" to="/about">About</Link>
          <Link className="hover:text-gray-600" to="/contact">Contact</Link>
        </div>

        {/* Actions */}
        <div className="hidden md:flex gap-4 items-center">
          <Link to="/login">Login</Link>
          <Link
            to="/register"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Join Now
          </Link>
        </div>

        {/* Animated Mobile Menu */}
        
        <button
          className="md:hidden text-2xl transition-transform duration-300"
          onClick={()=>setIsOpen(!isOpen)}
          >
            {isOpen ? '✕' : '☰'}
        </button>
      </div>
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        >
          <div className="px-6 pb-4 flex flex-col gap-4">
                <Link onClick={()=>setIsOpen(false)} to='/courses'>Programs</Link>
                <Link onClick={()=>setIsOpen(false)} to='/mentors'>Mentors</Link>
                <Link onClick={()=>setIsOpen(false)} to='/about'>About</Link>
                <Link onClick={()=>setIsOpen(false)} to='/contact'>Contact</Link>
                <div className="pt-4 border-t flex flex-col gap-3">
                    <Link onClick={()=>setIsOpen(false)} to='/login'>Login </Link>
                    <Link onClick={()=>setIsOpen(false)}
                        to="/register"
                        className="bg-black text-white px-4 py-2 rounded text-center"
                    >Join Now
                    </Link>
                </div>
            </div>
        </div>
    </nav>
  );
}
