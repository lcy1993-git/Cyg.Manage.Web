import GeneralTable from '@/components/general-table'
import { getPropertyList, updateComponentPropertyItem } from '@/services/resource-config/component'
import { useGetButtonJurisdictionArray } from '@/utils/hooks'
import { EditOutlined } from '@ant-design/icons'
import { useRequest, useUpdateEffect } from 'ahooks'
import { Button, Form, message, Modal } from 'antd'
import React, { useState } from 'react'
import EditAllPropertyForm from './edit-all-form'
interface ModuleDetailParams {
  libId: string
  componentId: string[]
}

const ElectricProperty: React.FC<ModuleDetailParams> = (props) => {
  const { libId, componentId } = props

  const tableRef = React.useRef<HTMLDivElement>(null)
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([])
  const [formData, setFormData] = useState<any>()
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false)
  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray()

  const [editForm] = Form.useForm()

  const { run } = useRequest(getPropertyList, {
    manual: true,
  })

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh()
    }
  }

  const columns = [
    {
      dataIndex: 'propertyName',
      index: 'propertyName',
      title: '属性名称',
      width: 280,
    },
    {
      dataIndex: 'propertyValue',
      index: 'propertyValue',
      title: '属性值',
    },
  ]

  //编辑
  const editEvent = async () => {
    const propertyData = await run({ libId: libId, componentId: componentId[0] })

    const formData = propertyData?.map((item: any) => {
      return {
        propertyName: item.propertyName,
        propertyValue: item.propertyValue,
      }
    })

    setFormData(formData)
    setEditFormVisible(true)
  }

  const sureEditcomponentDetail = () => {
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          componentId: componentId[0],
        },
        values
      )
      await updateComponentPropertyItem(submitInfo)
      refresh()
      message.success('更新成功')
      refresh()
      setEditFormVisible(false)
    })
  }

  const tableRightSlot = (
    <>
      {/* <Button type="primary" className="mr7" onClick={() => addEvent()}>
        <PlusOutlined />
        添加
      </Button> */}
      {buttonJurisdictionArray?.includes('edit-electric-property') && (
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      )}
    </>
  )

  useUpdateEffect(() => {
    refresh()
  }, [componentId])

  return (
    <div>
      <GeneralTable
        noPaging
        notShowSelect
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/ComponentProperty/GetList"
        columns={columns}
        requestSource="resource"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          libId: libId,
          componentId: componentId[0],
        }}
      />

      <Modal
        maskClosable={false}
        title="编辑-组件属性"
        width="58%"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditcomponentDetail()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        centered
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <EditAllPropertyForm editForm={editForm} formData={formData} />
        </Form>
      </Modal>
    </div>
  )
}

export default ElectricProperty
