"use client";

import { APP_ID } from "@/constants";
import AppleLogo from "@/public/app_view/apple_logo.svg";
import type { CSSProperties, PointerEvent } from "react";
import styles from "./download_action_button.module.css";

interface DownloadActionButtonProps {
  href?: string;
  label?: string;
  size?: "small" | "medium" | "large";
}

type DownloadActionButtonStyle = CSSProperties & {
  "--button-rotate-x"?: string;
  "--button-rotate-y"?: string;
  "--button-glow-x"?: string;
  "--button-glow-y"?: string;
};

const MAX_ROTATION = 8;

export function DownloadActionButton({
  href = `https://apps.apple.com/app/id${APP_ID}`,
  label = "Download",
  size = "small",
}: DownloadActionButtonProps) {
  let appleLogoSize;

  switch (size) {
    case "small":
      appleLogoSize = 18;
      break;
    case "medium":
      appleLogoSize = 20;
      break;
    case "large":
      appleLogoSize = 24;
      break;
    default:
      appleLogoSize = 18;
  }

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width;
    const pointerY = (event.clientY - rect.top) / rect.height;
    const rotateY = (pointerX - 0.5) * MAX_ROTATION * 2;
    const rotateX = (0.5 - pointerY) * MAX_ROTATION * 2;

    event.currentTarget.style.setProperty("--button-rotate-x", `${rotateX}deg`);
    event.currentTarget.style.setProperty("--button-rotate-y", `${rotateY}deg`);
    event.currentTarget.style.setProperty("--button-glow-x", `${pointerX * 100}%`);
    event.currentTarget.style.setProperty("--button-glow-y", `${pointerY * 100}%`);
  };

  const onPointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--button-rotate-x", "0deg");
    event.currentTarget.style.setProperty("--button-rotate-y", "0deg");
    event.currentTarget.style.setProperty("--button-glow-x", "50%");
    event.currentTarget.style.setProperty("--button-glow-y", "50%");
  };

  return (
    <a
      href={href}
      className={`${styles.downloadActionButton} ${styles[size]}`}
      style={
        {
          "--button-rotate-x": "0deg",
          "--button-rotate-y": "0deg",
          "--button-glow-x": "50%",
          "--button-glow-y": "50%",
        } as DownloadActionButtonStyle
      }
      target="_blank"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={styles.label}>
        <div className={styles.appleLogo}>
          <AppleLogo width={appleLogoSize} height={appleLogoSize} />
        </div>
        <div className={styles.downloadLabel}>{label}</div>
      </div>
    </a>
  );
}
