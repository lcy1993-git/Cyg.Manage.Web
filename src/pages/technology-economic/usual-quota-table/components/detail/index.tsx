 import {Space, Tabs } from 'antd';

import React, { useEffect, useState } from 'react';
import styles from './index.less';
import TopographicIncreaseFactor from '../topographic-increase-factor';
import AttritionRate from '../atrition-rate';
import { getCommonlyTableTypeList } from '@/services/technology-economic/usual-quota-table';
import TableImportButton from '@/components/table-import-button';
 import EarthworkParameters from '../earthwork-parameters';

const { TabPane } = Tabs;

interface Props {}

const UsualQuotaTableDetail: React.FC<Props> = () => {
  const [tabs, setTable] = useState<any[]>([]);
  const [active,setActive] = useState<number>(1)
  const getTabList = async () => {
    const res = await getCommonlyTableTypeList();
    setTable(res);
  };
  useEffect(() => {
    getTabList();
  }, []);
  const setSuccessful = (e: boolean) => {
    e && getTabList();
  };
  const tabOnChange = (key:string)=>{
    console.log(key)
    setActive(Number(key)+1)
  }
  return (
    <div className={styles.costTemplate}>
      <div className={styles.leftMenu}>
        <h3 className={styles.content}>目录</h3>
        <div className={styles.topButton}>
         <Space>
           <TableImportButton
             extraParams={{commonlyTableType:active}}
             modalTitle={'导入费率'}
             buttonTitle={'导入费率'}
             style={{zIndex:99}}
             template={true}
             downType={active}
             requestSource={'tecEco1'}
             importUrl={'/CommonlyTable/ImportCommonlyTable'}
             setSuccessful={setSuccessful}
           />
           <TableImportButton
             extraParams={{commonlyTableType:active}}
             modalTitle={'导入土方参数图形'}
             buttonTitle={'导入土方参数图形'}
             style={{zIndex:99,display:active === 3 ? 'block' : 'none'}}
             // template={true}
             downType={active}
             requestSource={'tecEco1'}
             importUrl={`/Earthwork/UploadEarthworkPictures`}
             setSuccessful={setSuccessful}
           />
         </Space>
        </div>
        <Tabs tabPosition={'left'} centered onChange={tabOnChange}>
          {tabs.map((item: any, index: number) => {
            if (item.text === '地形增加系数') {
              return (
                <TabPane tab={'地形增加系数'} key={index}>
                  <TopographicIncreaseFactor id={item.value} />
                </TabPane>
              );
            } else if (item.text === '未计价材料施工损耗率') {
              return (
                <TabPane tab={'未计价材料施工损耗率'} key={index}>
                  <AttritionRate id={item.value} />
                </TabPane>
              );
            } else if (item.text === '土方参数') {
              return (
                <TabPane tab={'土方参数'} key={index}>
                  <EarthworkParameters id={item.value} />
                </TabPane>
              );
            } else {
              return (
                <TabPane tab={item.name} key={index}>
                  <div>{item.name}</div>
                </TabPane>
              );
            }
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default UsualQuotaTableDetail;
