"use client";

import Image from "next/image";
import { useLoaderTheme } from '@/hooks/useLoaderTheme';

export default function Loader() {
    const logoPath = process.env.NEXT_PUBLIC_LOGO_PATH || "/default_logo.png";
    const isDark = useLoaderTheme();

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
