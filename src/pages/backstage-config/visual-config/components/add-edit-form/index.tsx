import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { ElementTypes, LayerTypes } from '@/services/backstage-config/visual-config'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Col, Input, Row, Tooltip } from 'antd'
import React from 'react'

interface VisualConfigProps {
  form?: any
}

const VisualConfigForm: React.FC<VisualConfigProps> = (props) => {
  const { form } = props
  // const [limitQtyValue, setLimitQtyValue] = useState<string>()
  // const changeOptions = (value: string) => {
  //   OPTIONS.map((item: any) => {
  //     if (item.value) {
  //     }
  //   })
  // }
  const titleSlot = (title: string) => {
    return (
      <>
        <span>{title}</span>
        <Tooltip title="输入'-1'表示不限制数量，查询全部，输入'0'表示不查询" placement="top">
          <ExclamationCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
        </Tooltip>
      </>
    )
  }
  return (
    <>
      <CyFormItem label="图层类别" labelWidth={133} name="layerTypes" required>
        <EnumSelect enumList={LayerTypes} placeholder="请选择图层类别" mode="multiple" />
      </CyFormItem>
      <Row>
        <Col span={14}>
          <CyFormItem
            label="缩放等级范围"
            name="minZoomLevel"
            required
            dependencies={['maxZoomLevel']}
            labelWidth={133}
            initialValue={1}
            rules={[
              { required: true, message: '最小缩放等级不能为空' },
              { pattern: /^\+?[1-9][0-9]*$/, message: '请输入1-99的正整数' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    getFieldValue('maxZoomLevel') &&
                    Number(value) > Number(getFieldValue('maxZoomLevel'))
                  ) {
                    return Promise.reject('最小缩放等级不可大于最大缩放等级')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              style={{ width: '180px' }}
              type="number"
              placeholder="请输入最小缩放等级"
              min={1}
              onChange={(e) => {
                if (Number(e.target.value) > 99) {
                  form.setFieldsValue({ minZoomLevel: 99 })
                  return
                }
              }}
            />
          </CyFormItem>
        </Col>
        <Col>
          <CyFormItem
            label="—"
            name="maxZoomLevel"
            dependencies={['minZoomLevel']}
            initialValue={20}
            labelWidth={0}
            rules={[
              { required: true, message: '最大缩放等级不能为空' },
              { pattern: /^\+?[1-9][0-9]*$/, message: '请输入1-99的正整数' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    getFieldValue('minZoomLevel') &&
                    Number(value) < Number(getFieldValue('minZoomLevel'))
                  ) {
                    return Promise.reject('最大缩放等级不可小于最小缩放等级')
                  }
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input
              style={{ width: '205px' }}
              type="number"
              placeholder="请输入最大缩放等级"
              max={99}
              onChange={(e) => {
                if (Number(e.target.value) > 99) {
                  form.setFieldsValue({ maxZoomLevel: 99 })
                  return
                }
              }}
            />
          </CyFormItem>
        </Col>
      </Row>

      <CyFormItem label="元素类别" labelWidth={133} name="elementTypes" required>
        <EnumSelect enumList={ElementTypes} placeholder="请选择元素类别" mode="multiple" />
      </CyFormItem>

      <CyFormItem
        labelSlot={() => titleSlot('限制总数量')}
        labelWidth={133}
        name="limitQty"
        required
      >
        <Input type="number" placeholder="请输入总数量限制" />
      </CyFormItem>

      <CyFormItem
        labelSlot={() => titleSlot('限制项目数量')}
        labelWidth={133}
        name="projectQty"
        required
      >
        <Input type="number" placeholder="请输入限制项目数量" />
      </CyFormItem>

      <CyFormItem
        labelSlot={() => titleSlot('按项目限制数量')}
        labelWidth={133}
        name="projectLimitQty"
        required
      >
        <Input type="number" placeholder="请输入项目数量限制" />
        {/* <Select placeholder="请输入项目数量限制" style={{ width: '100%' }}>
          <Option value={-1}>查询全部</Option>
          <Option value={0}>不查询</Option>
        </Select> */}
      </CyFormItem>
      <CyFormItem label="备注" labelWidth={133} name="remark">
        <Input placeholder="请输入备注内容" />
      </CyFormItem>
    </>
  )
}

export default VisualConfigForm
