import { SVGAttributes, useId } from 'react';

/**
 * FEEDCHAIN brand mark — a clean geometric icon combining a stylized fish,
 * a subtle water wave and small feed pellets inside a rounded aquatic tile.
 * Rendered as inline SVG so it stays crisp at any size and needs no asset file.
 */
export default function FeedChainMark(props: SVGAttributes<SVGElement>) {
    const rawId = useId();
    const gradientId = `fc-mark-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="FEEDCHAIN" {...props}>
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0E7490" />
                    <stop offset="100%" stopColor="#0891B2" />
                </linearGradient>
            </defs>

            {/* Rounded aquatic tile */}
            <rect x="1" y="1" width="46" height="46" rx="14" fill={`url(#${gradientId})`} />

            {/* Feed pellets */}
            <circle cx="16" cy="13" r="1.6" fill="#A5F3FC" opacity="0.9" />
            <circle cx="22.5" cy="11" r="1.9" fill="#CFFAFE" opacity="0.95" />
            <circle cx="29" cy="13" r="1.6" fill="#A5F3FC" opacity="0.9" />

            {/* Fish body */}
            <ellipse cx="23" cy="25" rx="9.5" ry="6.5" fill="#FFFFFF" />
            {/* Fish tail */}
            <path d="M31.5 25 L39 19.5 L39 30.5 Z" fill="#FFFFFF" />
            {/* Fish eye */}
            <circle cx="18" cy="23" r="1.7" fill="#0E7490" />

            {/* Water wave */}
            <path
                d="M7 37 q4 -3 8 0 t8 0 t8 0 t8 0"
                fill="none"
                stroke="#67E8F9"
                strokeWidth="2.2"
                strokeLinecap="round"
                opacity="0.9"
            />
        </svg>
    );
}
