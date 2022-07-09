import { equipKvLevel, getIntervalByTransformer } from '@/services/grid-manage/treeMenu'
import { TransIntervalType } from '@/services/visualization-results/list-menu'
import { useControllableValue, useRequest } from 'ahooks'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dispatch, FC, SetStateAction, useState } from 'react'
import CyFormItem from '@/components/cy-form-item'
import styles from './index.less'
import EnumSelect from '@/components/enum-select'
import { verificationNaturalNumber0to100 } from '@/pages/visualization-results/grid-manage/tools'

interface TransIntervalTableProps {
  transId: string
  visible: boolean
  onChange: Dispatch<SetStateAction<boolean>>
  dataOnchange: Dispatch<SetStateAction<any[]>>
  intervalData: any[]
}

enum intervalKvLevel {
  '10kV' = 3,
  '35kV' = 5,
  '110kV' = 6,
}
export const TransIntervalTable: FC<TransIntervalTableProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { transId, dataOnchange, intervalData } = props
  const [tableSelectArray, setTableSelectArray] = useState<any[]>([])
  const [addVisible, setAddVisible] = useState<boolean>(false)

  // const { data, loading } = useRequest(getIntervalByTransformer({ transformerId: transId }))

  // console.log(data, '111')

  const columns: ColumnsType<TransIntervalType> = [
    {
      title: '电压等级',
      width: '19.5%',
      dataIndex: 'type',
      key: 'type',
      fixed: 'left',
      render: (text: any, record: any) => {
        return equipKvLevel[record.type]
      },
    },

    {
      title: '公用',
      width: '19.5%',
      dataIndex: 'publicuse',
      key: 'publicuse',
    },
    {
      title: '备用',
      width: '19.5%',
      dataIndex: 'spare',
      key: 'spare',
    },
    {
      title: '专用',
      width: '19.5%',
      dataIndex: 'specialPurpose',
      key: 'specialPurpose',
    },
    {
      title: '总数',
      width: '19.5%',
      dataIndex: 'total',
      key: 'total',
    },
  ]

  const tableSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setTableSelectArray(selectedRows.map((item) => item['type']))
    },
  }

  //添加出线间隔数据
  const addIntervalData = () => {
    if (intervalData && intervalData.length < 3) {
      setAddVisible(true)
      return
    }
    if (tableSelectArray.length === 0) {
      message.warning('请先选择要编辑的数据')
      return
    }
    setAddVisible(true)
  }

  return (
    <>
      <Modal
        maskClosable={false}
        // bodyStyle={{ padding: '24px 24px 0' }}
        title="出线间隔"
        width="45%"
        visible={state as boolean}
        destroyOnClose
        okText="确定"
        footer=""
        cancelText="取消"
        onCancel={() => setState(false)}
      >
        <div className={styles.buttonArea}>
          <Button type="primary" onClick={() => addIntervalData()}>
            添加/编辑
          </Button>
        </div>
        <div className={styles.intervalTable}>
          <Table
            columns={columns}
            bordered
            size="middle"
            rowKey="type"
            pagination={false}
            dataSource={intervalData}
            defaultExpandAllRows
            rowSelection={{
              type: 'radio',
              columnWidth: '15px',
              selectedRowKeys: tableSelectArray,
              ...tableSelection,
            }}
          />
        </div>
      </Modal>
      {/* <AddInervalForm /> */}
      <Modal
        maskClosable={false}
        // bodyStyle={{ padding: '24px 24px 0' }}
        title="出线间隔"
        width="350px"
        visible={addVisible}
        destroyOnClose
        okText="确定"
        footer=""
        cancelText="取消"
        onCancel={() => setAddVisible(false)}
      >
        <Form>
          <CyFormItem name="type" label="电压等级">
            <EnumSelect placeholder="请输入名称" enumList={intervalKvLevel} />
          </CyFormItem>
          <CyFormItem name="publicuse" label="公用" rules={[verificationNaturalNumber0to100]}>
            <Input placeholder="请输入" />
          </CyFormItem>
          <CyFormItem name="spare" label="备用" rules={[verificationNaturalNumber0to100]}>
            <Input placeholder="请输入" />
          </CyFormItem>
          <CyFormItem name="specialPurpose" label="专用" rules={[verificationNaturalNumber0to100]}>
            <Input placeholder="请输入" />
          </CyFormItem>
          <CyFormItem name="total" label="总数" rules={[verificationNaturalNumber0to100]}>
            <Input placeholder="请输入" />
          </CyFormItem>
        </Form>
      </Modal>
    </>
  )
}

export default TransIntervalTable

// const AddInervalForm = () => {
//   return (

//   )
// }
