"use client";

import { useSelector } from "react-redux";
import Breadcrumb from "./Breadcrumb";
import styles from "../styles/ClientLayout.module.css";

export default function ClientLayout({ children }) {
  const { isDraftMode } = useSelector((state) => state.mode);

  return (
    <main className={`${styles.main} ${isDraftMode ? "draft-mode" : ""}`}>
      <div className={styles.header}>
        <h1 className={styles.title}>CSR Next.js App</h1>
        <Breadcrumb />
      </div>
      <div className={styles.content}>{children}</div>
    </main>
  );
}
