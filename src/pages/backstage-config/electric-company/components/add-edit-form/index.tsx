import React from 'react'
import { Input } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import rules from '../rules'

interface CompanyParams {
  province: any[]
}

const ElectricCompanyForm: React.FC<CompanyParams> = (props: any) => {
  const { province } = props
  return (
    <>
      <CyFormItem
        labelWidth={92}
        align="right"
        label="区域"
        name="province"
        required
        rules={rules.province}
      >
        <UrlSelect
          showSearch
          titlekey="label"
          defaultData={province}
          valuekey="value"
          placeholder="请选择"
        />
      </CyFormItem>

      <CyFormItem
        labelWidth={92}
        align="right"
        label="所属公司"
        name="companyName"
        rules={rules.company}
        required
      >
        <Input placeholder="请输入所属公司" />
      </CyFormItem>

      <CyFormItem
        labelWidth={92}
        align="right"
        label="所属县公司"
        name="countyCompany"
        required
        rules={rules.countyCompany}
      >
        <Input placeholder="请输入所属县公司" />
      </CyFormItem>

      <CyFormItem
        labelWidth={92}
        align="right"
        label="供电所/班组"
        name="powerSupply"
        required
        rules={rules.powerSupply}
      >
        <Input placeholder="请输入供电所/班组" />
      </CyFormItem>
    </>
  )
}

export default ElectricCompanyForm
