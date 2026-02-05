import React from 'react'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import Features from '../components/sections/Features'
import Dashboard from '../components/sections/Dashboard'
import CTA from '../components/sections/CTA'
import Footer from '../components/layout/Footer'

const LandingPage = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <Hero />
            <Features />
            <Dashboard />
            <CTA />
            <Footer />
        </div>
    )
}

export default LandingPage
