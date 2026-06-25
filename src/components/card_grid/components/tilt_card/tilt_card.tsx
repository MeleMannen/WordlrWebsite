"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import sharedGridStyles from "../../shared.module.css";

interface TiltCardProps {
  maxWidth: "third" | "half" | "twoThirds" | "full";
  children: ReactNode;
  className?: string;
}

type TiltCardStyle = CSSProperties & {
  "--tilt-rotate-x"?: string;
  "--tilt-rotate-y"?: string;
  "--tilt-glow-x"?: string;
  "--tilt-glow-y"?: string;
};

const MAX_ROTATION = 7;

export function TiltCard({ maxWidth, children, className }: TiltCardProps) {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width;
    const pointerY = (event.clientY - rect.top) / rect.height;
    const rotateY = (pointerX - 0.5) * MAX_ROTATION * 2;
    const rotateX = (0.5 - pointerY) * MAX_ROTATION * 2;

    event.currentTarget.style.setProperty("--tilt-rotate-x", `${rotateX}deg`);
    event.currentTarget.style.setProperty("--tilt-rotate-y", `${rotateY}deg`);
    event.currentTarget.style.setProperty("--tilt-glow-x", `${pointerX * 100}%`);
    event.currentTarget.style.setProperty("--tilt-glow-y", `${pointerY * 100}%`);
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--tilt-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-rotate-y", "0deg");
    event.currentTarget.style.setProperty("--tilt-glow-x", "50%");
    event.currentTarget.style.setProperty("--tilt-glow-y", "50%");
  };

  return (
    <figure
      className={`${sharedGridStyles.gridCardItem} ${sharedGridStyles[maxWidth]} ${className ?? ""}`}
      style={
        {
          "--tilt-rotate-x": "0deg",
          "--tilt-rotate-y": "0deg",
          "--tilt-glow-x": "50%",
          "--tilt-glow-y": "50%",
        } as TiltCardStyle
      }
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </figure>
  );
}
