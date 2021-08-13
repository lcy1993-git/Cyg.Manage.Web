import {Tabs} from 'antd';

import React, {useEffect, useState} from "react";
import styles from './index.less'
import { useLocation } from 'umi';
import TopographicIncreaseFactor from '../topographic-increase-factor';
import AttritionRate from '../atrition-rate';
import { getCommonlyTableTypeList } from '@/services/technology-economic/usual-quota-table';

const {TabPane} = Tabs;

interface Props {
}

const UsualQuotaTableDetail: React.FC<Props> = () => {
  const [id ,setId] = useState<string>('')
  const [tabs,setTable] = useState<any[]>([])
  const {state} = useLocation();
  useEffect(()=>{
    // @ts-ignore
    setId(state?.id)
    // @ts-ignore
  },[state?.id])
  const getTabList = async ()=>{
    const res = await   getCommonlyTableTypeList()
    setTable(res)
  }
  useEffect(()=>{
    getTabList()
      },[])
  return (
    <div className={styles.costTemplate}>
      <div className={styles.leftMenu}>
        <h3 className={styles.content}>
          目录
        </h3>
        <Tabs tabPosition={'left'} centered >
          {
            tabs.some(item=>item.text === '地形增加系数') &&  <TabPane tab={'地形增加系数'} key={1}>
              <TopographicIncreaseFactor id={id}/>
            </TabPane>
          }
          {
            tabs.some(item=>item.text === '未计价材料施工损耗率') &&  <TabPane tab={'未计价材料施工损耗率'} key={2}>
              <AttritionRate id={id}/>
            </TabPane>
          }
          {/*<TabPane tab={'未计价材料施工损耗率'} key={2}>*/}
          {/*  <AttritionRate id={id}/>*/}
          {/*</TabPane>*/}
        </Tabs>
      </div>
    </div>
  );
}

export default UsualQuotaTableDetail;
