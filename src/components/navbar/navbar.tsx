"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "./navbar.module.css";

interface NavbarProps {
  icon: React.ReactNode;
  appName: string;
  links?: { label: string; href: string; external?: boolean }[];
  action: React.ReactNode;
}

export function Navbar({ icon, appName, links, action }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navbarRef = useRef<HTMLElement>(null);
  const menuId = "navbar-menu";

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        navbarRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsMenuOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);

    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 860px)");
    const onMediaQueryChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsMenuOpen(false);
      }
    };

    if (mediaQuery.matches) {
      setIsMenuOpen(false);
    }

    mediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  const renderLink = (link: NonNullable<NavbarProps["links"]>[number]) => {
    const href = link.href.startsWith("#")
      ? `/${link.href}`
      : link.href;

    return link.external ? (
      <a href={href} onClick={() => setIsMenuOpen(false)}>
        {link.label}
      </a>
    ) : (
      <Link href={href} onClick={() => setIsMenuOpen(false)}>
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <div className={styles.spacer}></div>
      <div className={styles.navbarContainer}>
        <nav className={styles.navbar} ref={navbarRef}>
          <div className={styles.content}>
            <Link className={styles.appIdentity} href="/">
              <div className={styles.appIconContainer}>{icon}</div>

              <div className={styles.appName}>{appName}</div>
            </Link>

            <ul className={styles.navLinks}>
              {links?.map((link) => {
                return (
                  <li key={link.href} className={styles.navLinkItem}>
                    {renderLink(link)}
                  </li>
                );
              })}
            </ul>

            <div className={styles.action}>{action}</div>

            {links && links.length > 0 && (
              <button
                type="button"
                className={`${styles.menuButton} ${isMenuOpen ? styles.open : ""}`}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-controls={menuId}
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
              >
                <span className={styles.menuIcon} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            )}
          </div>

          {links && links.length > 0 && (
            <div
              id={menuId}
              className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}
            >
              <ul>
                {links.map((link) => (
                  <li key={link.href}>{renderLink(link)}</li>
                ))}
              </ul>
              <div className={styles.mobileAction}>{action}</div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
