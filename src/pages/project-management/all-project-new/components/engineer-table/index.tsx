import { Pagination } from 'antd';
import React from 'react';
import { useState } from 'react';
import styles from './index.less';

const EngineerTable: React.FC = () => {
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const pageSizeChange = () => {

  }

  const currentPageChange = () => {
      
  }

  const tableResultData = {
    items: [],
    pageIndex: 1,
    pageSize: 20,
    total: 0,
    dataStartIndex: 0,
    dataEndIndex: 0,
    projectLen: 0,
  };

  return (
    <div className={styles.engineerTable}>
      <div className={styles.engineerTableContent}></div>
      <div className={styles.engineerTablePaging}>
        <div className={styles.engineerTablePagingLeft}>
          <span>显示第</span>
          <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
          <span>到第</span>
          <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
          <span>条记录，总共</span>
          <span className={styles.importantTip}>{tableResultData.items.length}</span>
          <span>个工程，</span>
          <span className={styles.importantTip}>{tableResultData.projectLen}</span>个项目
        </div>
        <div className={styles.engineerTablePagingRight}>
          <Pagination
            pageSize={pageSize}
            onChange={currentPageChange}
            size="small"
            total={tableResultData.total}
            current={pageIndex}
            // hideOnSinglePage={true}
            showSizeChanger
            showQuickJumper
            onShowSizeChange={pageSizeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EngineerTable;
