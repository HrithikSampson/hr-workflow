"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/state/store";
import { hideToast } from "@/state/toast/toastSlice";
import styles from "./Toast.module.css";

const Toast = () => {
  const dispatch = useDispatch();
  const toasts = useSelector((state: RootState) => state.toast.toasts);

  useEffect(() => {
    if (toasts.length > 0) {
      const latestToast = toasts[toasts.length - 1];
      const timer = setTimeout(() => {
        dispatch(hideToast(latestToast.id));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => dispatch(hideToast(toast.id))}
        >
          <div className={styles.toastContent}>
            <span className={styles.toastIcon}>
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "✕"}
              {toast.type === "warning" && "⚠"}
              {toast.type === "info" && "ℹ"}
            </span>
            <span className={styles.toastMessage}>{toast.message}</span>
          </div>
          <button
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(hideToast(toast.id));
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
