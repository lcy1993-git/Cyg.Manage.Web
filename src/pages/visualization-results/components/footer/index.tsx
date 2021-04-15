import React, { FC } from 'react';
import styles from './index.less';

const Footer: FC = () => {
  return (
    <div className={`${styles.footerContainer} flex`}>
      <div className={styles.icon}>1</div>
      <div className={styles.mapInfo}>
        <span>定位 | </span>
        <span>街道图 | </span>
        <span>卫星图 精度:104 0854 维度 30 5884 | </span>
        <span>比例尺</span>
      </div>
    </div>
  );
};

export default Footer;
