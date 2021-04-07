import React from "react";
import styles from "./index.less";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";

const GanttViewVHead = () => {
  return (
    <div className={styles.container}>
      <div className={styles.handleStretch}>收起</div>
      <div className={styles.nav}>
        <div className={styles.buttonsArea}>
          操作buttons区域
        </div>
        <div className={styles.processInfo}>
          <InfoCircleOutlined />进度说明
        </div>
      </div>
    </div>
  )
}

export default GanttViewVHead;