"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import styles from "../styles/HomePage.module.css";

export default function HomePage() {
  const { currentMode, isDraftMode } = useSelector((state) => state.mode);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h2 className={styles.heroTitle}>Welcome to CSR Next.js App</h2>
        <p className={styles.heroSubtitle}>
          A client-side rendered application with App Router, Redux, and dynamic
          API switching
        </p>

        <div className={styles.modeIndicator}>
          <strong>Current Mode:</strong> {currentMode || "Default"}
          {isDraftMode && <span className={styles.draftBadge}>Draft Mode</span>}
        </div>
      </div>

      <div className={styles.navigation}>
        <h3 className={styles.sectionTitle}>Explore the App</h3>

        <div className={styles.cardGrid}>
          {(currentMode === "current" || !currentMode) && (
            <div className={styles.card}>
              <h4>REST API Routes</h4>
              <p>Explore nested routing with JSONPlaceholder API</p>
              <div className={styles.buttonGroup}>
                <Link href="/rest" className="btn btn-primary">
                  View REST Routes
                </Link>
              </div>
            </div>
          )}

          {(currentMode === "preview" || currentMode === "draft") && (
            <div className={styles.card}>
              <h4>GraphQL API Routes</h4>
              <p>Explore countries data with GraphQL API</p>
              <div className={styles.buttonGroup}>
                <Link href="/graphql" className="btn btn-primary">
                  View GraphQL Routes
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <h4>Mode-Based API Switching</h4>
          <ul className={styles.featureList}>
            <li>
              <strong>Current Mode (or No Mode):</strong> Shows REST API only
              (JSONPlaceholder)
            </li>
            <li>
              <strong>Preview Mode:</strong> Shows GraphQL API only (Countries)
            </li>
            <li>
              <strong>Draft Mode:</strong> Shows GraphQL API only (Countries)
              with disabled UI interactions
            </li>
            <li>
              <strong>Current Mode:</strong> {currentMode || "Default/Current"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
