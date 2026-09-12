import { SVGAttributes } from 'react';

export default function FeedChainLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Outer circle background */}
            <defs>
                <linearGradient id="fishGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#0891B2', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#22D3EE', stopOpacity: 0.8 }} />
                    <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Water waves at bottom */}
            <path
                d="M 30 140 Q 50 130, 70 140 T 110 140 T 150 140 T 190 140 L 190 180 Q 190 190, 180 190 L 20 190 Q 10 190, 10 180 L 10 140"
                fill="url(#waveGradient)"
                opacity="0.6"
            />
            <path
                d="M 20 155 Q 45 145, 70 155 T 120 155 T 170 155 T 200 155 L 200 190 Q 200 200, 190 200 L 10 200 Q 0 200, 0 190 L 0 155"
                fill="url(#waveGradient)"
                opacity="0.4"
            />

            {/* Feed pellets - circular shapes */}
            <circle cx="50" cy="80" r="8" fill="url(#fishGradient)" opacity="0.9" />
            <circle cx="65" cy="75" r="6" fill="url(#fishGradient)" opacity="0.7" />
            <circle cx="78" cy="85" r="7" fill="url(#fishGradient)" opacity="0.8" />
            <circle cx="145" cy="75" r="8" fill="url(#fishGradient)" opacity="0.8" />
            <circle cx="160" cy="85" r="6" fill="url(#fishGradient)" opacity="0.7" />

            {/* Fish body */}
            <ellipse cx="100" cy="70" rx="35" ry="25" fill="url(#fishGradient)" />

            {/* Fish head */}
            <circle cx="65" cy="70" r="15" fill="url(#fishGradient)" />

            {/* Fish tail */}
            <path
                d="M 135 70 L 160 50 L 165 70 L 160 90 Z"
                fill="url(#fishGradient)"
                opacity="0.8"
            />

            {/* Fish eye */}
            <circle cx="60" cy="65" r="4" fill="#FFFFFF" />
            <circle cx="61" cy="65" r="2.5" fill="#0891B2" />

            {/* Decorative circles for background */}
            <circle cx="40" cy="30" r="12" fill="#06B6D4" opacity="0.3" />
            <circle cx="160" cy="40" r="10" fill="#22D3EE" opacity="0.3" />
            <circle cx="30" cy="120" r="8" fill="#0891B2" opacity="0.2" />
            <circle cx="170" cy="130" r="9" fill="#06B6D4" opacity="0.2" />
        </svg>
    );
}
