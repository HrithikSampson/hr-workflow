import Workspace from "@/components/Workspace";
import Navbar from "@/components/Navbar";
import NodeTemplatesSidebar from "@/components/NodeTemplatesSidebar";
import styles from "./page.module.css";

export default function WorkspacePage() {
  return (
    <div className={styles.workspacePage}>
      <Navbar />
      <div className={styles.workspaceContainer}>
        <NodeTemplatesSidebar />
        <Workspace />
      </div>
    </div>
  );
}
