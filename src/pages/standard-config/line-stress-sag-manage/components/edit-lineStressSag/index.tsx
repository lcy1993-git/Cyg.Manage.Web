import React from 'react'
import { Input, Form, Modal } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import { updateLineStressSagItem } from '@/services/resource-config/line-strss-sag'
import { useUpdateEffect, useControllableValue } from 'ahooks'
import { divide } from 'lodash'

interface DisplayItemParams {
  value?: string
}
const DisplayItem: React.FC<DisplayItemParams> = (props) => {
  const { value } = props
  return <div>{value}</div>
}

interface EditLineStressSagParams {
  visible: boolean
  onChange: (a: boolean) => void
  libId: string
  row: any
  changeFinishEvent: () => void
}

const EditLineStressSag: React.FC<EditLineStressSagParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' })
  const { onChange, libId, row, changeFinishEvent } = props
  const sureEdit = () => {
    form.validateFields().then(async (values) => {
      await updateLineStressSagItem({
        id: row.id,
        resourceLibId: libId,
        stress: values.stress,
        comparativeLoad: values.comparativeLoad,
        kValue: values.kValue,
      })
      onChange(false)
      changeFinishEvent()
    })
  }
  const [form] = Form.useForm()
  useUpdateEffect(() => {
    form.setFieldsValue(row)
  }, [state])

  return (
    <>
      <Modal
        maskClosable={false}
        title="编辑-应力弧垂表"
        width="680px"
        visible={state}
        okText="确认"
        onOk={() => sureEdit()}
        onCancel={() => setState(false)}
        cancelText="取消"
        bodyStyle={{ height: '480px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={form} preserve={false}>
          <CyFormItem label="气象区" name="meteorologic" labelWidth={120} align="left">
            <DisplayItem />
          </CyFormItem>

          <CyFormItem label="导线型号" name="spec" labelWidth={120} align="left">
            <DisplayItem />
          </CyFormItem>
          <CyFormItem label="应力弧垂表图纸" name="chartName" labelWidth={120} align="left">
            <DisplayItem />
          </CyFormItem>
          <CyFormItem label="安全系数" name="safetyFactor" labelWidth={120} align="left">
            <DisplayItem />
          </CyFormItem>
          <CyFormItem
            label="应力"
            name="stress"
            labelWidth={120}
            align="left"
            required
            rules={[{ required: true, message: '应力不能为空' }]}
          >
            <Input placeholder="请输入应力" />
          </CyFormItem>
          <CyFormItem
            label="综合比值"
            name="comparativeLoad"
            labelWidth={120}
            align="left"
            required
            rules={[{ required: true, message: '综合比值不能为空' }]}
          >
            <Input placeholder="请输入综合比值" />
          </CyFormItem>
          <CyFormItem
            label="K值"
            name="kValue"
            labelWidth={120}
            align="left"
            required
            rules={[{ required: true, message: 'K值不能为空' }]}
          >
            <Input placeholder="请输入K值" />
          </CyFormItem>
        </Form>
      </Modal>
    </>
  )
}

export default EditLineStressSag
