"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./workflows.module.css";

interface Workflow {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
}

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");

  useEffect(() => {
    const savedWorkflows = localStorage.getItem("workflows");
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows));
    }
  }, []);

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) return;

    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodeCount: 0,
    };

    const updatedWorkflows = [...workflows, newWorkflow];
    setWorkflows(updatedWorkflows);
    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
    setNewWorkflowName("");
    setIsCreating(false);
  };

  const deleteWorkflow = (id: string) => {
    const updatedWorkflows = workflows.filter((w) => w.id !== id);
    setWorkflows(updatedWorkflows);
    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          Workflow
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Home
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <div className={styles.titleBar}>
          <h1 className={styles.title}>My Workflows</h1>
          <button
            className={styles.createButton}
            onClick={() => setIsCreating(true)}
          >
            + New Workflow
          </button>
        </div>

        {isCreating && (
          <div className={styles.createForm}>
            <input
              type="text"
              placeholder="Enter workflow name..."
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              className={styles.input}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") createWorkflow();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewWorkflowName("");
                }
              }}
            />
            <div className={styles.formButtons}>
              <button className={styles.saveButton} onClick={createWorkflow}>
                Create
              </button>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setIsCreating(false);
                  setNewWorkflowName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {workflows.length === 0 && !isCreating ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <h2 className={styles.emptyTitle}>No workflows yet</h2>
            <p className={styles.emptyDescription}>
              Create your first workflow to get started building conversational experiences.
            </p>
            <button
              className={styles.emptyButton}
              onClick={() => setIsCreating(true)}
            >
              Create Your First Workflow
            </button>
          </div>
        ) : (
          <div className={styles.workflowGrid}>
            {workflows.map((workflow) => (
              <div key={workflow.id} className={styles.workflowCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.workflowName}>{workflow.name}</h3>
                  <button
                    className={styles.deleteButton}
                    onClick={() => deleteWorkflow(workflow.id)}
                    title="Delete workflow"
                  >
                    ×
                  </button>
                </div>
                <div className={styles.cardMeta}>
                  <span className={styles.metaItem}>
                    {workflow.nodeCount} nodes
                  </span>
                  <span className={styles.metaItem}>
                    Updated {new Date(workflow.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <Link
                  href={`/workspace?id=${workflow.id}`}
                  className={styles.openButton}
                >
                  Open Workflow →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
