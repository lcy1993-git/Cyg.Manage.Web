import React from 'react';
import styles from './index.less';
import TotalImageSrc from '@/assets/image/project-management/total.png';

interface SingleStatisticsProps {
  label: string;
  icon: string;
  // tipSlot?: () => React.ReactNode;
}

const SingleStatistics: React.FC<SingleStatisticsProps> = (props) => {
  const { label = '', icon = 'awaitProcess' } = props;

  const imgSrc = require('../../../../../assets/image/project-management/' + icon + '.png');

  return (
    <div className={styles.allStatistics}>
      <div className={styles.allStatisticsIcon}>
        <img src={TotalImageSrc} />
      </div>
      <div className={styles.allStatisticsContent}>
        <div className={styles.allStatisticsTitle}>{label}</div>
        <div className={styles.allStatisticsNumber}>
          {props.children} <span className={styles.singleTabUnit}> 个</span>
        </div>
      </div>
    </div>
  );
};

export default SingleStatistics;
