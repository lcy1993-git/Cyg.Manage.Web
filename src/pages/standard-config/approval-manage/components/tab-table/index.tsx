import CyFormItem from '@/components/cy-form-item'
import EmptyTip from '@/components/empty-tip'
import ImageIcon from '@/components/image-icon'
import { useLayoutStore } from '@/layouts/context'
import { resourceLibApproval } from '@/services/resource-config/approval'
import { CheckSquareOutlined, CloseSquareOutlined } from '@ant-design/icons'
import { useMount } from 'ahooks'
import { Button, Form, Input, message, Modal, Spin, Table } from 'antd'
import React, { useState } from 'react'
import {
  CableChannelColumns,
  CableWellColumns,
  CategoryColumns,
  ComponentColumns,
  MaterialColumns,
  PoleTypeColumns,
} from '../../columns'
import CableMapping from '..//cable-mapping'
import CategoryInfo from '../category-info'
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
  const [approvalVisible, setApprovalVisible] = useState<boolean>(false)
  const { resourceLibApprovalListFlag, setResourceLibApprovalListFlag } = useLayoutStore()
  const [approvalType, setApprovalType] = useState<string>('')
  const [catogeryInfoVisible, setCatogeryInfoVisible] = useState<boolean>(false)
  const [approvalForm] = Form.useForm()
  // 加载效果
  const [resLoading, setResLoading] = useState<boolean>(false)

  useMount(() => {
    const operationColumns = [
      {
        dataIndex: 'operationType',
        index: 'operationType',
        title: '操作类型',
        width: 160,
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
        dataIndex: 'createdRemark',
        index: 'createdRemark',
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
    setApprovalType('aprroval')
    setApprovalVisible(true)
  }
  const rejectHandle = () => {
    if (clickKey.length === 0) {
      message.error('请选择数据后进行操作')
      return
    }
    setApprovalType('reject')
    setApprovalVisible(true)
  }
  const approvalHandle = () => {
    setResLoading(true)
    approvalForm.validateFields().then(async (value) => {
      if (approvalType === 'reject') {
        // 驳回
        const submitInfo = {
          approvalRemark: value?.approvalRemark ?? '',
          ids: clickKey,
          state: 30,
        }
        await resourceLibApproval(submitInfo)
        message.success('审批驳回成功')
        setResourceLibApprovalListFlag(!resourceLibApprovalListFlag)
        setApprovalVisible(false)
        refresh?.()
        setResLoading(false)
        setClickKey([])
      } else {
        // 通过
        const submitInfo = {
          approvalRemark: value?.approvalRemark ?? '',
          ids: clickKey,
          state: 20,
        }
        await resourceLibApproval(submitInfo)
        message.success('审批通过成功')
        setResourceLibApprovalListFlag(!resourceLibApprovalListFlag)
        setApprovalVisible(false)
        refresh?.()
        setResLoading(false)
        setClickKey([])
      }
    })
  }
  const openWireAttribute = () => {
    if (clickKey.length !== 1) {
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
    if (clickKey.length !== 1) {
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
    if (clickKey.length !== 1) {
      message.error('请选择一条数据进行查看')
      return
    }
    setComponentDetailVisible(true)
  }
  const openComponentAttribute = () => {
    if (clickKey.length !== 1) {
      message.error('请选择一条数据进行查看')
      return
    }
    if (!tableSelectData.IsElectricalEquipment) {
      message.error('请选择电气设备数据进行查看')
      return
    }
    setComponentAttributeVisible(true)
  }
  const openCatogeryInfo = () => {
    if (clickKey.length !== 1) {
      message.error('请选择一条数据进行查看')
      return
    }
    setCatogeryInfoVisible(true)
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
        {type === 'pole-type' && (
          <Button className="mr7" onClick={() => openCatogeryInfo()}>
            分类信息
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
        footer=""
        title="分类信息"
        width="92%"
        visible={catogeryInfoVisible}
        onCancel={() => setCatogeryInfoVisible(false)}
        okText="确认"
        cancelText="取消"
        destroyOnClose
      >
        <CategoryInfo data={tableSelectData} />
      </Modal>
      <Modal
        maskClosable={false}
        title={approvalType === 'reject' ? '驳回审批' : '通过审批'}
        width="680px"
        visible={approvalVisible}
        onCancel={() => setApprovalVisible(false)}
        footer={[
          <Button key="cancle" onClick={() => setApprovalVisible(false)}>
            取消
          </Button>,
          <Button key="save" type="primary" loading={resLoading} onClick={() => approvalHandle()}>
            确认
          </Button>,
        ]}
        cancelText="取消"
        destroyOnClose
      >
        <Spin
          spinning={resLoading}
          tip={approvalType === 'reject' ? '审批驳回中...' : '审批通过中...'}
        >
          <Form form={approvalForm} preserve={false}>
            <CyFormItem label="备注" name="approvalRemark">
              <TextArea showCount maxLength={100} placeholder="备注说明" />
            </CyFormItem>
          </Form>
        </Spin>
      </Modal>
    </div>
  )
}

export default TabTable
