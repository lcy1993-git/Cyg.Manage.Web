 import { Tabs } from 'antd';

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
  return (
    <div className={styles.costTemplate}>
      <div className={styles.leftMenu}>
        <h3 className={styles.content}>目录</h3>
        <div className={styles.topButton}>
          <TableImportButton
            buttonTitle={'导入费率'}
            requestSource={'tecEco1'}
            importUrl={'/CommonlyTable/ImportCommonlyTable'}
            setSuccessful={setSuccessful}
          />
        </div>
        <Tabs tabPosition={'left'} centered>
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
