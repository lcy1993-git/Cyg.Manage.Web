import { createLine, GetStationItems } from '@/services/grid-manage/treeMenu'
import { useRequest } from 'ahooks'
import { Button, Form, Input, Modal, Radio, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useMyContext } from '../Context'
import { createFeatureId, KVLEVELOPTIONS } from '../DrawToolbar/GridUtils'
import DrawGridToolbar from './DrawGridToolbar'
import styles from './index.less'
import PowerSupplyTree from './PowerSupplyTree'
import SubstationTree from './SubstationTree'
interface BelongingLineType {
  id: string
  name: string
  isOverhead: boolean
  isPower: boolean
}
const { useForm } = Form
const { Option } = Select

const lineformLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
}

const LeftMenu = (props: any) => {
  const [form] = useForm()
  const [visible, setVisible] = useState(false)
  const [currentLineKvLevel, setcurrentLineKvLevel] = useState<number>(1)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { setisRefresh } = useMyContext()

  /**所属厂站**/
  const [stationItemsData, setstationItemsData] = useState<BelongingLineType[]>([])
  const showModal = () => {
    setisRefresh(false)
    setVisible(true)
  }

  const handleOk = () => {
    setConfirmLoading(true)
    const formData = form.getFieldsValue()
    const params = {
      ...formData,
      id: createFeatureId(),
    }
    createLineItem(params)
  }

  // 创建线路
  const { run: createLineItem } = useRequest(createLine, {
    manual: true,
    onSuccess: () => {
      setVisible(false)
      setConfirmLoading(false)
      setisRefresh(true)
      form.resetFields()
    },
  })

  // 获取所有厂站
  const { data: stationItems, run: stationItemsHandle } = useRequest(GetStationItems, {
    manual: true,
    onSuccess: () => {
      stationItems && setstationItemsData(stationItems)
    },
  })

  useEffect(() => {
    stationItemsHandle()
  }, [])

  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="w-full flex-none" style={{ height: '50px' }}>
        <DrawGridToolbar />
      </div>
      <div className={`w-full flex-1 flex flex-col overflow-y-auto ${styles.customScroll}`}>
        <div className={`w-full flex-none`}>
          <SubstationTree />
        </div>
        <div className={`w-full flex-1`}>
          <PowerSupplyTree />
        </div>
      </div>
      <div
        className="w-full flex-none flex items-center"
        style={{ height: '50px', paddingRight: '10px' }}
      >
        <Button type="primary" block onClick={showModal}>
          新增线路
        </Button>
      </div>

      <Modal
        title="新增线路"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setVisible(false)}
      >
        <Form {...lineformLayout} style={{ marginTop: '10px' }} form={form}>
          <Form.Item
            name="name"
            label="线路名称"
            rules={[{ required: true, message: '请输入线路名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="belonging"
            label="所属厂站"
            rules={[{ required: true, message: '请选择所属厂站' }]}
          >
            <Select allowClear>
              {stationItemsData.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="kvLevel"
            label="电压等级"
            rules={[{ required: true, message: '请选择电压等级' }]}
          >
            <Select
              onChange={(value: number) => {
                setcurrentLineKvLevel(value)
              }}
            >
              {KVLEVELOPTIONS.filter((level) => level.belonging.includes('Line')).map((item) => (
                <Option key={item.kvLevel} value={item.kvLevel}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="lineProperties"
            label="线路性质"
            rules={[{ required: true, message: '请选择线路性质' }]}
          >
            <Select>
              <Option value="公用">公用</Option>
              <Option value="专用">专用</Option>
            </Select>
          </Form.Item>

          {/* <Form.Item name="totalLength" label="线路总长度">
                <Input disabled />
              </Form.Item>
              <Form.Item name="totalCapacity" label="配变总容量">
                <Input disabled />
              </Form.Item> */}
          {!currentLineKvLevel && (
            <Form.Item
              name="color"
              label="线路颜色"
              rules={[{ required: true, message: '请选择线路颜色' }]}
            >
              <Select allowClear>
                <Option value="#00FFFF">青</Option>
                <Option value="#1EB9FF">蓝</Option>
                <Option value="#F2DA00">黄</Option>
                <Option value="#FF3E3E">红</Option>
                <Option value="#FF5ECF">洋红</Option>
              </Select>
            </Form.Item>
          )}
          <Form.Item name="isOverhead" label="是否为架空" initialValue={true}>
            <Radio.Group>
              <Radio value={true}>是</Radio>
              <Radio value={false}>否</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
export default LeftMenu
