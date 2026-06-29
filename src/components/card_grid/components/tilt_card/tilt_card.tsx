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
  const updateTilt = (
    element: HTMLElement,
    clientX: number,
    clientY: number,
  ) => {
    const rect = element.getBoundingClientRect();
    const clampedX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const clampedY = Math.min(Math.max(clientY - rect.top, 0), rect.height);
    const pointerX = clampedX / rect.width;
    const pointerY = clampedY / rect.height;
    const rotateY = (pointerX - 0.5) * MAX_ROTATION * 2;
    const rotateX = (0.5 - pointerY) * MAX_ROTATION * 2;

    element.style.setProperty("--tilt-rotate-x", `${rotateX}deg`);
    element.style.setProperty("--tilt-rotate-y", `${rotateY}deg`);
    element.style.setProperty("--tilt-glow-x", `${pointerX * 100}%`);
    element.style.setProperty("--tilt-glow-y", `${pointerY * 100}%`);
  };

  const resetTilt = (element: HTMLElement) => {
    element.style.setProperty("--tilt-rotate-x", "0deg");
    element.style.setProperty("--tilt-rotate-y", "0deg");
    element.style.setProperty("--tilt-glow-x", "50%");
    element.style.setProperty("--tilt-glow-y", "50%");
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateTilt(event.currentTarget, event.clientX, event.clientY);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" && !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    updateTilt(event.currentTarget, event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetTilt(event.currentTarget);
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    resetTilt(event.currentTarget);
  };

  const onPointerCancel = (event: PointerEvent<HTMLElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetTilt(event.currentTarget);
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
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
    >
      {children}
    </figure>
  );
}
