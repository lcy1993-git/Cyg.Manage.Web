import React, { useState } from 'react'
import { useControllableValue } from 'ahooks'
import { Modal, Input, message, Form, Spin } from 'antd'
import { SetStateAction } from 'react'
import { Dispatch } from 'react'
import CyFormItem from '@/components/cy-form-item'
import { createResourceInventoryMap } from '@/services/material-config/inventory'

interface MapRemarkParams {
  refreshEvent?: () => void
  refreshLib?: () => void
  onChange?: Dispatch<SetStateAction<boolean>>
  visible: boolean
  libId: string
  invId: string
}

const { TextArea } = Input

const MapRemarkModal: React.FC<MapRemarkParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const [requestLoading, setRequestLoading] = useState<boolean>(false)
  const { libId, invId, refreshEvent, refreshLib } = props

  const [form] = Form.useForm()

  const mapLibEvent = () => {
    form.validateFields().then(async (values) => {
      const { remark } = values
      try {
        setRequestLoading(true)
        await createResourceInventoryMap({
          resourceLibIds: [libId],
          inventoryOverviewId: invId,
          remark: remark,
        })
        message.success('列表映射成功')
        setState(false)
      } catch (msg) {
        console.error(msg)
      } finally {
        setRequestLoading(false)
        setState(false)
      }
      refreshEvent?.()
      refreshLib?.()
      form.resetFields()
    })
  }

  return (
    <>
      <Modal
        maskClosable={false}
        centered
        title="备注信息"
        onCancel={() => setState(false)}
        visible={state as boolean}
        width="30%"
        destroyOnClose
        bodyStyle={{ height: '138px' }}
        onOk={mapLibEvent}
      >
        <Spin spinning={requestLoading} tip="映射创建中...">
          <Form form={form}>
            <CyFormItem name="remark" label="备注" labelWidth={45}>
              <TextArea showCount maxLength={200} placeholder="备注说明" />
            </CyFormItem>
          </Form>
        </Spin>
      </Modal>
    </>
  )
}

export default MapRemarkModal
