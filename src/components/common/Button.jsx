import React from 'react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = 'px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer'

    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1',
        shiny: 'shiny-cta text-white relative',
        secondary: 'bg-zinc-800/50 text-white hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600',
        ghost: 'text-zinc-400 hover:text-white hover:bg-white/5'
    }

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    )
}

export default Button
