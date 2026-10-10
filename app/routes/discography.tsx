import { useState, useRef, useEffect, useMemo } from "react";
import siteData from "../data/site-data.json";
import type { SiteData, Release } from "../types/data";
import type { Route } from "./+types/home";

const data = siteData as SiteData;
const IMAGE_BASE_URL = "/images/covers/";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "discography" },
    ];
}

export default function Discography() {
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    const activeRelease: Release = data.releases[activeIndex] || data.releases[0];

    // 1. Dynamically extract unique years (sorted descending)
    const availableYears = useMemo(() => {
        const years = data.releases
            .map((release) => new Date(release.releaseDate).getFullYear())
            .filter((year) => !isNaN(year));

        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, []);

    const activeYear = new Date(activeRelease.releaseDate).getFullYear();

    // 2. Track active index via IntersectionObserver (optimized threshold for instant response)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute("data-index"));
                        if (!isNaN(index)) {
                            setActiveIndex(index);
                        }
                    }
                });
            },
            {
                threshold: 0.2, // Triggers earlier for a snappier response
            }
        );

        itemRefs.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // 3. Scroll to the first release of the selected year
    const scrollToYear = (targetYear: number) => {
        const targetIndex = data.releases.findIndex((release) => {
            const releaseYear = new Date(release.releaseDate).getFullYear();
            return releaseYear === targetYear;
        });

        if (targetIndex !== -1 && itemRefs.current[targetIndex]) {
            itemRefs.current[targetIndex]?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            ref={containerRef}
            className="text-right w-full relative snap-y snap-mandatory overflow-y-auto h-[calc(100vh-80px)] h-[calc(100dvh-80px)]"
        >
            {/* 1. STICKY DISPLAY FRAME */}
            <div className="sticky top-0 w-full h-full flex flex-col-reverse md:grid md:grid-cols-2 overflow-hidden pointer-events-none">

                {/* LEFT COLUMN: Details Panel & Year Filters */}
                <div className="flex-1 flex flex-col justify-between p-6 md:p-12 border-t md:border-t-0 md:border-r border-text/10 bg-background/50 z-10 pointer-events-auto overflow-y-auto">

                    {/* Details Content */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className="text-2xl md:text-4xl tracking-tight text-text break-words">
                                {activeRelease.title}
                            </h2>
                            <p className="text-sm">{activeRelease.releaseDate.split("-")[0]}</p>
                        </div>

                        {/* Platform Links */}
                        {activeRelease.links && (
                            <div className="flex flex-col gap-2">
                                {Object.entries(activeRelease.links).map(([platform, url]) => (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="!lowercase text-xs md:text-sm py-1 block"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between gap-0.5 md:gap-2">
                                            <div className="font-medium shrink-0"><span>{platform}:</span></div>
                                            <div className="break-all text-text/70"><span>{url}</span></div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Year Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2 justify-end pt-4">
                        {availableYears.map((year) => {
                            const isSelected = activeYear === year;
                            return (
                                <p
                                    key={year}
                                    onClick={() => scrollToYear(year)}
                                    className={`transition-colors cursor-pointer [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180 text-xs md:text-sm ${isSelected
                                        ? "!text-highlight font-bold"
                                        : ""
                                        }`}
                                >
                                    {year}
                                </p>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COLUMN: Single Active Cover Image (Lag-Free) */}
                <div className="relative h-[260px] md:h-full w-full flex items-center justify-center p-4 md:p-16 overflow-hidden shrink-0">
                    <div className="relative aspect-square w-full h-full max-w-xs md:max-w-xl flex items-center justify-center">
                        <img
                            src={`${IMAGE_BASE_URL}${activeRelease.image}`}
                            alt={activeRelease.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* 2. INVISIBLE SCROLL TARGETS */}
            <div className="absolute inset-0 top-0 left-0 w-full pointer-events-none">
                {data.releases.map((release, index) => (
                    <div
                        key={`snap-${release.title}`}
                        data-index={index}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        className="w-full h-full min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)] snap-start"
                    />
                ))}
            </div>
        </div>
    );
}