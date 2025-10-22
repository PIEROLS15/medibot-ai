"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/loader";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => setTimeout(() => setLoading(false), 500);

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return <>{loading ? <Loader /> : children}</>;
}
