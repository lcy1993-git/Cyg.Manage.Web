import { useMemo, memo, useRef, useEffect } from 'react';
import { Table, Select } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { chooseCurDayTrack } from '../../utils/mapClick'

import styles from './index.less'
// import { useLayoutEffect } from 'ahooks';
import { useLayoutEffect } from 'react';

const SurveyModal = (props) => {

  const { hidden, resData } = props

  const [pX, pY] = resData?.evt?.map((i: number) => parseInt(i)) || [0, 0];

  const ref = useRef<HTMLDivElement>(null)

  const data = useMemo(() => {
    const title = resData?.resData?.find((o: any) => o.propertyName === 'title')?.data;
    const selectAll = {
      label: "全部",
      value: ""
    }
    const select = resData?.select?.map((t: string) => {
      return {
        label: t,
        value: t
      }
    })
    return [resData?.resData?.filter((o: any) => o.propertyName !== 'title' && o.propertyName !== '所有勘察日期'), title ? title : '', select ? [selectAll, ...select] : [selectAll]];
  }, [JSON.stringify(resData)]);



  const columns = [
    {
      title: "属性名",
      dataIndex: 'propertyName',
      ellipsis: true,
      width: 70
    },
    {
      title: "属性值",
      dataIndex: 'data',
      ellipsis: true,
    }
  ]

  useLayoutEffect(() => {
    
    let x = pX + 10,
      y = pY - 135;
    if (pX > 1000) {
      x = pX - 230
    }
    if (pY > 560) {
      y = pY - 270
    } else if (pY < 144) {
      y = pY
    }
    ref.current!.style.position = "absolute"
    ref.current!.style.top = y + "px";
    ref.current!.style.left = x + "px";

  }, [JSON.stringify(resData)])

  return (
    <div
      title={'项目名称：' + data[1] || ""}
      className={styles.wrap}
      ref={ref}
    // style={{ position: 'absolute', width: 200, top: 100, left: 240,backgroundColor: "#fff" }}
    >
      <div className={styles.title1}>
        {/* <span className={styles.head}>项目名称：</span> */}
        <span className={styles.body}>{data[1]}</span>
      </div>
      <div className={styles.surveyWrap}>
        <div className={styles.title}>勘察日期: </div>
        <div className={styles.select}>
          <Select
            size="small"
            defaultValue=""
            className={styles.select}
            style={{ width: "100%" }}
            options={data[2]}
            onSelect={(e: string) => chooseCurDayTrack(e)}
            placeholder='选择勘察日期' />
        </div>

      </div>
      <div className={styles.drawerClose}>
        <CloseOutlined onClick={hidden} />
      </div>
      <Table
        key={JSON.stringify(resData)}
        bordered
        style={{ height: 30 }}
        pagination={false}
        columns={columns}
        dataSource={data[0] ?? []}
        rowClassName={styles.row}
      // scroll={{ y: height - 160 }}
      // rowKey={(r) => r.propertyName}
      />
    </div>
  )
}

export default memo(SurveyModal);




