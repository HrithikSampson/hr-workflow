"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/state/store";
import styles from "./SimulationPanel.module.css";

const SimulationPanel = () => {
  const simulationResult = useSelector(
    (state: RootState) => state.simulation.result
  );
  const isRunning = useSelector(
    (state: RootState) => state.simulation.isRunning
  );

  if (!simulationResult && !isRunning) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3>Workflow Simulation</h3>
        {isRunning && <div className={styles.spinner}>Running...</div>}
      </div>

      {simulationResult && (
        <div className={styles.content}>
          <div className={styles.summary}>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Status:</span>
              <span
                className={
                  simulationResult.status === "success"
                    ? styles.successStatus
                    : styles.errorStatus
                }
              >
                {simulationResult.status.toUpperCase()}
              </span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Duration:</span>
              <span>{simulationResult.totalDuration}ms</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.label}>Total Steps:</span>
              <span>{simulationResult.steps.length}</span>
            </div>
          </div>

          {simulationResult.errors.length > 0 && (
            <div className={styles.errors}>
              <h4>Errors:</h4>
              {simulationResult.errors.map((error, idx) => (
                <div key={idx} className={styles.error}>
                  {error}
                </div>
              ))}
            </div>
          )}

          <div className={styles.steps}>
            <h4>Execution Flow:</h4>
            {simulationResult.steps.map((step, idx) => (
              <div key={step.nodeId} className={styles.step}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepNumber}>Step {idx + 1}</span>
                  <span className={styles.stepTitle}>{step.nodeTitle}</span>
                  <span className={styles.stepType}>({step.nodeType})</span>
                </div>
                <div className={styles.stepDetails}>
                  <div className={styles.detailsText}>{step.details}</div>
                  {step.output && Object.keys(step.output).length > 0 && (
                    <details className={styles.outputDetails}>
                      <summary>View Output Data</summary>
                      <pre>{JSON.stringify(step.output, null, 2)}</pre>
                    </details>
                  )}
                </div>
                <div className={styles.stepTimestamp}>
                  {new Date(step.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationPanel;
