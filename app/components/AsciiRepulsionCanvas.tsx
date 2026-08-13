import React, { useEffect, useRef, useState } from 'react';

interface AsciiRepulsionCanvasProps {
    imageSrc: string;
    cellSize?: number; // Distance between characters in px (default: 8)
    mouseRadius?: number; // Radius of repulsion field (default: 120)
    repulsionForce?: number; // Strength of push (default: 8)
    springReturnSpeed?: number; // Return speed factor 0-1 (default: 0.05)
    friction?: number; // Damping factor 0-1 (default: 0.88)
    densityString?: string; // Characters ordered from dark to light
    textColor?: string; // Optional override (defaults to var(--text))
    maxDimension?: number; // Max width or height before pixel sampling (default: 500)
}

class Particle {
    originX: number;
    originY: number;
    x: number;
    y: number;
    char: string;
    vx: number = 0;
    vy: number = 0;

    constructor(x: number, y: number, char: string) {
        this.originX = x;
        this.originY = y;
        this.x = x;
        this.y = y;
        this.char = char;
    }

    update(
        mouseX: number | null,
        mouseY: number | null,
        radius: number,
        forceStrength: number,
        returnSpeed: number,
        friction: number
    ) {
        if (mouseX !== null && mouseY !== null) {
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.hypot(dx, dy);

            // 1. Mouse Repulsion Force
            if (distance < radius && distance > 0) {
                const angle = Math.atan2(dy, dx);
                const force = (radius - distance) / radius;
                this.vx -= Math.cos(angle) * force * forceStrength;
                this.vy -= Math.sin(angle) * force * forceStrength;
            }
        }

        // 2. Spring force back to home position
        this.vx += (this.originX - this.x) * returnSpeed;
        this.vy += (this.originY - this.y) * returnSpeed;

        // 3. Friction & Position Integration
        this.vx *= friction;
        this.vy *= friction;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillText(this.char, this.x, this.y);
    }
}

export const AsciiRepulsionCanvas: React.FC<AsciiRepulsionCanvasProps> = ({
    imageSrc,
    cellSize = 8,
    mouseRadius = 120,
    repulsionForce = 8,
    springReturnSpeed = 0.05,
    friction = 0.88,
    densityString = ' .:-=+*#%@',
    textColor,
    maxDimension = 500, // Safe maximum dimension for performance
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const mouseRef = useRef<{ x: number | null; y: number | null }>({
        x: null,
        y: null,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;

        img.onload = () => {
            // -------------------------------------------------------------
            // 1. CALCULATE RESIZED DIMENSIONS (Preserving Aspect Ratio)
            // -------------------------------------------------------------
            let targetWidth = img.width;
            let targetHeight = img.height;

            if (targetWidth > maxDimension || targetHeight > maxDimension) {
                if (targetWidth > targetHeight) {
                    targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
                    targetWidth = maxDimension;
                } else {
                    targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
                    targetHeight = maxDimension;
                }
            }

            // Set main canvas dimensions to the optimized size
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // -------------------------------------------------------------
            // 2. DOWNSCALE ON AN OFFSCREEN CANVAS
            // -------------------------------------------------------------
            const offscreenCanvas = document.createElement('canvas');
            offscreenCanvas.width = targetWidth;
            offscreenCanvas.height = targetHeight;
            const offscreenCtx = offscreenCanvas.getContext('2d');

            if (!offscreenCtx) return;

            // Draw and resize image onto the offscreen canvas
            offscreenCtx.drawImage(img, 0, 0, targetWidth, targetHeight);

            // Extract downscaled pixel data
            const imageData = offscreenCtx.getImageData(0, 0, targetWidth, targetHeight).data;

            // -------------------------------------------------------------
            // 3. BUILD ASCII PARTICLE GRID FROM REDUCED PIXELS
            // -------------------------------------------------------------
            particles = [];
            for (let y = 0; y < targetHeight; y += cellSize) {
                for (let x = 0; x < targetWidth; x += cellSize) {
                    const index = (y * targetWidth + x) * 4;
                    const r = imageData[index];
                    const g = imageData[index + 1];
                    const b = imageData[index + 2];
                    const a = imageData[index + 3];

                    if (a > 20) {
                        const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
                        const charIndex = Math.floor((brightness / 255) * (densityString.length - 1));
                        const char = densityString[charIndex];

                        particles.push(new Particle(x, y, char));
                    }
                }
            }

            setIsLoaded(true);

            // -------------------------------------------------------------
            // 4. ANIMATION LOOP
            // -------------------------------------------------------------
            const render = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const activeTextColor =
                    textColor ||
                    getComputedStyle(canvas).getPropertyValue('--text').trim() ||
                    '#ffffff';

                ctx.fillStyle = activeTextColor;
                ctx.font = `${cellSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                const { x: mx, y: my } = mouseRef.current;

                for (let i = 0; i < particles.length; i++) {
                    particles[i].update(mx, my, mouseRadius, repulsionForce, springReturnSpeed, friction);
                    particles[i].draw(ctx);
                }

                animationFrameId = requestAnimationFrame(render);
            };

            render();
        };

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            mouseRef.current = {
                x: (e.clientX - rect.left) * scaleX,
                y: (e.clientY - rect.top) * scaleY,
            };
        };

        const handleMouseLeave = () => {
            mouseRef.current = { x: null, y: null };
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [
        imageSrc,
        cellSize,
        mouseRadius,
        repulsionForce,
        springReturnSpeed,
        friction,
        densityString,
        textColor,
        maxDimension,
    ]);

    return (
        <div className="relative flex items-center justify-center w-full h-full max-w-full max-h-full overflow-hidden">
            {!isLoaded && <p style={{ fontFamily: 'monospace' }}>Processing image pixels...</p>}
            <canvas
                ref={canvasRef}
                className="block max-w-full max-h-full w-auto h-auto object-contain cursor-pointer rounded-lg"
                style={{
                    // Guarantees aspect ratio is preserved without stretching past parent bounds
                    maxHeight: '100%',
                    maxWidth: '100%',
                    objectFit: 'contain',
                }}
            />
        </div>
    );
};