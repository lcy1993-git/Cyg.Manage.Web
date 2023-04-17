import {
  exportMaterialListByProject,
  MaterialDataType,
} from '@/services/visualization-results/list-menu'
import { Button, message, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import React, { FC } from 'react'
import styles from './index.less'

export interface MaterialTableProps {
  data?: MaterialDataType[]
  loading: boolean
  exportParams: any
}
export const columns: ColumnsType<MaterialDataType> = [
  {
    title: '编号',
    width: 100,
    dataIndex: 'index',
    key: 'index',
    fixed: 'left',
    render: (text, record, idx) => (record.children ? idx + 1 : null),
  },
  {
    title: '物料类型',
    width: 200,
    dataIndex: 'type',
    key: 'type',
    fixed: 'left',
  },
  {
    title: '物料名称',
    width: 200,
    dataIndex: 'name',
    key: 'name',
    fixed: 'left',
  },
  {
    title: '物料型号',
    width: 500,
    dataIndex: 'spec',
    key: 'spec',
  },
  {
    title: '物料编号',
    width: 150,
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '物料编号',
    width: 150,
    dataIndex: 'materialId',
    key: 'materialId',
  },

  {
    title: '物料单位',
    width: 80,
    dataIndex: 'unit',
    key: 'unit',
  },
  {
    title: '数量',
    width: 80,
    dataIndex: 'itemNumber',
    key: 'itemNumber',
    render(v: number) {
      return v ? String(v) : ''
    },
  },

  {
    title: '单价(元)',
    width: 80,
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    render(v: number) {
      return v ? String(v) : ''
    },
  },
  {
    title: '单重(kg)',
    width: 80,
    dataIndex: 'pieceWeight',
    key: 'pieceWeight',
    render(v: number) {
      return v ? String(v) : ''
    },
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: '物料 描述',
    width: 200,
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '供给方',
    width: 200,
    dataIndex: 'supplySide',
    key: 'supplySide',
  },
  {
    title: '备注',
    width: 200,
    dataIndex: 'remark',
    key: 'remark',
  },
]

export const MaterialTable: FC<MaterialTableProps> = (props) => {
  const { data, loading, exportParams } = props
  const { checkedProjectIdList, layerstype } = exportParams
  const [messageApi, contextHolder] = message.useMessage()
  const key = 'completeDownload'

  const exportEvent = async () => {
    messageApi.open({
      key,
      type: 'loading',
      content: '导出中..',
      duration: 0,
    })
    try {
      const res = await exportMaterialListByProject({
        projectIds: checkedProjectIdList,
        designType: layerstype,
      })
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `材料汇总表.xlsx`
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', finalyFileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
    } catch (msg) {
      console.error(msg)
    } finally {
      setTimeout(() => {
        messageApi.open({
          key,
          type: 'success',
          content: '导出成功!',
          duration: 2,
        })
      }, 500)
    }
  }

  return (
    <div className={styles.materialTable}>
      {contextHolder}
      <Button
        title="导出材料汇总表"
        onClick={() => exportEvent()}
        type="primary"
        style={{ marginBottom: '10px' }}
      >
        导出
      </Button>
      <Table
        columns={columns}
        bordered
        size="middle"
        loading={loading}
        rowKey="key"
        pagination={false}
        dataSource={data}
        scroll={{ x: 1400, y: 670 }}
      />
    </div>
  )
}
