import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggle = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggle, mounted }}>
            <div className={`relative min-h-screen transition-colors duration-500 font-outfit ${isDark ? 'bg-[#0a0a0a] text-white' : 'bg-[#fafafa] text-[#1a1a1a]'
                }`}>
                {/* GOLDEN SUNLIGHT HUE - Top Left (4% transparency) */}
                <div
                    className="fixed top-[-10%] left-[-10%] w-[70vw] h-[70vw] rounded-full pointer-events-none z-0 transition-opacity duration-1000"
                    style={{
                        background: 'radial-gradient(circle, rgba(234, 201, 150, 0.15) 0%, rgba(234, 201, 150, 0) 70%)',
                        opacity: isDark ? 0.5 : 0.8
                    }}
                />
                {mounted ? children : null}
            </div>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);