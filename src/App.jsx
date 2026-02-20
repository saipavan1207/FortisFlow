import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Hero from './components/sections/Hero'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Product from './pages/Product'
import Contact from './pages/Contact'
import Footer from './components/layout/Footer'
import MainLayout from './components/layout/MainLayout'
import AuthLayout from './components/layout/AuthLayout'
import UnicornBackground from './components/common/UnicornBackground'
import SolutionPage from './pages/SolutionPage'
// Landing Page Layout
const LandingPage = () => (
  <div className="min-h-screen bg-transparent text-white selection:bg-blue-500/30">
    <Navbar />
    <main>
      <Hero />
      <Footer />
    </main>
  </div>
)

function App() {
  return (
    <Router>
      <UnicornBackground />
      <Routes>
        {/* Main Routes with Unicorn Background */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/solution" element={<SolutionPage />} />
        </Route>

        {/* Auth Routes without Background */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
