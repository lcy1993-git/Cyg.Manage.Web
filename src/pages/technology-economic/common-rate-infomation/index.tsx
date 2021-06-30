import { useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button, Modal } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import { getRateTypeList } from '@/services/technology-economic/common-rate'
import ConstomTable from './components/constom-table';
import qs from 'qs';
import styles from './index.less';

interface ListData {
  value: string;
  text: string;
}

const CommonRateInfomation: React.FC = () => {
  const [activeValue, setActiveValue] = useState<string>("");

  const { data: listData = [], run: listDataRun } = useRequest<ListData[]>(getRateTypeList,
    {
      manual: true,
      onSuccess: (res) => {
        setActiveValue(res[0].value)
      }
    }
  )

  useMount(() => {
    listDataRun()
  })

  const listDataElement = listData.map((item, index) => {
    return (
    <div
      className={`${styles.listElementItem} ${item.value === activeValue ? styles.listActive : ""}`}
      key={item.value}
      onClick={()=> setActiveValue(item.value)}
    >
      {item.text}
    </div> 
    )
  })

  return (
    <WrapperComponent>
      <div className={styles.imfomationModalWrap}>
        <div className={styles.topContainer}>
          <div className={styles.topContainerTitle}>
            <CommonTitle>费率详情</CommonTitle>
          </div>
          <div className={styles.importButton}>
            <Button type="primary">导入费率</Button>
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.containerLeft}>
            <div className={styles.containerLeftTitle}>
              目录
            </div>
            <div className={styles.listElement}>
              {listDataElement}
            </div>

          </div>
          <div className={styles.containerRight}>
            <div className={styles.body}>
              {/* <ConstomTable headTitle="test" type={activeValue} /> */}
              </div>
            </div>
          </div>
        </div>
      </WrapperComponent>
  )
}

export default CommonRateInfomation;