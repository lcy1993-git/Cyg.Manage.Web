import { getHistoriesEnums } from '@/pages/visualization-results/history-grid/service'
import { useMount } from 'ahooks'
import { Button, Form, Input, Select } from 'antd'
import { useState } from 'react'
import { DrawProps } from '../../typings'
import styles from './index.less'
const { Item } = Form
const { Option } = Select
interface DrawModalProps {
  drawProps: DrawProps
}

const DrawModal = ({ drawProps }: DrawModalProps) => {
  const { position, currentState, type } = drawProps
  const [KVLevel, setKVLevel] = useState<[]>([])
  const [lineType, setLineType] = useState<[]>([])
  const [equipmentsType, setEquipmentsType] = useState<[]>([])

  const getEnums = async () => {
    const localEnums = window.sessionStorage.getItem('netFrameworkHistory}/System/Enums')
    let data = null
    if (localEnums) {
      try {
        data = JSON.parse(localEnums)
      } finally {
      }
    }

    if (!data) {
      const res = await getHistoriesEnums()
      data = res?.content
      window.sessionStorage.setItem('netFrameworkHistory}/System/Enums', JSON.stringify(data))
    }

    const KV = data?.find((item: { name: string }) => item.name === 'VoltageLevelType')
    const LT = data?.find((item: { name: string }) => item.name === 'ElectricalLineType')
    const ET = data?.find((item: { name: string }) => item.name === 'ElectricalEquipmentType')
    if (KV !== undefined) {
      // @ts-ignore
      setKVLevel(Object.entries(KV.valueDesPairs) ?? [])
    }
    if (LT !== undefined) {
      // @ts-ignore
      setLineType(Object.entries(LT.valueDesPairs) ?? [])
    }
    if (ET !== undefined) {
      // @ts-ignore
      setEquipmentsType(Object.entries(ET.valueDesPairs) ?? [])
    }
  }

  useMount(() => {
    getEnums()
  })

  const onFinish = () => {
    // console.log("完成事件");
  }

  const onCancel = () => {
    // console.log("取消");
  }

  const formatOption = (i: string[]) => {
    return {
      label: i[1],
      value: i[0],
    }
  }

  return (
    <div className={styles.drawModalWrap} style={{ left: position[0], top: position[1] }}>
      <div className={styles.title}>
        <span>添加{type === 'Point' ? '设备' : '线路'}</span>
        <span className={styles.close} onClick={onCancel}>
          x
        </span>
      </div>
      <hr className={styles.divider}></hr>
      <Form onFinish={onFinish} labelCol={{ span: 6 }} labelAlign="left">
        <Item label="名称" name="name">
          <Input placeholder="请输入名称"></Input>
        </Item>
        <Item label="类型" name="type">
          <Select options={(type === 'Point' ? equipmentsType : lineType).map(formatOption)}>
            <Option value={1}>123</Option>
          </Select>
        </Item>
        <Item label="电压等级" name="lev">
          <Select options={KVLevel.map(formatOption)}>
            <Option value={1}>123</Option>
          </Select>
        </Item>
        <Item label="长度" name="length">
          <Input></Input>
        </Item>
        <Item label="备注" name="remark">
          <Input.TextArea
            placeholder="请输入备注"
            rows={2}
            showCount
            maxLength={200}
          ></Input.TextArea>
        </Item>
        <div className={styles.footer}>
          <Button htmlType="button" style={{ marginRight: 10 }}>
            删除
          </Button>

          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default DrawModal
