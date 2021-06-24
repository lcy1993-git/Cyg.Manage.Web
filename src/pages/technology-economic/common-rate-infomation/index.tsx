import { useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button, Modal } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import ConstomTable from './components/constom-table';
import qs from 'qs';
import styles from './index.less';

const CommonRateInfomation: React.FC = () => {

  const [id] = useState<string>(qs.parse(window.location.href.split("?")[1]).id as string || "")
  const [activeState, setActiveSate] = useState<string>("");
  const listData = [
    {text: "1111111111"},
    {text: "222222222222"},
    {text: "3333333333"},
    {text: "44444444444"},
    {text: "555555555555"},
  ]

  const onListItemClick = (index: any) => {
    setActiveSate(index)
  }

  const listDataElement = listData.map((item, index) => {
    return (
    <div
      className={`${styles.listElementItem} ${index + "" === activeState ? styles.listActive : ""}`}
      key={item.text}
      onClick={()=> onListItemClick(index)}
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
              <ConstomTable headTitle="test" type={activeState} />
              </div>
            </div>
          </div>
        </div>
      </WrapperComponent>
  )
}

export default CommonRateInfomation;