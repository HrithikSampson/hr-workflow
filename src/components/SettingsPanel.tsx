import Image from "next/image";
import styles from "./SettingsPanel.module.css";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNode,
  updateCurrentWorkspace,
} from "@/state/workspace/workspaceSlice";
import { RootState } from "@/state/store";

const SettingsPanel = () => {
  const dispatch = useDispatch();
  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      dispatch(updateCurrentWorkspace({ content: event.target.value }));
    },
    [],
  );
  const value = useSelector(
    (state: RootState) =>
      state.workflow.currentWorkspace.nodes.find(
        (nds) => nds.id === state.workflow.selectedNodeId,
      )?.data.text,
  );
  const onClick = useCallback(() => {
    dispatch(selectNode(null));
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Image
          src="/back.png"
          alt="back"
          width={20}
          height={20}
          onClick={onClick}
        />
        <div className={styles.headerText}>Message</div>
      </div>
      <div className={styles.contentDiv}>
        <div className={styles.content}>Text</div>
        <textarea
          rows={15}
          cols={30}
          className={styles.textArea}
          value={value}
          onChange={onChange}
        ></textarea>
      </div>
    </div>
  );
};

export default SettingsPanel;
