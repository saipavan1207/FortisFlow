import React from 'react'

const Input = ({ label, type = 'text', placeholder, ...props }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label className="text-sm font-medium text-[var(--color-text-secondary)] ml-1">{label}</label>}
            <input
                type={type}
                placeholder={placeholder}
                className="
          w-full px-4 py-3 rounded-xl
          bg-[var(--glass-bg)] border border-[var(--glass-border)]
          text-white placeholder:text-[var(--color-text-description)]
          focus:outline-none focus:border-[var(--color-accent-cyan)]
          focus:shadow-[0_0_15px_rgba(0,242,234,0.1)]
          transition-all duration-300
        "
                {...props}
            />
        </div>
    )
}

export default Input
