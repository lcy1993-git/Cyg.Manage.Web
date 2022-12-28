import CommonTitle from '@/components/common-title'
import EmptyTip from '@/components/empty-tip'
import PageCommonWrap from '@/components/page-common-wrap'
import { Button, Form, Input, message, Modal, Table } from 'antd'
import React, { useState } from 'react'
import {
  CableChannelColumns,
  CableWellColumns,
  CategoryColumns,
  ComponentColumns,
  MaterialColumns,
  PoleTypeColumns,
} from './columns'

import CyFormItem from '@/components/cy-form-item'
import { useLayoutStore } from '@/layouts/context'
import { resourceLibApproval } from '@/services/resource-config/approval'
import {
  CheckSquareOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { useMount } from 'ahooks'
import qs from 'qs'
import CableMapping from './components/cable-mapping'
import ComponentAttribute from './components/component-attribute'
import ComponentDetail from './components/component-detail'
import LineProperty from './components/line-property'

import styles from './index.less'
const { TextArea } = Input
interface Props {}

const ApprovalManage: React.FC<Props> = (props) => {
  const approvalId = qs.parse(window.location.href.split('?')[1]).id as string
  const type = qs.parse(window.location.href.split('?')[1]).type as string
  const [tableData, setTableData] = useState<any[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [clickKey, setClickKey] = useState<any[]>([])
  const [tableSelectData, setTableSelectData] = useState<any>({})
  const [wireAttributeVisible, setWireAttributeVisible] = useState<boolean>(false)
  const [cableTerminalVisible, setCableTerminalVisible] = useState<boolean>(false)
  const [componentAttributeVisible, setComponentAttributeVisible] = useState<boolean>(false)
  const [componentDetailVisible, setComponentDetailVisible] = useState<boolean>(false)
  const [rejectApprovalVisible, setRejectApprovalVisible] = useState<boolean>(false)
  const { resourceLibApprovalListFlag, setResourceLibApprovalListFlag } = useLayoutStore()
  const [isApprovaled, setIsApprovaled] = useState<boolean>(false)
  const [rejectForm] = Form.useForm()

  useMount(() => {
    switch (type) {
      case 'material':
        setColumns(MaterialColumns)
        break
      case 'component':
        setColumns(ComponentColumns)
        break
      case 'category':
        setColumns(CategoryColumns)
        break
      case 'pole-type':
        setColumns(PoleTypeColumns)
        break
      case 'cable-channel':
        setColumns(CableChannelColumns)
        break
      case 'cable-well':
        setColumns(CableWellColumns)
        break
    }
    const data = JSON.parse(window.localStorage.getItem('approval-manage-data') as string)
    setTableData([data])
  })
  const passHandle = () => {
    if (isApprovaled) {
      message.warn('已完成审批，请勿重复提交')
      return
    }
    Modal.confirm({
      title: '提示',
      okText: '确认',
      icon: <ExclamationCircleOutlined />,
      cancelText: '取消',
      content: '确定通过审批？',
      onOk: async () => {
        await resourceLibApproval({ id: approvalId, state: 20, failRemark: '' })
        message.success('审批通过成功')
        setResourceLibApprovalListFlag(!resourceLibApprovalListFlag)
        setIsApprovaled(true)
      },
    })
  }
  const rejectHandle = () => {
    if (isApprovaled) {
      message.warn('已完成审批，请勿重复提交')
      return
    }
    setRejectApprovalVisible(true)
  }
  const rejectApproval = () => {
    rejectForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          failRemark: '',
          id: approvalId,
          state: 30,
        },
        value
      )

      await resourceLibApproval(submitInfo)
      message.success('审批驳回成功')
      setResourceLibApprovalListFlag(!resourceLibApprovalListFlag)
      setRejectApprovalVisible(false)
      setIsApprovaled(true)
    })
  }
  const openWireAttribute = () => {
    if (clickKey.length === 0) {
      message.error('请选择一条数据进行查看')
      return
    }
    if (tableSelectData?.materialType !== '导线') {
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
    if (tableSelectData?.materialType !== '电力电缆') {
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
    if (!tableSelectData.isElectricalEquipment) {
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
    <PageCommonWrap>
      <div className={styles.wrap}>
        <div className={styles.cyGeneralTableTitleContnet}>
          <div className={styles.cyGeneralTableTitleShowContent}>
            {<CommonTitle>{'资源审批'}</CommonTitle>}
          </div>
        </div>
        <div className={styles.cyGeneralTableButtonContent}>
          <div className={styles.cyGeneralTableButtonRightContent}>{tableElement?.()}</div>
        </div>
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="id"
          pagination={false}
          bordered={true}
          // loading={tableListLoading}
          locale={{
            emptyText: <EmptyTip className="pt20 pb20" />,
          }}
          rowSelection={{
            type: 'radio',
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
          <LineProperty data={tableSelectData} />
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
    </PageCommonWrap>
  )
}

export default ApprovalManage
