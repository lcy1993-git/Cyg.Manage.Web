import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Popconfirm, Space, Select } from 'antd'

import styles from './index.less'
import { CloseOutlined } from '@ant-design/icons'
import { useMount } from 'ahooks'
const { Option } = Select
export interface ElectricalEquipmentForm {
  name?: string
  type?: string
  remark?: string
  level?: number | string
}
interface Props {
  data: string[] // 数据源
  visible: boolean
  type: 'Point' | 'LineString' // 类型
  showLength?: boolean //是否显示长度栏
  position?: {
    // 窗口位置
    x: number
    y: number
  }
}
const AddElectricalEquipment: React.FC<Props> = (props) => {
  const {
    type = 'add',
    showLength = false,
    position = {
      x: 100,
      y: 100,
    },
    visible = false,
    data,
  } = props
  const [form] = Form.useForm()
  const [KVLevel, setKVLevel] = useState<{ value: string | number; text: string }[]>([])
  const [lineType, setLineType] = useState<{ value: string | number; text: string }[]>([])
  const handleDelete = () => {}
  const handleFinish = (values: ElectricalEquipmentForm) => {}
  useEffect(() => {}, [type, form])
  useMount(() => {
    const obj = JSON.parse(localStorage.getItem('technologyEconomicEnums') ?? '')
    if (obj) {
      const res = obj.find((item: { code: string }) => item.code === 'KVLevel')
      const res1 = obj.find((item: { code: string }) => item.code === 'LineMajorType')
      if (!!res) {
        setKVLevel(res.items)
      }
      if (!!res1) {
        setLineType(res1.items)
      }
    }
  })
  return (
    <div
      className={styles.formBox}
      style={{
        top: position.y,
        left: position.x,
        display: visible ? 'block' : 'none',
      }}
    >
      <div className={styles.header}>
        <div>
          {type === 'LineString'
            ? data.length === 0
              ? `添加线路`
              : '编辑线路'
            : data.length === 0
            ? `添加电气设备`
            : '编辑电气设备'}
        </div>
        <CloseOutlined className={styles.closeIcon} />
      </div>
      <div className={styles.form}>
        <Form form={form} onFinish={handleFinish}>
          <Form.Item name="name" label="名称">
            <Input placeholder="名称" type="text" />
          </Form.Item>
          <Form.Item name="type" label={'类型'}>
            <Select>
              {lineType.map((item) => {
                return (
                  <Option value={item.value} key={item.value}>
                    {item.text}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item name="level" label={'电压等级'}>
            <Select>
              {KVLevel.map((item) => {
                return (
                  <Option value={item.value} key={item.value}>
                    {item.text}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>
          {showLength && (
            <p className={styles.lengthBox}>
              长度:<span style={{ textIndent: '10px', display: 'inline-block' }}>{20}km</span>
            </p>
          )}
          {data.length <= 1 && (
            <Form.Item name="remark" label={'备注'}>
              <Input.TextArea maxLength={200} rows={2} />
            </Form.Item>
          )}
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
    </div>
  )
}

export default AddElectricalEquipment
