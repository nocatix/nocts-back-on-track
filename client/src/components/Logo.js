import React from 'react';

export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginRight: '10px' }}
    >
      {/* Track/Path background */}
      <path
        d="M 15 85 Q 50 20 85 85"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Forward arrow */}
      <g>
        {/* Arrow shaft */}
        <line x1="20" y1="70" x2="50" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Arrow head - upper line */}
        <line x1="50" y1="40" x2="38" y2="52" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        {/* Arrow head - lower line */}
        <line x1="50" y1="40" x2="40" y2="32" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      </g>

      {/* Progress circles at bottom */}
      <circle cx="30" cy="85" r="5" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="85" r="5" fill="currentColor" opacity="0.7" />
      <circle cx="70" cy="85" r="5" fill="currentColor" />

      {/* Top accent - success indicator */}
      <path
        d="M 75 25 L 85 35 L 95 15"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
