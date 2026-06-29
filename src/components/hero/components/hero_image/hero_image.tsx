"use client";

import { useBezelImageRenderer } from "@/hooks/useBezelImageRenderer";
import { DEVICE_BEZEL_CONFIGURATION_MAP } from "@/lib/device_bezel_configuration_map";
import type { Bezel, ImageSrcsetEntry } from "@/types/shared";
import Image from "next/image";
import type { CSSProperties, PointerEvent } from "react";
import { useRef } from "react";
import styles from "./hero_image.module.css";

interface HeroImageProps {
  src: string;
  srcset?: ImageSrcsetEntry[];
  alt: string;
  bezel: Bezel;
}

type HeroImageStyle = CSSProperties & {
  "--hero-rotate-x"?: string;
  "--hero-rotate-y"?: string;
  "--hero-glow-x"?: string;
  "--hero-glow-y"?: string;
};

const MAX_ROTATION = 8;

export function HeroImage({ src, srcset, alt, bezel }: HeroImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useBezelImageRenderer({
    canvasRef,
    src,
    srcset,
    bezel: bezel,
  });

  const bezelConfig = DEVICE_BEZEL_CONFIGURATION_MAP[bezel];

  const updateTilt = (
    element: HTMLDivElement,
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

    element.style.setProperty("--hero-rotate-x", `${rotateX}deg`);
    element.style.setProperty("--hero-rotate-y", `${rotateY}deg`);
    element.style.setProperty("--hero-glow-x", `${pointerX * 100}%`);
    element.style.setProperty("--hero-glow-y", `${pointerY * 100}%`);
  };

  const resetTilt = (element: HTMLDivElement) => {
    element.style.setProperty("--hero-rotate-x", "0deg");
    element.style.setProperty("--hero-rotate-y", "0deg");
    element.style.setProperty("--hero-glow-x", "50%");
    element.style.setProperty("--hero-glow-y", "50%");
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateTilt(event.currentTarget, event.clientX, event.clientY);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    updateTilt(event.currentTarget, event.clientX, event.clientY);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetTilt(event.currentTarget);
  };

  const onPointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    resetTilt(event.currentTarget);
  };

  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    resetTilt(event.currentTarget);
  };

  return (
    <div
      className={styles.heroImage}
      style={
        {
          "--hero-rotate-x": "0deg",
          "--hero-rotate-y": "0deg",
          "--hero-glow-x": "50%",
          "--hero-glow-y": "50%",
        } as HeroImageStyle
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
    >
      <div
        className={styles.shadow}
        style={
          {
            ["--bottom-offset"]: `${bezelConfig.shadowBottomOffset}px`,
          } as React.CSSProperties
        }
      >
        <Image
          src="/app_view/iphone_shadow.png"
          alt=""
          width={592}
          height={68}
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <canvas ref={canvasRef} className={styles.imageCanvas} aria-label={alt} />
    </div>
  );
}
