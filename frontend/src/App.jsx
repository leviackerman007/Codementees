import {BrowserRouter, Routes, Route} from 'react-router-dom'
import HeroSection from './sections/HeroSection'
import Navbar from './components/Navbar'

function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <HeroSection />
    </BrowserRouter>
  )
}

export default App
