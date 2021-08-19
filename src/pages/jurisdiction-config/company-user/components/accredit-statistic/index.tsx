import React from 'react';
import styles from './index.less';

interface AccreditStatisticsProps {
  label: string;
  icon: string;
  accreditData?: any;
}

const AccreditStatistics: React.FC<AccreditStatisticsProps> = (props) => {
  const { label = '', icon = 'prospect', accreditData } = props;

  const imgSrc = require('../../../../../assets/image/user-accredit/' + icon + '.png');

  return (
    <div className={styles.accreditStatistics}>
      <div className={styles.accreditLeft}>
        <img src={imgSrc} />
      </div>

      <div className={styles.accreditRight}>
        <div className={styles.accreditTitle}>{label}</div>
        <div className={styles.accreditAccount}>
          <div className={styles.accreditWord}>
            总量
            <span className={styles.totalNumber}>{accreditData?.totalQty}</span>
          </div>
          <div className={styles.accreditWord}>
            可用
            <span className={styles.availableNumber}>{accreditData?.availableQty}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccreditStatistics;
