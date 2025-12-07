"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./workflows.module.css";
import { mockAPI, Workflow } from "@/lib/mockApi";

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const router = useRouter();

  const loadWorkflows = async () => {
    const allWorkflows = await mockAPI.workflows.getAll();
    setWorkflows(allWorkflows);
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const createWorkflow = async () => {
    if (!newWorkflowName.trim()) return;

    const newWorkflow = await mockAPI.workflows.create(newWorkflowName);
    setNewWorkflowName("");
    setIsCreating(false);
    router.push(`/workspace?id=${newWorkflow.id}`);
  };

  const deleteWorkflow = async (id: string) => {
    await mockAPI.workflows.delete(id);
    loadWorkflows();
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
                    {workflow.nodes.length} nodes
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
