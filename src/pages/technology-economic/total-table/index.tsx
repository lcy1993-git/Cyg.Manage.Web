import WrapperComponent from '@/components/page-common-wrap'
import TableImportButton from '@/components/table-import-button'
import { queryEngineeringInfoCostTotal } from '@/services/technology-economic/total-table'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table/Table'
import qs from 'qs'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './index.less'

interface Props {}

interface TotalTableRow {
  id: string
  engineeringTemplateId: string
  no: string
  name: string
  code: string
  constructionCostFormula: null | string
  deviceCostFormula: null | string
  installCostFormula: null | string
  otherCostFormula: null | string
  basicReserveCostFormula: null | string
  totalCostFormula: null | string
  staticInvestmentRatio: null | string
  unitInvestmentCountFormula: null | string
  unit: null | string
  unitInvestmentFormula: null | string
  costNo: null | string
  remark: null | string
  parentId: null | string
  isLeaf: boolean
  sort: number
}

const TotalTable: React.FC<Props> = () => {
  const [dataSource, setDataSource] = useState<TotalTableRow[]>([])
  const id = (qs.parse(window.location.href.split('?')[1]).id as string) || ''
  const columns: ColumnsType<any> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      dataIndex: 'no',
      render: (text: string) => {
        return text?.includes(')') ? <span>&emsp;{text}</span> : <span>{text}</span>
      },
    },
    {
      dataIndex: 'name',

      title: '名称',
      align: 'center',
      width: 220,
    },
    {
      dataIndex: 'code',

      title: '代码',
      align: 'center',
      width: 80,
    },
    {
      dataIndex: 'constructionCostFormula',

      ellipsis: true,
      title: '建筑工程费(JZF)',
      align: 'center',
      width: 270,
    },
    {
      dataIndex: 'deviceCostFormula',

      title: '设备购置费(SBF)',
      ellipsis: true,
      align: 'center',
      width: 240,
    },
    {
      dataIndex: 'installCostFormula',

      title: '安装工程费(AZF)',
      align: 'center',
      ellipsis: true,
      width: 250,
    },
    {
      dataIndex: 'otherCostFormula',

      title: '其他费用(QTF)',
      align: 'center',
      ellipsis: true,
      width: 220,
    },
    {
      dataIndex: 'basicReserveCostFormula',

      title: '基本预备费(JBYBF)',
      align: 'center',
      width: 220,
      ellipsis: true,
    },
    {
      dataIndex: 'totalCostFormula',

      title: '合计费(HJF)',
      align: 'center',
      ellipsis: true,
      width: 200,
    },
    {
      dataIndex: 'staticInvestmentRatio',

      title: '静态投资比例(ZZJ)',
      width: 220,
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'unitInvestmentCountFormula',

      title: '单位投资量',
      width: 200,
      ellipsis: true,
      align: 'center',
    },
    {
      dataIndex: 'unit',

      title: '单位',
      width: 80,
      align: 'center',
    },
    {
      dataIndex: 'unitInvestmentFormula',

      title: '单位投资(DWTZ)',
      width: 220,
      align: 'center',
      ellipsis: true,
    },
    // {
    //   dataIndex: 'costNo',
    //   key: 'costNo',
    //   title: '费用编码',
    //   width: 120,
    //   align: 'center',
    // },
    {
      dataIndex: 'remark',

      title: '备注',
      width: 220,
      ellipsis: true,
      align: 'center',
    },
  ]
  const getTableData = useCallback(async () => {
    let res = await queryEngineeringInfoCostTotal(id)
    res = res?.map((item: { children: any[] | null }) => {
      if (item.children?.length === 0) {
        item.children = null
      } else {
        item.children = item.children?.map((child) => {
          child.children = child.children?.length === 0 ? null : child.children
          return child
        })
      }
      return item
    })
    // @ts-ignore
    setDataSource(res)
  }, [id])
  useEffect(() => {
    getTableData()
  }, [getTableData])
  return (
    <WrapperComponent>
      <div className={styles.totalTable}>
        <div className={styles.topButton}>
          <TableImportButton
            extraParams={{}}
            buttonTitle={'导入总算表'}
            requestSource={'tecEco1'}
            setSuccessful={getTableData}
            importUrl={`/EngineeringTotal/ImportEngineeringInfoCostTotal?EngineeringTemplateId=${id}`}
          />
        </div>
        <Table
          pagination={false}
          size={'small'}
          expandIconColumnIndex={1}
          scroll={{ y: 720, x: 2200 }}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    </WrapperComponent>
  )
}

export default TotalTable
