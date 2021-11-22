import { useGridMap } from '@/pages/visualization-results/history-grid/store/mapReducer'
import { CloseOutlined } from '@ant-design/icons'
import { useMount } from 'ahooks'
import { Button, Form, Input, Popconfirm, Select, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.less'

const { Option } = Select
export interface ElectricalEquipmentForm {
  name?: string
  id?: string
  lat?: number
  lng?: number
  type?: string
  remark?: string
  length?: number
  level?: number | string
}
interface Props {}
const HistoryGirdForm: React.FC<Props> = (props) => {
  const [state, setState] = useGridMap()
  const [position, setPosition] = useState<number[]>([10, 155]) // 鼠标位置
  const [isEdit, setIsEdit] = useState<boolean>(false) // 是否编辑状态
  const [visible, setVisible] = useState<boolean>(false) // 是否可见
  const [showLength, setShowLength] = useState<boolean>(false) // 是否显示长度
  const [type, setType] = useState<'LineString' | 'Point'>('LineString') // 是否显示长度
  const {
    isDraw, //是否绘制模式
    dataSource, // 绘制元素的数据源
    selectedData, //被选中的元素
    currentMousePosition, // 当前操作鼠标位置
  } = state
  const [form] = Form.useForm()
  const [KVLevel, setKVLevel] = useState<{ value: string | number; text: string }[]>([])
  const [lineType, setLineType] = useState<{ value: string | number; text: string }[]>([])
  const handleDelete = () => {}
  const handleFinish = (values: ElectricalEquipmentForm) => {}
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
  const hideModel = () => {
    setVisible(false)
  }
  useEffect(() => {
    setVisible(isDraw)
    if (isDraw && selectedData.length === 1) {
      setVisible(true)
      form.setFieldsValue(selectedData[0])
      setIsEdit(selectedData[0]?.name === '')
      setPosition(
        selectedData[0]?.name === ''
          ? [window?.event?.pageX + 20 ?? 0, window?.event?.pageY - 100 ?? 0]
          : [10, 155]
      )
    } else if (isDraw && selectedData.length > 1) {
      form.setFieldsValue({
        name: '',
        type: '',
        remark: '',
        level: '',
      })
      setPosition([10, 155])
      setIsEdit(false)
    }
  }, [isDraw, dataSource, selectedData, form, currentMousePosition])
  return (
    <div
      className={styles.formBox}
      style={{
        width: dataSource?.length !== 0 ? '324px' : '224px',
        top: position[1],
        left: position[0],
        display: isDraw && selectedData.length > 0 && visible ? 'block' : 'none',
      }}
    >
      <div className={styles.header}>
        {!isDraw ? (
          <div>{type === 'LineString' ? '线路' : '电气设备'}</div>
        ) : (
          <div>
            {type === 'LineString'
              ? dataSource?.length === 0
                ? `添加线路`
                : '编辑线路'
              : dataSource?.length === 0
              ? `添加电气设备`
              : '编辑电气设备'}
          </div>
        )}
        <CloseOutlined
          className={styles.closeIcon}
          onClick={hideModel}
          style={{ color: '#666666', fontSize: '14px' }}
        />
      </div>
      {!isDraw ? (
        <div className={styles.detailBox}>
          <p className={styles.detailInfo}>
            <span className={styles.detailTitle}>名称: </span>111
          </p>
          <p className={styles.detailInfo}>
            <span className={styles.detailTitle}>类型: </span>222
          </p>
          <p className={styles.detailInfo}>
            <span className={styles.detailTitle}>电压等级: </span>333
          </p>
          <p className={styles.detailInfo}>
            <span className={styles.detailTitle}>备注: </span>444
          </p>
        </div>
      ) : (
        <div className={styles.form}>
          <Form form={form} onFinish={handleFinish} layout={isEdit ? 'horizontal' : 'vertical'}>
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
              <Select style={{ width: '80px' }}>
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
            {dataSource?.length >= 1 && (
              <Form.Item name="remark" label={'备注'}>
                <Input.TextArea maxLength={200} rows={2} />
              </Form.Item>
            )}
            <div style={{ display: 'flex', justifyContent: 'end' }}>
              <Space>
                <Popconfirm
                  placement="topLeft"
                  title={'确认删除当前对象？'}
                  onConfirm={handleDelete}
                  okText="确定"
                  cancelText="取消"
                >
                  <Button>删除</Button>
                </Popconfirm>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
              </Space>
            </div>
          </Form>
        </div>
      )}
    </div>
  )
}

export default HistoryGirdForm
