import React from 'react'
import Button from '../common/Button'
import { ArrowRight } from 'lucide-react'

const CTA = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-accent-blue)]/20 to-transparent -z-10"></div>

            <div className="container mx-auto px-6 text-center">
                <div className="max-w-3xl mx-auto space-y-8 p-12 rounded-3xl bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-2xl relative overflow-hidden">
                    {/* Glow behind */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[var(--color-accent-blue)]/10 blur-3xl -z-10"></div>

                    <h2 className="text-3xl md:text-5xl font-bold">
                        Ready to Take Control?
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-lg">
                        Join thousands of smart savers who are optimizing their financial life with FinFlow AI.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg shadow-[0_0_40px_rgba(0,89,255,0.4)]">
                            Get Started Free
                        </Button>
                        <Button variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
                            View Pricing
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CTA
