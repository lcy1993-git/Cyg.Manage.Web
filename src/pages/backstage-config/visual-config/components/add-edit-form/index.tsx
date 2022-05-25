import React from 'react'
import { Input, Tooltip } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import EnumSelect from '@/components/enum-select'
import { LayerTypes, ElementTypes } from '@/services/backstage-config/visual-config'
import { ExclamationCircleOutlined } from '@ant-design/icons'

interface VisualConfigProps {
  form?: any
}

const VisualConfigForm: React.FC<VisualConfigProps> = (props) => {
  const { form } = props

  const titleSlot = () => {
    return (
      <>
        <span>限制数量</span>
        <Tooltip title="输入'-1'表示不限制数量，查询全部，输入'0'表示不查询" placement="top">
          <ExclamationCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
        </Tooltip>
      </>
    )
  }
  return (
    <>
      <CyFormItem label="图层类别" labelWidth={98} name="layerTypes" required>
        <EnumSelect enumList={LayerTypes} placeholder="请选择图层类别" mode="multiple" />
      </CyFormItem>

      <CyFormItem label="元素类别" labelWidth={98} name="elementTypes" required>
        <EnumSelect enumList={ElementTypes} placeholder="请选择元素类别" mode="multiple" />
      </CyFormItem>
      <CyFormItem labelSlot={titleSlot} labelWidth={98} name="limitQty" required>
        <Input type="number" placeholder="请输入限制数量" />
      </CyFormItem>
      <CyFormItem label="备注" labelWidth={98} name="remark">
        <Input placeholder="请输入备注内容" />
      </CyFormItem>

      <CyFormItem
        label="最小缩放等级"
        name="minZoomLevel"
        required
        dependencies={['maxZoomLevel']}
        align="right"
        labelWidth={98}
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

      <CyFormItem
        label="最大缩放等级"
        name="maxZoomLevel"
        required
        dependencies={['minZoomLevel']}
        align="right"
        labelWidth={98}
        initialValue={20}
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
    </>
  )
}

export default VisualConfigForm
