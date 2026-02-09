import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function UnicornBackground() {
    const location = useLocation();

    useEffect(() => {
        // If already initialized, do nothing
        if (window.UnicornStudio?.isInitialized) return;

        // Check if script is already in DOM to avoid duplicates
        if (document.querySelector('script[src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js"]')) {
            // If script exists but not initialized (rare race condition), try init
            if (window.UnicornStudio) {
                window.UnicornStudio.init();
            }
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.onload = () => {
            if (window.UnicornStudio) {
                window.UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
            }
        };
        document.body.appendChild(script);
    }, []);

    // Re-init on navigation to ensure persistence
    useEffect(() => {
        if (window.UnicornStudio) {
            // Short timeout to let React render happen
            setTimeout(() => {
                window.UnicornStudio.init();
            }, 100);
        }
    }, [location.pathname]);

    return (
        <div
            id="unicorn-bg"
            data-us-project="p7Ff6pfTrb5Gs59C7nLC"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
            }}
        />
    );
}
