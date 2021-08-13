import React, {useEffect, useState} from "react";
import styles from './index.less'
import {getCommonlyTableLossRatio} from "@/services/technology-economic/usual-quota-table";
import {Table} from "antd";
import TableImportButton from "@/components/table-import-button";
import {generateUUID} from "@/utils/utils";


interface Props {
  id: string
}

interface AttritionRateRow {
  "commonlyTableId": string
  "transferType": string
  "materialType": string
  "lossRateFormula": string
  "packageRate": number
}

const AttritionRate: React.FC<Props> = (props) => {
  const {id} = props
  const [dataSource, setDataSource] = useState<AttritionRateRow[]>([])
  const getTableData = async () => {
    if (!id) return
    let res = await getCommonlyTableLossRatio(id)
    res = res.map(item=>{
      // eslint-disable-next-line no-param-reassign
      item.id = generateUUID()
      return item;
    })
    setDataSource(res)
  }

  const columns = [{
    title: '未计价材料施工损耗率表',
    children: [
      {
        title: '序号',
        width: 80,
        render: (text: string, record: any, index: number) => {
          return <span>{index + 1}</span>
        },
      },
      {
        title: '类别/运输类型',
        dataIndex: 'transferType',
        key: 'transferType',
      },
      {
        title: '材料类型',
        dataIndex: 'materialType',
        key: 'materialType',
      },
      {
        title: '损耗率(%)',
        dataIndex: 'lossRateFormula',
        key: 'lossRateFormula',
      },
      {
        title: '包装系数(%)',
        dataIndex: 'packageRate',
        key: 'packageRate',
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
                           importUrl={'/CommonlyTable/ImportCommonlyTable'}/>
      </div>
      <Table
        pagination={false}
        scroll={{y: 570}}
        bordered
        size={'small'}
        rowKey={'id'}
        dataSource={dataSource}
        columns={columns}/>
      <br/>
      <div>
        <p> 注: (1) 裸软导线,绝缘导线按架空线路设计用量计算,其施工损耗不包括线路驰度及跳线长度。</p>
        <p>&emsp;&nbsp; (2) 导线损耗率中不包括与电器连接应预留的长度。</p>
        <p>&emsp;&nbsp; (3) 电力电缆损耗率中不包括备用预留长度,一级因敷设有弯曲或有弧度而增加的长度。</p>
        <p>&emsp;&nbsp; (4) 拉线的计算长度应以拉线的展开长度(包括制作所需的预留长度)为准。</p>
      </div>
    </div>
  );
}

export default AttritionRate;
