import React, {useEffect, useState} from 'react';

import styles from './index.less';
import moment from 'moment/moment';
import {useInterval, useMount} from "ahooks";

interface Props {
  data: object;
}

const StopServer: React.FC<Props> = (props) => {
  const {data} = props;
  const [now, setNow] = useState<string>('');
  const [second, setSecond] = useState<number>(0)
  useInterval(() => {
    if (!data?.createdOn) return
    let num = moment(data?.createdOn).add(second, 'seconds').format('YYYY-MM-DD HH:mm:ss')
    setNow(num);
    setSecond(second => second + 1)
  }, 1000)
  useEffect(()=>{
    setSecond(0)
  },[data])
  return (
    <div className={styles.stopInfoBox}>

      <div className={styles.stopInfoTitle}>关于服务器停机维护的公告</div>
      <div>
        {data?.content}
      </div>
    </div>
  );
};

export default StopServer;
