import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
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
import Dashboard from './components/sections/Dashboard'
import Transactions from './pages/Transactions'
import Cards from './pages/Cards'
import Goals from './pages/Goals'
import AuthGuard from './components/layout/AuthGuard'
import DashboardLayout from './components/layout/DashboardLayout'

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
  useEffect(() => {
    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          // Only redirect from auth pages if logged in
          const authRoutes = ['/login', '/signup'];
          if (authRoutes.includes(window.location.pathname)) {
            window.location.href = '/dashboard';
          }
        }
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

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

        {/* Protected Dashboard/App Routes */}
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/cards" element={<Cards />} />
          <Route path="/goals" element={<Goals />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
