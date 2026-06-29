import XLogo from "@/public/app_view/x_logo.svg";
import styles from "./compact_footer.module.css";

type CompactFooterLink = {
  label: string;
  href: string;
  external?: boolean;
  icon?: "x";
};

interface CompactFooterProps {
  appIcon: React.ReactNode;
  appIconHref?: string;
  links: CompactFooterLink[];
  footnoteLeading?: React.ReactNode;
  footnoteTrailing?: React.ReactNode;
}

export function CompactFooter({
  appIcon,
  appIconHref,
  links,
  footnoteLeading,
  footnoteTrailing,
}: CompactFooterProps) {
  return (
    <footer className={styles.compactFooter}>
      <div className={styles.main}>
        {appIconHref ? (
          <a className={styles.appIcon} href={appIconHref} aria-label="Wordlr home">
            {appIcon}
          </a>
        ) : (
          <div className={styles.appIcon} aria-hidden="true">{appIcon}</div>
        )}
        <div className={styles.links}>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.link}
                  target={link.external ? "_blank" : "_self"}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.icon === "x" ? (
                    <XLogo
                      className={styles.linkIcon}
                      width={18}
                      height={18}
                      aria-label={link.label}
                    />
                  ) : (
                    link.label
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.footnotes}>
        <div className={styles.footnoteLeading}>{footnoteLeading}</div>
        <div className={styles.footnoteTrailing}>{footnoteTrailing}</div>
      </div>
    </footer>
  );
}
