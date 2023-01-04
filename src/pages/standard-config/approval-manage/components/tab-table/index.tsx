import EmptyTip from '@/components/empty-tip'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import React, { useState } from 'react'
import {
  CableChannelColumns,
  CableWellColumns,
  CategoryColumns,
  ComponentColumns,
  MaterialColumns,
  PoleTypeColumns,
} from '../../columns'

import CyFormItem from '@/components/cy-form-item'
import ImageIcon from '@/components/image-icon'
import { useLayoutStore } from '@/layouts/context'
import { resourceLibApproval } from '@/services/resource-config/approval'
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useMount } from 'ahooks'
import CableMapping from '..//cable-mapping'
import ComponentAttribute from '../component-attribute'
import ComponentDetail from '../component-detail'
import LineProperty from '../line-property'

import styles from './index.less'
const { TextArea } = Input
interface Props {
  type: string
  tableData: any[]
  refresh: () => void
}

const TabTable: React.FC<Props> = (props) => {
  const { type, tableData, refresh } = props
  const [columns, setColumns] = useState<any[]>([])
  const [clickKey, setClickKey] = useState<any[]>([])
  const [tableSelectData, setTableSelectData] = useState<any>({})
  const [wireAttributeVisible, setWireAttributeVisible] = useState<boolean>(false)
  const [cableTerminalVisible, setCableTerminalVisible] = useState<boolean>(false)
  const [componentAttributeVisible, setComponentAttributeVisible] = useState<boolean>(false)
  const [componentDetailVisible, setComponentDetailVisible] = useState<boolean>(false)
  const [rejectApprovalVisible, setRejectApprovalVisible] = useState<boolean>(false)
  const { resourceLibApprovalListFlag, setResourceLibApprovalListFlag } = useLayoutStore()
  const [rejectForm] = Form.useForm()
  useMount(() => {
    const operationColumns = [
      {
        dataIndex: 'operationType',
        index: 'operationType',
        title: '操作类型',
        width: 120,
        render: (text: any, record: any) => {
          return record.operationType === 10 ? (
            <ImageIcon width={52} height={18} imgUrl="resource-add.png" />
          ) : record.operationType === 20 ? (
            <ImageIcon width={52} height={18} imgUrl="resource-edit.png" />
          ) : (
            <ImageIcon width={66} height={18} imgUrl="resource-delete.png" />
          )
        },
      },
      {
        dataIndex: 'approvalRemark',
        index: 'approvalRemark',
        title: '提审备注',
        width: 500,
      },
    ]

    switch (type) {
      case 'material':
        setColumns(MaterialColumns.concat(operationColumns))
        break
      case 'component':
        setColumns(ComponentColumns.concat(operationColumns))
        break
      case 'category':
        // @ts-ignore
        setColumns(CategoryColumns.concat(operationColumns))
        break
      case 'pole-type':
        setColumns(PoleTypeColumns.concat(operationColumns))
        break
      case 'cable-channel':
        setColumns(CableChannelColumns.concat(operationColumns))
        break
      case 'cable-well':
        // @ts-ignore
        setColumns(CableWellColumns.concat(operationColumns))
        break
    }
  })
  const passHandle = () => {
    if (clickKey.length === 0) {
      message.error('请选择数据后进行操作')
      return
    }
    Modal.confirm({
      title: '提示',
      okText: '确认',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      content: '确定通过审批？',
      onOk: async () => {
        await resourceLibApproval({ ids: clickKey, state: 20, approvalRemark: '' })
        message.success('审批通过成功')
        setResourceLibApprovalListFlag(!resourceLibApprovalListFlag)
        refresh?.()
      },
    })
  }
  const rejectHandle = () => {
    if (clickKey.length === 0) {
      message.error('请选择数据后进行操作')
      return
    }
    setRejectApprovalVisible(true)
  }
  const rejectApproval = () => {
    rejectForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          approvalRemark: '',
          ids: clickKey,
          state: 30,
        },
        value
      )
      await resourceLibApproval(submitInfo)
      message.success('审批驳回成功')
      setResourceLibApprovalListFlag(!resourceLibApprovalListFlag)
      setRejectApprovalVisible(false)
      refresh?.()
    })
  }
  const openWireAttribute = () => {
    if (clickKey.length === 0) {
      message.error('请选择一条数据进行查看')
      return
    }
    if (tableSelectData?.MaterialType !== '导线') {
      message.error('请选择导线数据进行查看')
      return
    }
    setWireAttributeVisible(true)
  }
  const openCableTerminal = () => {
    if (clickKey.length === 0) {
      message.error('请选择一条数据进行查看')
      return
    }
    if (tableSelectData?.MaterialType !== '电力电缆') {
      message.error('请选择电力电缆数据进行查看')
      return
    }
    setCableTerminalVisible(true)
  }
  const openComponentDetail = () => {
    if (clickKey.length === 0) {
      message.error('请选择一条数据进行查看')
      return
    }
    setComponentDetailVisible(true)
  }
  const openComponentAttribute = () => {
    if (clickKey.length === 0) {
      message.error('请选择一条数据进行查看')
      return
    }
    if (!tableSelectData.IsElectricalEquipment) {
      message.error('请选择电气设备数据进行查看')
      return
    }
    setComponentAttributeVisible(true)
  }
  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button className="mr7" onClick={() => passHandle()}>
          <CheckSquareOutlined />
          通过
        </Button>
        <Button className="mr7" onClick={() => rejectHandle()}>
          <CloseSquareOutlined />
          驳回
        </Button>
        {type === 'material' && (
          <Button className="mr7" onClick={() => openWireAttribute()}>
            导线属性
          </Button>
        )}

        {type === 'material' && (
          <Button className="mr7" onClick={() => openCableTerminal()}>
            电缆终端头映射
          </Button>
        )}
        {type !== 'material' && type !== 'category' && (
          <Button className="mr7" onClick={() => openComponentDetail()}>
            组件明细
          </Button>
        )}
        {type === 'component' && (
          <Button className="mr7" onClick={() => openComponentAttribute()}>
            组件属性
          </Button>
        )}
      </div>
    )
  }

  const rowSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setClickKey(selectedRows.map((item) => item['id']))
      // 单选选中的行
      setTableSelectData(selectedRows[0])
    },
  }
  return (
    <div className={styles.wrap}>
      <div className={styles.cyGeneralTableButtonContent}>
        <div className={styles.cyGeneralTableButtonRightContent}>{tableElement?.()}</div>
      </div>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={false}
        bordered={true}
        locale={{
          emptyText: <EmptyTip className="pt20 pb20" />,
        }}
        rowSelection={{
          type: 'checkbox',
          columnWidth: '38px',
          selectedRowKeys: clickKey,
          ...rowSelection,
        }}
      />
      <Modal
        maskClosable={false}
        footer=""
        title="导线属性"
        width="880px"
        visible={wireAttributeVisible}
        onCancel={() => setWireAttributeVisible(false)}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <LineProperty data={tableSelectData} name={tableSelectData?.MaterialName} />
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        title="电缆终端头映射"
        width="92%"
        visible={cableTerminalVisible}
        onCancel={() => setCableTerminalVisible(false)}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <CableMapping data={tableSelectData} />
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        title="组件明细"
        width="92%"
        visible={componentDetailVisible}
        onCancel={() => setComponentDetailVisible(false)}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <ComponentDetail data={tableSelectData} type={type} />
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        title="组件属性"
        width="92%"
        visible={componentAttributeVisible}
        onCancel={() => setComponentAttributeVisible(false)}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <ComponentAttribute data={tableSelectData} />
      </Modal>
      <Modal
        maskClosable={false}
        title="驳回审批"
        width="680px"
        visible={rejectApprovalVisible}
        onCancel={() => setRejectApprovalVisible(false)}
        onOk={() => {
          rejectApproval()
        }}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <Form form={rejectForm} preserve={false}>
          <CyFormItem label="备注" name="failRemark">
            <TextArea showCount maxLength={100} placeholder="备注说明" />
          </CyFormItem>
        </Form>
      </Modal>
    </div>
  )
}

export default TabTable
