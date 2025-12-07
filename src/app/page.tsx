"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>HR Workflow Designer</h1>
        <p className={styles.subtitle}>
          Create and manage HR workflows visually with drag-and-drop simplicity
        </p>

        <div className={styles.buttonGroup}>
          <Link href="/workspace" className={styles.primaryButton}>
            + New Workflow
          </Link>
          <Link href="/workflows" className={styles.secondaryButton}>
            View Workflows
          </Link>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <Image src="/icons/target.svg" alt="Target" width={20} height={20} className={styles.icon} />
            <span>Drag & Drop Canvas</span>
          </div>
          <div className={styles.feature}>
            <Image src="/icons/automated.svg" alt="Config" width={20} height={20} className={styles.icon} />
            <span>Configurable Nodes</span>
          </div>
          <div className={styles.feature}>
            <Image src="/icons/flask.svg" alt="Test" width={20} height={20} className={styles.icon} />
            <span>Test & Simulate</span>
          </div>
        </div>
      </div>
    </div>
  );
}
