"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "../styles/Breadcrumb.module.css";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split pathname into segments and filter out empty ones
  const segments = pathname.split("/").filter((segment) => segment !== "");

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumb}>
      <Link href="/" className={styles.breadcrumbItem}>
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;

        return (
          <span key={href} className={styles.breadcrumbSegment}>
            <span className={styles.separator}>/</span>
            {isLast ? (
              <span className={`${styles.breadcrumbItem} ${styles.current}`}>
                {decodeURIComponent(segment)}
              </span>
            ) : (
              <Link href={href} className={styles.breadcrumbItem}>
                {decodeURIComponent(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
