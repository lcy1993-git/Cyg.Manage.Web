import React from 'react';
import styles from './index.less';
import TotalImageSrc from '@/assets/image/project-management/total.png';

interface AllStatisticsProps {}

const AllStatistics: React.FC<AllStatisticsProps> = (props) => {
  return (
    <div className={styles.allStatistics}>
      <div className={styles.allStatisticsIcon}>
        <img src={TotalImageSrc} />
      </div>
      <div className={styles.allStatisticsContent}>
        <div className={styles.allStatisticsTitle}>全部项目</div>
        <div className={styles.allStatisticsNumber}>{props.children}</div>
      </div>
    </div>
  );
};

export default AllStatistics;
