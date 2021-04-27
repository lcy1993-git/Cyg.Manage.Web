import React, { FC } from 'react';
import PageCommonWrap from '@/components/page-common-wrap';
import styles from './index.less';
import Filterbar from './components/filter-bar';
import SideMenu from './components/side-menu';
interface ReviewProps {}

const ReviewTable: FC<ReviewProps> = (props) => {
  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableFilterbar}></div>
      <main style={styles.main}>hello table</main>
    </div>
  );
};

export default ReviewTable;
