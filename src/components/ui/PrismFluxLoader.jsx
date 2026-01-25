import React, { useState, useEffect } from "react";
import { PlusIcon } from "lucide-react";

export const PrismFluxLoader = ({
    size = 30,
    speed = 5,
    textSize = 50,
}) => {
    const [time, setTime] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    // Loader steps
    const statuses = ["Fetching", "Fixing", "Updating", "Placing", "Syncing", "Processing"];

    // Cube rotation timer
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prev) => prev + 0.02 * speed);
        }, 16);
        return () => clearInterval(interval);
    }, [speed]);

    // Status text timer (changes every 600ms)
    useEffect(() => {
        const statusInterval = setInterval(() => {
            setStatusIndex((prev) => (prev + 1) % statuses.length);
        }, 600);
        return () => clearInterval(statusInterval);
    }, [statuses.length]);

    const half = size / 2;
    const currentStatus = statuses[statusIndex];

    return (
        <div className="flex flex-col items-center justify-center gap-4 h-[220px]">
            {/* Cube Container */}
            <div
                className="relative"
                style={{
                    width: size,
                    height: size,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${time * 30}deg) rotateX(${time * 30}deg)`,
                }}
            >
                {/* Cube Faces */}
                {statuses.slice(0, 6).map((text, i) => {
                    const faceTransforms = [
                        `rotateY(0deg) translateZ(${half}px)`,   // front
                        `rotateY(180deg) translateZ(${half}px)`, // back
                        `rotateY(90deg) translateZ(${half}px)`,  // right
                        `rotateY(-90deg) translateZ(${half}px)`, // left
                        `rotateX(90deg) translateZ(${half}px)`,  // top
                        `rotateX(-90deg) translateZ(${half}px)`, // bottom
                    ];

                    return (
                        <div
                            key={i}
                            className="absolute flex items-center justify-center font-semibold text-[#CCFF00]"
                            style={{
                                width: size,
                                height: size,
                                border: `1px solid #CCFF00`,
                                transform: faceTransforms[i],
                                backfaceVisibility: "hidden",
                                fontSize: `${textSize}px`,
                            }}
                        >
                            <PlusIcon size={size * 0.5} />
                        </div>
                    );
                })}
            </div>

            {/* Status Text Below Cube */}
            <div className="text-sm font-semibold text-[#CCFF00] tracking-wide font-['JetBrains_Mono']">
                {currentStatus}...
            </div>
        </div>
    );
};

export default PrismFluxLoader;
