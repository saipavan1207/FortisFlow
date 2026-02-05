import React from 'react'



// Determine the items to display. I'll stick to the 3 requested but repeat them to fill space.
const items = [
    "Real-time spend intelligence",
    "AI-driven savings guidance",
    "Financial health"
]

const CapabilityStrip = () => {
    return (
        <div className="w-full py-12 relative overflow-hidden z-20">
            {/* Title */}
            <div className="text-center mb-8 relative z-10 px-4">
                <p className="text-[12px] font-light tracking-[4px] text-[#5B6B7C] uppercase font-heading">
                    Built for modern financial decision making
                </p>
            </div>

            {/* Marquee Container */}
            <div className="relative flex overflow-hidden">
                {/* Fade Gradients */}
                <div className="absolute inset-y-0 left-0 w-20 sm:w-40 bg-gradient-to-r from-[#09090b] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 sm:w-40 bg-gradient-to-l from-[#09090b] to-transparent z-10 pointer-events-none" />

                {/* Marquee Track */}
                <div className="flex animate-scroll hover:[animation-play-state:paused] min-w-full">
                    {/* First Set (Repeated 4 times to ensure width) */}
                    <div className="flex items-center gap-[80px] px-[40px] whitespace-nowrap">
                        {[...Array(4)].map((_, groupIndex) => (
                            <React.Fragment key={`group-${groupIndex}`}>
                                {items.map((item, i) => (
                                    <span key={`${groupIndex}-${i}`} className="text-[16px] font-semibold text-[#5B6B7C] font-heading">
                                        {item}
                                    </span>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Duplicate Set for Seamless Loop */}
                    <div className="flex items-center gap-[80px] px-[40px] whitespace-nowrap">
                        {[...Array(4)].map((_, groupIndex) => (
                            <React.Fragment key={`group-dup-${groupIndex}`}>
                                {items.map((item, i) => (
                                    <span key={`${groupIndex}-${i}`} className="text-[16px] font-semibold text-[#5B6B7C] font-heading">
                                        {item}
                                    </span>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CapabilityStrip
