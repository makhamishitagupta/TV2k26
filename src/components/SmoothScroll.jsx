"use client";

import { ReactLenis } from "lenis/react";
import React from "react";
import "lenis/dist/lenis.css";

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Premium organic exponential scroll physics
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
