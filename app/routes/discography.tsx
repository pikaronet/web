import { useState, useRef, useEffect, useMemo } from "react";
import siteData from "../data/site-data.json";
import type { SiteData, Release } from "../types/data";
import type { Route } from "./+types/home";

const rawData = siteData as SiteData;
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

    // Throttle ref to prevent rapid-fire scrolling skips
    const isScrollingRef = useRef<boolean>(false);
    const touchStartYRef = useRef<number>(0);

    // Sort releases by releaseDate descending (newest first)
    const sortedReleases = useMemo(() => {
        return [...rawData.releases].sort((a, b) => {
            return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        });
    }, []);

    const activeRelease: Release = sortedReleases[activeIndex] || sortedReleases[0];

    // 1. Dynamically extract unique years (sorted descending)
    const availableYears = useMemo(() => {
        const years = sortedReleases
            .map((release) => new Date(release.releaseDate).getFullYear())
            .filter((year) => !isNaN(year));

        return Array.from(new Set(years)).sort((a, b) => b - a);
    }, [sortedReleases]);

    const activeYear = new Date(activeRelease.releaseDate).getFullYear();

    // 2. Custom instant-scroll handler function
    const changeRelease = (direction: "next" | "prev") => {
        if (isScrollingRef.current) return;

        setActiveIndex((prev) => {
            let nextIndex = prev;
            if (direction === "next" && prev < sortedReleases.length - 1) {
                nextIndex = prev + 1;
            } else if (direction === "prev" && prev > 0) {
                nextIndex = prev - 1;
            }

            if (nextIndex !== prev) {
                isScrollingRef.current = true;
                // Scroll the corresponding target into view smoothly
                itemRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });

                // Reset throttle lock after animation completes
                setTimeout(() => {
                    isScrollingRef.current = false;
                }, 200);
            }
            return nextIndex;
        });
    };

    // Desktop Wheel Event Listener
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            if (Math.abs(e.deltaY) < 20) return; // Ignore micro-scrolls

            if (e.deltaY > 0) {
                changeRelease("next");
            } else {
                changeRelease("prev");
            }
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => container.removeEventListener("wheel", handleWheel);
    }, [activeIndex]);

    // Mobile Touch Gesture Listeners
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartYRef.current - touchEndY;

        if (Math.abs(diff) > 40) { // Minimum swipe threshold
            if (diff > 0) {
                changeRelease("next"); // Swipe Up
            } else {
                changeRelease("prev"); // Swipe Down
            }
        }
    };

    // 3. Scroll to the first release of the selected year
    const scrollToYear = (targetYear: number) => {
        const targetIndex = sortedReleases.findIndex((release) => {
            const releaseYear = new Date(release.releaseDate).getFullYear();
            return releaseYear === targetYear;
        });

        if (targetIndex !== -1 && itemRefs.current[targetIndex]) {
            setActiveIndex(targetIndex);
            itemRefs.current[targetIndex]?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="text-right w-full relative overflow-y-hidden h-[calc(100vh-80px)] h-[calc(100dvh-80px)] select-none"
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
                            <p className="text-sm text-text">{activeRelease.releaseDate.split("-")[0]}</p>
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
                                        className="!lowercase text-xs md:text-sm py-1 block text-text hover:!text-highlight transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:justify-between gap-0.5 md:gap-2">
                                            <div className="font-medium shrink-0"><span>{platform}:</span></div>
                                            <div className="break-all text-inherit"><span>{url}</span></div>
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
                                        : "hover:text-highlight"
                                        }`}
                                >
                                    {year}
                                </p>
                            );
                        })}
                    </div>
                </div>

                {/* RIGHT COLUMN: Cross-Fading Cover Images */}
                <div className="relative h-[260px] md:h-full w-full flex items-center justify-center p-4 md:p-16 overflow-hidden shrink-0">
                    {sortedReleases.map((release, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <div
                                key={release.title}
                                className={`absolute inset-0 flex items-center justify-center p-4 md:p-16 transition-opacity duration-350 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                                    }`}
                            >
                                <div className="relative aspect-square w-full h-full max-w-xs md:max-w-xl flex items-center justify-center">
                                    <img
                                        src={`${IMAGE_BASE_URL}${release.image}`}
                                        alt={release.title}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 2. INVISIBLE SCROLL TARGETS */}
            <div className="absolute inset-0 top-0 left-0 w-full pointer-events-none overflow-hidden">
                {sortedReleases.map((release, index) => (
                    <div
                        key={`snap-${release.title}`}
                        data-index={index}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        className="w-full h-full min-h-[calc(100vh-80px)] min-h-[calc(100dvh-80px)]"
                    />
                ))}
            </div>
        </div>
    );
}