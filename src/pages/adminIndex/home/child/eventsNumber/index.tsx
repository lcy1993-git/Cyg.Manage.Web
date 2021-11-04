import React, {useEffect, useState} from 'react';
import styles from './index.less'
import yewu from '@/assets/index/业务事件@2x.png'
import xitong from '@/assets/index/系统事件@2x.png'
import all from '@/assets/index/所有事件@2x.png'
interface Props {
  system:number
  business:number
}

const EventNumber: React.FC<Props> = (props) => {
  return (
      <div className={styles.eventNumber}>
        <div className={styles.eventNumberItem}>
          <div className={styles.image}>
            <img src={all} alt="所有事件" height={70}/>
          </div>
          <div className={styles.EventNumberInfo}>
            <p className={styles.text}>
              所有事件
            </p>
            <p className={styles.number}>
              {props.system + props.business}
            </p>
          </div>
        </div>
        <div className={styles.linBox}>
          <span className={styles.line}/>
        </div>
        <div className={styles.eventNumberItem}>
          <div className={styles.image}>
            <img src={xitong} alt="系统事件" height={70}/>
          </div>
          <div className={styles.EventNumberInfo}>
            <p className={styles.text}>
              系统事件
            </p>
            <p className={styles.number}>
              {props.system}
            </p>
          </div>
        </div>
        <div className={styles.linBox}>
          <span className={styles.line}/>
        </div>
        <div className={styles.eventNumberItem}>
          <div className={styles.image}>
            <img src={yewu} alt="业务事件" height={70}/>
          </div>
          <div className={styles.EventNumberInfo}>
            <p className={styles.text}>
              业务事件
            </p>
            <p className={styles.number}>
              {props.business}
            </p>
          </div>
        </div>
      </div>
  );
};

export default EventNumber;
