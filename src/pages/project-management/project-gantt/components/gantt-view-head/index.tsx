import React, { useState } from "react";
import styles from "./index.less";
import { InfoCircleOutlined } from "@ant-design/icons/lib/icons";
import GeneralTable from '@/components/general-table';

const columns = [
  {
    title: '阶段',
    dataIndex: 'userName',
    index: '0',
    width: 130,
  },
  {
    title: '未勘察',
    dataIndex: 'userName',
    index: '1',
    width: 130,
    render() {
      return (
        <div>123</div>
      )
    }
  },
  {
    title: '勘察中',
    dataIndex: 'userName',
    index: '2',
    width: 130,
  },
  {
    title: '已勘察',
    dataIndex: 'userName',
    index: '3',
    width: 130,
  },
  {
    title: '设计中',
    dataIndex: 'userName',
    index: '4',
    width: 130,
  },
  {
    title: '待内审',
    dataIndex: 'userName',
    index: '5',
    width: 130,
  },
  {
    title: '内审中',
    dataIndex: 'userName',
    index: '6',
    width: 130,
  },
  {
    title: '设计完成',
    dataIndex: 'userName',
    index: '7',
    width: 130,
  },
  {
    title: '结项中',
    dataIndex: 'userName',
    index: '8',
    width: 130,
  },
]

const ProcessInfo = () => {
  return (
    <div className={styles.processInfoTable}>
      <GeneralTable
        noPaging={true}
        columns={columns}
        type='none'
      />
    </div>
  );
}

const GanttViewVHead = () => {
  
  const [processVisible, setProcessVisible] = useState(false);

  return (
    <div className={styles.container}>
      { processVisible &&
        <ProcessInfo />
      }
      <div className={styles.nav}>
        <div className={styles.processInfo} onClick={() => setProcessVisible(!processVisible)}>
          <InfoCircleOutlined style={{color: "#efa391"}}/>
          &nbsp;进度说明
        </div>
        <div className={styles.buttonsArea}>
          操作buttons区域
        </div>

      </div>
    </div>
  )
}

export default GanttViewVHead;