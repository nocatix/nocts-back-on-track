import React from 'react';

export default function Logo({ size = 40 }) {
  return (
    <img
      src="/logo.png"
      alt="noct's Back on Track Logo"
      width={size}
      height={size}
      style={{ marginRight: '10px' }}
    />
  );
}
