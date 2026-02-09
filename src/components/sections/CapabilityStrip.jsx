import React from 'react'

const items = [
    { text: 'Real-time spend intelligence', className: 'font-normal font-heading' },
    { text: 'AI-driven savings guidance', className: 'font-bold font-bricolage' },
    { text: 'Financial health', className: 'font-semibold font-merriweather' },
]

const CapabilityStrip = () => {
    return (
        <section className="z-10 sm:py-24 pt-8 pb-8 relative animate-fade-in-up">
            <div className="sm:px-6 lg:px-8 max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <p className="uppercase text-xs font-medium text-zinc-500 tracking-wide">Built for modern financial decision making</p>
                </div>

                {/* Ticker Container - Using mask for fade effect */}
                <div
                    className="overflow-hidden relative"
                    style={{
                        maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
                        WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
                    }}
                >
                    {/* Animated Ticker Track */}
                    <div
                        className="flex animate-scroll w-max gap-16 items-center"
                        style={{ animationDuration: '40s' }}
                    >
                        {/* First set */}
                        <div className="flex gap-16 shrink-0 items-center">
                            {items.map((item, index) => (
                                <div key={`i1-${index}`} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors duration-300 cursor-default">
                                    <span className={`text-sm md:text-base tracking-tight ${item.className}`}>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Duplicate set for seamless loop */}
                        <div className="flex gap-16 shrink-0 items-center">
                            {items.map((item, index) => (
                                <div key={`i2-${index}`} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors duration-300 cursor-default">
                                    <span className={`text-sm md:text-base tracking-tight ${item.className}`}>{item.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Triplicate set for wide screens */}
                        <div className="flex gap-16 shrink-0 items-center">
                            {items.map((item, index) => (
                                <div key={`i3-${index}`} className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors duration-300 cursor-default">
                                    <span className={`text-sm md:text-base tracking-tight ${item.className}`}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CapabilityStrip
