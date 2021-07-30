import { useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button, Modal, message, Spin } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import { getRateTypeList } from '@/services/technology-economic/common-rate'
import styles from './index.less';

interface ListData {
  value: string;
  text: string;
}

const AreaTypeManage: React.FC = () => {
  const [activeValue, setActiveValue] = useState<ListData>({ value: "", text: "" });
  
  const listData: ListData[] = [
    {
      value: "1",
      text: "I"
    },
    {
      value: "2",
      text: "II"
    },
    {
      value: "3",
      text: "III"
    },
    {
      value: "4",
      text: "IV"
    },
    {
      value: "5",
      text: "V"
    },
  ]

  const listDataElement = listData.map((item, index) => {
    return (
      <div
        className={`${styles.listElementItem} ${item.value === activeValue.value ? styles.listActive : ""}`}
        key={item.value}
        onClick={() => setActiveValue(item)}
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
            <CommonTitle>地区分类管理</CommonTitle>
          </div>

        </div>
        <Spin spinning={false}>
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
              table
            </div>
          </div>
        </div>
        </Spin>
      </div>
    </WrapperComponent>
  )
}

export default AreaTypeManage;