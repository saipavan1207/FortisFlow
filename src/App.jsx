import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Product from './pages/Product'
import Contact from './pages/Contact'

// Landing Page Layout
const LandingPage = () => (
  <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-500/30">
    <Navbar />
    <main>
      <Hero />
      <Features />
      {/* Footer can go here */}
      <footer className="bg-zinc-950 py-12 border-t border-white/5 text-center text-zinc-600 text-sm">
        <p>© 2024 FortisFlow. All rights reserved.</p>
      </footer>
    </main>
  </div>
)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product" element={<Product />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  )
}

export default App
