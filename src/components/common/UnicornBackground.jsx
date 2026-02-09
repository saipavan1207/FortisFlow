import { useEffect } from "react";

export default function UnicornBackground() {
    useEffect(() => {
        // If already initialized, do nothing
        if (window.UnicornStudio?.isInitialized) return;

        // Check if script is already in DOM to avoid duplicates
        if (document.querySelector('script[src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js"]')) {
            // If script exists but not initialized (rare race condition), try init
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                window.UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
            }
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
        script.onload = () => {
            if (window.UnicornStudio && !window.UnicornStudio.isInitialized) {
                window.UnicornStudio.init();
                window.UnicornStudio.isInitialized = true;
            }
        };
        document.body.appendChild(script);
    }, []);

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
