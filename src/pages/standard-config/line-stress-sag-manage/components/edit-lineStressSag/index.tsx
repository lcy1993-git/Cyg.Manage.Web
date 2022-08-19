import React, { useEffect } from 'react'
import { Input, Form, Modal } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import { updateLineStressSagItem } from '@/services/resource-config/line-strss-sag'
import { useUpdateEffect } from 'ahooks'

interface EditLineStressSagParams {
  visible: boolean
  onChange: (a: boolean) => void
  libId: string
  row: any
  refreshTable: () => void
}

const EditLineStressSag: React.FC<EditLineStressSagParams> = (props) => {
  const { visible, onChange, libId, row, refreshTable } = props
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
      refreshTable()
    })
  }
  const [form] = Form.useForm()
  useUpdateEffect(() => {
    form.setFieldsValue(row)
  }, [visible])
  return (
    <>
      <Modal
        maskClosable={false}
        title="编辑-应力弧垂表"
        width="680px"
        visible={visible}
        okText="确认"
        onOk={() => sureEdit()}
        onCancel={() => onChange(false)}
        cancelText="取消"
        bodyStyle={{ height: '480px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={form} preserve={false}>
          <CyFormItem
            label="气象区"
            name="meteorologic"
            labelWidth={98}
            align="left"
            required
            rules={[{ required: true, message: '气象区不能为空' }]}
          >
            <Input disabled />
          </CyFormItem>

          <CyFormItem
            label="导线型号"
            name="spec"
            labelWidth={98}
            align="left"
            required
            rules={[{ required: true, message: '导线型号不能为空' }]}
          >
            <Input disabled />
          </CyFormItem>
          <CyFormItem
            label="应力"
            name="stress"
            labelWidth={98}
            align="left"
            required
            rules={[{ required: true, message: '应力不能为空' }]}
          >
            <Input placeholder="请输入应力" />
          </CyFormItem>
          <CyFormItem
            label="综合比值"
            name="comparativeLoad"
            labelWidth={98}
            align="left"
            required
            rules={[{ required: true, message: '综合比值不能为空' }]}
          >
            <Input placeholder="请输入综合比值" />
          </CyFormItem>
          <CyFormItem
            label="K值"
            name="kValue"
            labelWidth={98}
            align="left"
            required
            rules={[{ required: true, message: 'K值不能为空' }]}
          >
            <Input placeholder="请输入K值" />
          </CyFormItem>
          <CyFormItem label="应力弧垂表图纸" name="chartName" labelWidth={98} align="left">
            <Input disabled />
          </CyFormItem>
          <CyFormItem
            label="安全系数"
            name="safetyFactor"
            labelWidth={98}
            align="left"
            required
            rules={[{ required: true, message: '安全系数不能为空' }]}
          >
            <Input disabled />
          </CyFormItem>
        </Form>
      </Modal>
    </>
  )
}

export default EditLineStressSag
