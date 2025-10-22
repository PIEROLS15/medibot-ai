"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Loader() {
    const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || "/default_logo.png";
    const [isDark, setIsDark] = useState<boolean | null>(null);

    useEffect(() => {

        const localTheme = typeof window !== "undefined" ? localStorage.getItem("theme") : null;

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        const initialIsDark =
            localTheme === "dark" || (!localTheme && prefersDark);

        setIsDark(initialIsDark);

        const observer = new MutationObserver(() => {
            const hasDark = document.documentElement.classList.contains("dark");
            setIsDark(hasDark);
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    if (isDark === null) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-500 ${isDark ? "bg-[#1f2937]" : "bg-white"
                }`}
        >
            <Image
                src={logoPath}
                alt="Logo"
                width={120}
                height={120}
                className="mb-6 select-none"
                priority
            />
            <div className="h-10 w-10 border-4 border-[#1279ff] border-t-transparent rounded-full animate-spin" />
        </div>
    );
}
