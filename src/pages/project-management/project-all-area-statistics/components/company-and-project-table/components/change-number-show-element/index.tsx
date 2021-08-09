import { SwapLeftOutlined, SwapRightOutlined } from '@ant-design/icons';
import React from 'react';

import styles from './index.less';

interface ChangeNumberShowElementProps {
  num: number;
}

const ChangeNumberShowElement: React.FC<ChangeNumberShowElementProps> = (props) => {
  const { num } = props;
  return (
    <div className={styles.changeNumberShowElement}>
      {/* {num === 0 && <span className={styles.noChangeNumber}>{num}</span>} */}
      {num > 0 && (
        <div className={styles.hasAddNumber}>
          <div>
            {num}
          </div>
          <div className={styles.hasAddIcon}>
            <SwapLeftOutlined />
          </div>
        </div>
      )}
      {num < 0 && (
        <span className={styles.hasReduceNumber}>
          {num}
          <span className={styles.hasReduceIcon}>
            <SwapRightOutlined />
          </span>
        </span>
      )}
    </div>
  );
};

export default ChangeNumberShowElement;
