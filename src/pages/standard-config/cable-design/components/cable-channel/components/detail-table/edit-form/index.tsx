import React from 'react'
import { Input, InputNumber } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import CascaderUrlSelect from '@/components/material-cascader-url-select'
import Scrollbars from 'react-custom-scrollbars'

interface EditCableChannelDetailParams {
  resourceLibId: string
}

const EditCableChannelDetail: React.FC<EditCableChannelDetailParams> = (props) => {
  const { resourceLibId } = props

  return (
    <>
      <Scrollbars autoHeight>
        <CyFormItem
          align="right"
          label="组件"
          name="componentId"
          dependencies={['materialId']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('materialId') != undefined && value) {
                  return Promise.reject('组件或物料选其一')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <CascaderUrlSelect urlHead="Component" libId={resourceLibId} />
        </CyFormItem>

        <CyFormItem
          align="right"
          label="物料"
          name="materialId"
          dependencies={['componentId']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('componentId') != undefined && value) {
                  return Promise.reject('组件或物料选其一')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <CascaderUrlSelect urlHead="Material" libId={resourceLibId} />
        </CyFormItem>

        <CyFormItem
          align="right"
          label="数量"
          name="itemNumber"
          rules={[
            {
              pattern: /^(([1-9]\d+)|[0-9])/, //匹配正整数
              message: '输入值必须大于0',
            },
            {
              pattern: /^([\-]?[0-9]+[\d]*(.[0-9]{1,3})?)$/, //匹配小数位数
              message: '最多保留三位小数',
            },
          ]}
          required
        >
          <Input type="number" min={1} style={{ width: '395px' }} />
        </CyFormItem>
      </Scrollbars>
    </>
  )
}

export default EditCableChannelDetail
