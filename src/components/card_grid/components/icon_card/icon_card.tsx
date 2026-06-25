import { Icon } from "@/components/icon/icon";
import type { MATERIAL_SYMBOLS } from "@/constants";
import { buildClassNameForFontStyle } from "@/lib/utils";
import type { FontStyle } from "@/types/shared";
import { TiltCard } from "../tilt_card/tilt_card";
import styles from "./icon_card.module.css";

interface IconCardProps {
  maxWidth: "third" | "half" | "twoThirds" | "full";
  iconName?: (typeof MATERIAL_SYMBOLS)[number];
  iconLabel?: string;
  title: string;
  titleFontStyle?: FontStyle;
  description?: string;
}

export function IconCard({
  maxWidth,
  iconName,
  iconLabel,
  title,
  titleFontStyle,
  description,
}: IconCardProps) {
  const titleFontStyleClass = buildClassNameForFontStyle(titleFontStyle, {
    whimsical: styles.whimsical,
    cursive: styles.cursive,
  });

  return (
    <TiltCard maxWidth={maxWidth}>
      <div className={styles.iconCard}>
        <div className={styles.icon} aria-hidden="true">
          {iconLabel ?? (iconName && <Icon name={iconName} size="large" />)}
        </div>
        <div className={styles.info}>
          <h2 className={`${styles.title} ${titleFontStyleClass}`}>{title}</h2>
          <p className={styles.description}>{description}</p>
        </div>
      </div>
    </TiltCard>
  );
}
