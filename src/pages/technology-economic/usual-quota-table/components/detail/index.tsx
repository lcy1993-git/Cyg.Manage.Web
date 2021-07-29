import {Tabs} from 'antd';

import React, {useEffect, useState} from "react";
import styles from './index.less'
import { useLocation } from 'umi';
import TopographicIncreaseFactor from '../topographic-increase-factor';
import AttritionRate from '../atrition-rate';

const {TabPane} = Tabs;

interface Props {
}

const UsualQuotaTableDetail: React.FC<Props> = () => {
  const [id ,setId] = useState<string>('')
  const {state} = useLocation();
  useEffect(()=>{
    // @ts-ignore
    setId(state?.id)
    // @ts-ignore
  },[state?.id])
  return (
    <div className={styles.costTemplate}>
      <div className={styles.leftMenu}>
        <h3 className={styles.content}>
          目录
        </h3>
        <Tabs tabPosition={'left'} centered >
          <TabPane tab={'地形增加系数'} key={1}>
            <TopographicIncreaseFactor id={id}/>
          </TabPane>
          <TabPane tab={'未计价材料施工损耗率'} key={2}>
            <AttritionRate id={id}/>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default UsualQuotaTableDetail;
