import React, { useState, useRef } from 'react';
import { ArrowRight, Twitter, Github, Linkedin } from 'lucide-react';


const features = [
    {
        title: "Automated Card & UPI Sync",
        description:
            "Securely link debit/credit cards or UPI accounts to automatically import transactions. No more manual entry — FortisFlow categorizes expenses and income in real time.",
        highlight: "Auto-sync • Smart categorization • User-controlled privacy",
        img: "/images/card-speed.png",
        imageClass: "object-cover",
        containerDimensions: "w-80 h-80 md:w-[420px] md:h-[420px] lg:w-[480px] lg:h-[480px]"
    },
    {
        title: "Manual or Automated — Your Choice",
        description:
            "Users can switch between automated tracking and manual entry anytime. Full flexibility for people who want control or prefer seamless automation.",
        highlight: "Flexible tracking • Editable entries • Full control",
        img: "/images/manual-mode.png",
        imageClass: "object-cover",
        containerDimensions: "w-72 h-[30rem] md:w-[320px] md:h-[560px] lg:w-[360px] lg:h-[640px]"
    },
    {
        title: "Smart Reports & PDF Exports",
        description:
            "Download monthly or yearly financial reports in PDF format with clean summaries and categorized breakdowns for easy sharing and analysis.",
        highlight: "One-click export • Detailed summaries • Professional PDFs",
        img: "/images/smart-reports.png",
        imageClass: "object-cover",
        containerDimensions: "w-full h-64 md:w-[600px] md:h-[360px] lg:w-[680px] lg:h-[400px]"
    },
    {
        title: "Visual Expense Analytics",
        description:
            "Interactive charts and categorized graphs help users instantly understand spending patterns and financial trends.",
        highlight: "Live graphs • Category insights • Visual clarity",
        img: "/images/dashboard-analytics.png",
        imageClass: "object-cover",
        containerDimensions: "w-full h-64 md:w-[600px] md:h-[360px] lg:w-[680px] lg:h-[400px]"
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [opacity, setOpacity] = useState(1);

    const handleNext = () => {
        setOpacity(0);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % features.length);
            setOpacity(1);
        }, 300);
    };

    const handlePrev = () => {
        setOpacity(0);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
            setOpacity(1);
        }, 300);
    };

    const current = features[currentIndex];

    return (
        <div className="mx-auto max-w-7xl px-6 md:px-0">
            <div className="flex flex-col gap-x-16 gap-y-16 rounded-3xl border border-[#ffffff]/10 bg-zinc-900/50 backdrop-blur-xl mt-24 mb-24 px-8 pt-8 pb-16">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end gap-8 w-full gap-x-8 gap-y-8 justify-between">
                    <div className="flex flex-col gap-6 max-w-3xl">
                        <div className="flex gap-3 gap-x-3 gap-y-3 items-center">
                            <span className="flex items-center justify-center text-[11px] font-medium text-blue-400 font-mono bg-blue-500/10 w-7 h-7 border-blue-500/20 border rounded-lg shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                                03
                            </span>
                            <span className="uppercase text-sm font-medium text-gray-500 tracking-widest font-sans">
                                Features
                            </span>
                        </div>
                        <h2 className="md:text-5xl lg:text-6xl leading-[1.1] text-4xl text-white font-oswald font-light tracking-tight">
                            Smart automation for your finances.
                            <span className="text-gray-600 font-oswald font-light tracking-tight block mt-2">
                                Built for real-world money management.
                            </span>
                        </h2>
                        <p className="text-lg text-gray-400 font-light max-w-xl leading-relaxed font-sans">
                            Connect your cards and UPI to automatically track expenses, categorize transactions, and generate intelligent financial reports — all in one secure platform.
                        </p>
                    </div>

                </div>

                {/* Testimonials Carousel */}
                <div className="overflow-hidden flex flex-col md:p-16 lg:flex-row lg:gap-20 lg:pt-4 lg:pb-4 lg:pl-4 lg:pr-8 bg-zinc-900/50 backdrop-blur-xl w-full max-w-6xl border-white/10 border rounded-3xl mr-auto ml-auto pt-8 pr-8 pb-8 pl-8 relative shadow-2xl gap-x-12 gap-y-12 items-center">

                    {/* Pricing Card Background */}
                    <div className="pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-900/10 to-transparent absolute top-0 right-0 bottom-0 left-0 z-0"></div>
                    <div className="z-0 opacity-20 absolute top-0 right-0 bottom-0 left-0" style={{ backgroundImage: "radial-gradient(white 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>

                    {/* Image Section */}
                    <div className="lg:w-[55%] flex min-h-[420px] md:min-h-[520px] w-full relative items-center justify-center z-10">
                        <div className={`z-10 group cursor-pointer overflow-hidden bg-white/5 border-0 rounded-[2.5rem] pt-1 pr-1 pb-1 pl-1 relative shadow-2xl transition-all duration-500 ease-in-out ${current.containerDimensions}`}>
                            <img
                                src={current.img}
                                alt={current.title}
                                className={`transform transition-transform duration-700 group-hover:scale-105 w-full h-full rounded-[2.2rem] ${current.imageClass || 'object-cover'}`}
                                style={{ opacity: opacity, transition: 'opacity 300ms ease-in-out' }}
                            />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="lg:w-1/2 flex flex-col z-10 w-full relative">
                        <div className="mb-6 text-indigo-500">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.01697 21L5.01697 18C5.01697 16.8954 5.9124 16 7.01697 16H10.017C10.5693 16 11.017 15.5523 11.017 15V9C11.017 8.44772 10.5693 8 10.017 8H6.01697C5.46468 8 5.01697 8.44772 5.01697 9V11C5.01697 11.5523 4.56925 12 4.01697 12H3.01697V5H13.017V15C13.017 18.3137 10.3307 21 7.01697 21H5.01697Z"></path>
                            </svg>
                        </div>

                        <h3
                            className="md:text-4xl text-2xl font-light text-white font-oswald mb-4"
                            style={{ opacity: opacity, transition: 'opacity 300ms ease-in-out' }}
                        >
                            {current.title}
                        </h3>

                        <p
                            className="text-gray-400 text-lg mb-6"
                            style={{ opacity: opacity, transition: 'opacity 300ms ease-in-out' }}
                        >
                            {current.description}
                        </p>

                        <p
                            className="text-indigo-400 text-sm font-medium"
                            style={{ opacity: opacity, transition: 'opacity 300ms ease-in-out' }}
                        >
                            {current.highlight}
                        </p>

                        <div className="flex flex-row items-center justify-between gap-4 border-t border-white/10 pt-8">
                            <div></div>

                            <div className="flex items-center gap-3">
                                <button onClick={handlePrev} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-indigo-600 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 18-6-6 6-6"></path>
                                    </svg>
                                </button>
                                <button onClick={handleNext} className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-indigo-600 transition-all duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
