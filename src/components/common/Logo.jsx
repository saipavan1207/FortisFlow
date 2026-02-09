import React from 'react'

const Logo = ({ className = "", width = "24", height = "36" }) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="48 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <path d="M48 0H72V12H60L48 0ZM48 12H60L72 24H48V12ZM48 24H60V36L48 24Z" fill="currentColor" />
        </svg>
    )
}

export default Logo
