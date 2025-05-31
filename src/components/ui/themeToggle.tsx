"use client";

import { FaSun, FaMoon } from "react-icons/fa";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
            <button
                className="rounded-full w-9 h-9 absolute top-4 right-4 bg-white/10 backdrop-blur-sm"
                disabled
                aria-label="Cambiar tema"
            >
                <FaMoon className="w-4 h-4 text-primary mx-auto my-auto" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="rounded-full w-9 h-9 absolute top-4 right-4 bg-white/10 backdrop-blur-sm dark:bg-gray-800/30 hover:bg-white/20 dark:hover:bg-gray-700/40 transition-colors"
            aria-label="Cambiar tema"
        >
            {theme === "dark" ? (
                <FaSun className="w-4 h-4 text-yellow-400 mx-auto my-auto" />
            ) : (
                <FaMoon className="w-4 h-4 text-primary mx-auto my-auto" />
            )}
        </button>
    );
};

export default ThemeToggle;
