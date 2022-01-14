import React from 'react'
import { Input, Spin } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'

const { TextArea } = Input
interface WareHouseParams {
  provinceData?: any
}

const WareHouseForm: React.FC<WareHouseParams> = (props) => {
  const { provinceData } = props

  return (
    <>
      <CyFormItem
        label="区域"
        name="province"
        required
        rules={[{ required: true, message: '区域不能为空' }]}
      >
        <UrlSelect
          showSearch
          titlekey="label"
          valuekey="value"
          defaultData={provinceData}
          placeholder="请选择省份"
        />
      </CyFormItem>
      <CyFormItem
        label="利库名称"
        name="name"
        required
        rules={[{ required: true, message: '利库名称不能为空' }]}
      >
        <Input placeholder="请输入利库名称" />
      </CyFormItem>

      <CyFormItem label="版本" name="version">
        <Input placeholder="请输入版本号" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
      </CyFormItem>
    </>
  )
}

export default WareHouseForm
