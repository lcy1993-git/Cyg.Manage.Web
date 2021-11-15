import React, { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Popconfirm, Space, Select } from 'antd'

import styles from './index.less'
const Option = Select
export interface ElectricalEquipmentForm {
  name?: string
  type?: string
  remark?: string
  level?: number | string
}
interface Props {
  onFinish?: (values: ElectricalEquipmentForm) => void
  type: 'add' | 'edit'
  onDelete?: () => void
  values?: ElectricalEquipmentForm
}
const AddElectricalEquipment: React.FC<Props> = (props) => {
  const { onFinish, onDelete, values, type } = props
  const [form] = Form.useForm()
  const handleDelete = () => {
    onDelete?.()
  }
  const handleFinish = (values: ElectricalEquipmentForm) => {
    onFinish?.(values)
  }
  useEffect(() => {
    if (type === 'edit' && values && Object.values(values).length !== 0) {
      form.setFieldsValue(values)
    }
  }, [values, type, form])
  return (
    <div className={styles.formBox}>
      <Form form={form} labelAlign={'right'} onFinish={handleFinish}>
        <Form.Item name="name" label="名称">
          <Input placeholder="名称" type="text" />
        </Form.Item>

        <Form.Item name="type" label={'类型'}>
          <Select defaultValue="1">
            <Option value="1">1</Option>
            <Option value="2">2</Option>
            <Option value="3">3</Option>
            <Option value="4">4</Option>
          </Select>
        </Form.Item>
        <Form.Item name="level" label={'电压等级'}>
          <Select defaultValue="10">
            <Option value="35">35KV</Option>
            <Option value="10">10KV</Option>
            <Option value="20">20KV</Option>
            <Option value="380">380KV</Option>
            <Option value="220">220KV</Option>
          </Select>
        </Form.Item>
        <Form.Item name="remark" label={'备注'}>
          <Input.TextArea maxLength={200} rows={2} />
        </Form.Item>
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <Space>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Popconfirm
              placement="topLeft"
              title={'确认删除当前对象？'}
              onConfirm={handleDelete}
              okText="确定"
              cancelText="取消"
            >
              <Button>删除</Button>
            </Popconfirm>
          </Space>
        </div>
      </Form>
    </div>
  )
}

export default AddElectricalEquipment
