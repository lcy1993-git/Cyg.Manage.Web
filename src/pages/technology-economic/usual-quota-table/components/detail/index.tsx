 import {Space, Tabs } from 'antd';

import React, { useEffect, useState } from 'react';
import styles from './index.less';
import TopographicIncreaseFactor from '../topographic-increase-factor';
import AttritionRate from '../atrition-rate';
import { getCommonlyTableTypeList } from '@/services/technology-economic/usual-quota-table';
import TableImportButton from '@/components/table-import-button';
 import EarthworkParameters from '../earthwork-parameters';
 import PageCommonWrap from "@/components/page-common-wrap";

const { TabPane } = Tabs;

interface Props {}

const UsualQuotaTableDetail: React.FC<Props> = () => {
  const [tabs, setTable] = useState<any[]>([]);
  const [active,setActive] = useState<number>(1)
  const getTabList = async () => {
    const name = decodeURI(window.location.search.split('=')[1]).replace('&id','')
    if (name === '地形增加系数'){
      setActive(2)
    }
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
  const name = decodeURI(window.location.search.split('=')[1]).replace('&id','')
  const detailId = window.location.search.split('=')[2]
  return (
    <PageCommonWrap>
    <div className={styles.costTemplate}>
      <div className={styles.leftMenu}>
        {/*<h3 className={styles.content}>目录</h3>*/}
        <div className={styles.topButton}>
         <Space>
           <TableImportButton
             extraParams={{commonlyTableType:active}}
             modalTitle={'导入费率'}
             buttonTitle={'导入费率'}
             style={{zIndex:99,display:name !== '土方参数' ? 'block' : 'none'}}
             template={true}
             downType={active}
             requestSource={'tecEco1'}
             importUrl={'/CommonlyTable/ImportCommonlyTable'}
             setSuccessful={setSuccessful}
           />
           <TableImportButton
             modalTitle={'导入土方参数图形'}
             buttonTitle={'导入土方参数图形'}
             style={{zIndex:99,display:name === '土方参数' ? 'block' : 'none'}}
             downType={active}
             requestSource={'tecEco1'}
             importUrl={`/Earthwork/UploadEarthworkPictures`}
             setSuccessful={setSuccessful}
           />
         </Space>
        </div>
        <div style={{paddingTop:'15px'}}>
          {name === '地形增加系数' && <TopographicIncreaseFactor id={detailId} />}
          {name === '未计价材料施工损耗率' && <AttritionRate id={detailId} />}
          {name === '土方参数' && <EarthworkParameters id={detailId} />}
        </div>
      </div>
    </div>
      </PageCommonWrap>
  );
};

export default UsualQuotaTableDetail;
