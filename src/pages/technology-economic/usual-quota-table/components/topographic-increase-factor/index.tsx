import React, {useEffect, useState} from "react";
import styles from './index.less'
import {getCommonlyTableLandRatio} from "@/services/technology-economic/usual-quota-table";
import {Table} from "antd";
import TableImportButton from "@/components/table-import-button";


interface Props {
  id: string
}
interface TopographicIncreaseFactorRow {
    "commonlyTableId": string
    "lineMajorType": number
    "lineMajorTypeText": string
    "flatLand": number,
    "hills": number,
    "mountainousRegion": number,
    "highMountain": number,
    "mire": number,
    "cityRegion": number,
    "desert": number
}

const TopographicIncreaseFactor: React.FC<Props> = (props) => {
  const {id} = props
  const [dataSource,setDataSource] = useState<TopographicIncreaseFactorRow[]>([])
  const getTableData = async () => {
    if (!id) return
    const res = await getCommonlyTableLandRatio(id)
    setDataSource(res)
  }

  const columns = [{
    title: '地形增加系数',
    children: [
      {
        title: '序号',
        width: 80,
        render: (text: string, record: any, index: number) => {
          return <span>{index + 1}</span>
        },
      },
      {
        title: '专业名称',
        dataIndex: 'lineMajorTypeText',
        key: 'lineMajorTypeText',
      },
      {
        title: '平地',
        dataIndex: 'flatLand',
        key: 'flatLand',
      },
      {
        title: '丘陵',
        dataIndex: 'hills',
        key: 'hills',
      },
      {
        title: '山地',
        dataIndex: 'mountainousRegion',
        key: 'mountainousRegion',
      },
      {
        title: '高山',
        dataIndex: 'highMountain',
        key: 'highMountain',
      },
      {
        title: '泥沼',
        dataIndex: 'mire',
        key: 'mire',
      },
      {
        title: '城区',
        dataIndex: 'cityRegion',
        key: 'cityRegion',
      },
      {
        title: '沙漠',
        dataIndex: 'desert',
        key: 'desert',
      },
    ]
  }
  ];
  useEffect(() => {
    getTableData()
  }, [id])
  return (
    <div className={styles.topographicIncreaseFactor}>
      <div className={styles.topButton}>
        <TableImportButton buttonTitle={'导入费率'}
                           requestSource={'tecEco1'}
                           extraParams={{'EngineeringTemplateId':'1408002043054866432'}}
                           importUrl={'/EngineeringTotal/ImportEngineeringInfoCostTotal'}/>
      </div>
      <Table
        pagination={false}
        bordered
        size={'small'}
        dataSource={dataSource}
        columns={columns}/>
        <br/>
        <div>
          <p>注: 1各种地形的定义</p>
          <p>  (1) 平地: 指地形比较平坦广阔,地面比较干燥的地带。</p>
          <p>  (2) 丘陵: 指陆地上起伏缓和、连绵不断的矮岗、土丘、水平距离1km以内,起伏在50m以下的地带。</p>
          <p>  (3) 一般山地: 指一般山岭或者沟谷等,水平距离250m以内,地形起伏在50m~150米的地带。</p>
          <p>  (4) 泥沼地带: 指经常积水的田地或泥水淤积的地带。</p>
          <p>  (5) 沙漠: 指沙漠边缘地带。</p>
          <p>  (5) 高山: 指人力、畜力攀登困难,水平距离250以内,地形起伏在150m~250m的地带。</p>
          <p>    2套用说明</p>
          <p>  (1) 编制预算是,工程地形按全线的不同地形划分为若干区段,分别以其工程量所占长度的百分比进行计算。</p>
          <p>  (2) 在确定运输地形是,应按运输路径的实际地形来划分。</p>
          <p>  (3) 西北高原台地沿线路平台长度2km以内的工程地形按'山地'论,工地运输地形则按运输路径的实际情况而定,上台运输按'山地'论,台上运输按'平地'论。</p>
          <p>  (4) 城市市区参考丘陵地形计算。</p>
        </div>
    </div>
  );
}

export default TopographicIncreaseFactor;
