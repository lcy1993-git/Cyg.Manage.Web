import CyFormItem from '@/components/cy-form-item'
import EmptyTip from '@/components/empty-tip'
import EnumSelect from '@/components/enum-select'
import { verificationNaturalNumber0to100 } from '@/pages/visualization-results/grid-manage/tools'
import { equipKvLevel } from '@/services/grid-manage/treeMenu'
import { TransIntervalType } from '@/services/visualization-results/list-menu'
import { useControllableValue } from 'ahooks'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styles from './index.less'

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
  const [tableKeys, setTableKeys] = useState<any[]>([])
  const [addVisible, setAddVisible] = useState<boolean>(false)
  const [isAdd, setIsAdd] = useState<boolean>(false)

  //添加按钮是否生效判断
  const [canAdd, setCanAdd] = useState<boolean>(false)
  const [form] = Form.useForm()

  // const { data, loading } = useRequest(getIntervalByTransformer({ transformerId: transId }))

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
      setTableKeys(selectedRows.map((item) => item['type']))
      setTableSelectArray(selectedRows)
    },
  }

  //添加出线间隔数据
  const addIntervalData = () => {
    setAddVisible(true)
    setIsAdd(true)
  }

  //编辑出线间隔
  const editIntervalData = () => {
    if (tableSelectArray && tableSelectArray.length === 0) {
      message.warning('请先选择需要编辑的数据')
      return
    }
    const editData = tableSelectArray[0]
    form.setFieldsValue({
      type: String(editData.type),
      publicuse: editData.publicuse,
      spare: editData.spare,
      specialPurpose: editData.specialPurpose,
      total: editData.total,
    })
    setAddVisible(true)
  }

  //暂存新增或修改的数据
  const saveEvent = () => {
    //添加出线间隔
    if (isAdd) {
      form.validateFields().then(async (values) => {
        const submitInfo = {
          transformerSubstationId: transId,
          ...values,
        }
        const copyData = [...intervalData]
        const index = intervalData.findIndex((item: any) => item.type == submitInfo.type)
        if (index > -1) {
          message.warning('已存在该电压等级的出线间隔，请编辑')
          return
        }

        copyData.splice(index, 0, submitInfo)
        dataOnchange(copyData)

        form.resetFields()
        message.success('添加成功')
        setIsAdd(false)
        setTableKeys([])
        setTableSelectArray([])
        setAddVisible(false)
      })
      return
    }

    //编辑出线间隔
    const editData = tableSelectArray[0]

    form.validateFields().then(async (values) => {
      const submitInfo = {
        id: editData.id,
        transformerSubstationId: editData.transformerSubstationId,
        ...values,
      }
      const copyData = [...intervalData]
      const index = intervalData.findIndex((item: any) => item.type == submitInfo.type)
      copyData.splice(index, 1, submitInfo)
      dataOnchange(copyData)
      form.resetFields()
      message.success('修改成功')
      setAddVisible(false)
      setTableKeys([])
      setTableSelectArray([])
    })
  }

  useEffect(() => {
    if (intervalData && intervalData.length < 3) {
      setCanAdd(false)
      return
    }
    setCanAdd(true)
  }, [intervalData])

  return (
    <>
      <Modal
        maskClosable={false}
        // bodyStyle={{ padding: '24px 24px 0' }}
        title="出线间隔"
        width="45%"
        visible={state as boolean}
        destroyOnClose
        okText="保存"
        cancelText="取消"
        onCancel={() => {
          setTableKeys([])
          setState(false)
        }}
        onOk={() => setState(false)}
      >
        <div className={styles.buttonArea}>
          <Button
            type="primary"
            className="mr7"
            onClick={() => addIntervalData()}
            disabled={canAdd}
          >
            添加
          </Button>
          <Button onClick={() => editIntervalData()}>编辑</Button>
        </div>
        <div className={styles.intervalTable}>
          <Table
            locale={{
              emptyText: <EmptyTip className="pt20 pb20" description="暂无数据" />,
            }}
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
              selectedRowKeys: tableKeys,
              ...tableSelection,
            }}
          />
        </div>
      </Modal>
      <Modal
        maskClosable={false}
        // bodyStyle={{ padding: '24px 24px 0' }}
        title={isAdd ? '添加出线间隔' : '编辑出线间隔'}
        width="350px"
        visible={addVisible}
        destroyOnClose
        okText="保存"
        cancelText="取消"
        onCancel={() => {
          setTableSelectArray([])
          setIsAdd(false)
          setAddVisible(false)
        }}
        onOk={() => saveEvent()}
      >
        <Form form={form}>
          <CyFormItem name="type" label="电压等级">
            <EnumSelect
              placeholder="请输入名称"
              enumList={intervalKvLevel}
              disabled={isAdd ? false : true}
            />
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
