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
        <div className={styles.accreditTitle}>
          <div className={styles.accreditIcon}>
            <img src={imgSrc} />
          </div>
          <div className={styles.accreditWord}>{label}</div>
        </div>
      </div>
      <div className={styles.accreditTitle}>
        <div className={styles.statisticTotalNumber}>
          {accreditData?.totalQty < 10 && accreditData?.totalQty > 0
            ? `0${accreditData?.totalQty}`
            : accreditData?.totalQty}
        </div>
        <div className={styles.accreditWord}>总量</div>
      </div>

      <div className={styles.accreditTitle}>
        <div className={styles.statisticAvailableNumber}>
          {accreditData?.availableQty < 10 && accreditData?.availableQty > 0
            ? `0${accreditData?.availableQty}`
            : accreditData?.availableQty}
        </div>
        <div className={styles.accreditWord}>可用</div>
      </div>
    </div>
  );
};

export default AccreditStatistics;
