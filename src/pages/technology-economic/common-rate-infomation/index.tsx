import { useMemo, useState } from 'react';
import { useMount, useRequest } from 'ahooks';
import { Button } from 'antd';
import WrapperComponent from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import { getRateTypeList } from '@/services/technology-economic/common-rate'
import CommonRateTable from './components/common-rate-table';
import { getTypeByText } from '../utils';
import styles from './index.less';

interface ListData {
  value: string;
  text: string;
}

const CommonRateInfomation: React.FC = () => {
  const [activeValue, setActiveValue] = useState<ListData>({value: "", text: ""});
  console.log("当前状态", activeValue, typeof activeValue);
  
  const { data: listData = [], run: listDataRun } = useRequest<ListData[]>(getRateTypeList,
    {
      manual: true,
      onSuccess: (res) => {
        setActiveValue(res[0])
      }
    }
  )

  useMount(() => {
    listDataRun()
  })

  const listDataElement = listData.map((item, index) => {
    return (
    <div
      className={`${styles.listElementItem} ${item.value === activeValue.value ? styles.listActive : ""}`}
      key={item.value}
      onClick={()=> setActiveValue(item)}
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
              <CommonRateTable id={activeValue.value} type={getTypeByText(activeValue.text)} />
              <table className={styles.table} style={{width: "100%", border: "1px solid red"}}>
                <tr >
                  <td rowSpan={2}>地区</td>

                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
                <tr >
           
                  <td>f</td>
                  <td>1</td>
                  <td>2</td>
                  <td>3</td>
                  <td>4</td>
                  <td>5</td>
                </tr>
              </table>
              </div>
            </div>
          </div>
        </div>
      </WrapperComponent>
  )
}

export default CommonRateInfomation;