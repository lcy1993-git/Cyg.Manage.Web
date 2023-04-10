import React from 'react'
import { Input, DatePicker } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import { TreeDataItem } from '@/services/jurisdiction-config/company-manage'
import ClickInputNumber from '@/components/clickInput-number'
import styles from './index.less'
import rules from '../../rule'

interface CompanyManageForm {}

interface CompanyManageFormProps {
  treeData: TreeDataItem[]
  form: any
}

const CompanyManageForm: React.FC<CompanyManageFormProps> = (props) => {
  const { form } = props
  // const mapTreeData = (data: any) => {
  //   return {
  //     title: data.text,
  //     value: data.id,
  //     children: data.children?.map(mapTreeData),
  //   }
  // }

  const reset = () => {
    form.resetFields(['authorityExpireDate'])
  }

  return (
    <>
      <CyFormItem
        labelWidth={100}
        align="right"
        label="公司名称"
        name="name"
        required
        rules={rules.name}
      >
        <Input placeholder="请输入公司名" />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="勘察端"
        name="prospect"
        initialValue={5}
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        initialValue={5}
        label="设计端"
        name="design"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="技经端"
        initialValue={5}
        name="skillBy"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="评审端"
        initialValue={5}
        name="review"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} limit={5} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="管理端"
        initialValue={5}
        name="manage"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} limit={5} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="详细地址"
        name="address"
        required
        rules={rules.address}
      >
        <Input placeholder="请输入地址" />
      </CyFormItem>

      <CyFormItem labelWidth={100} align="right" label="授权期限" name="authorityExpireDate">
        <DatePicker
          allowClear={false}
          dropdownClassName={styles.expireDate}
          renderExtraFooter={() => [
            <div key="clearDate" style={{ color: '#0f7b3c', textAlign: 'center' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => reset()}>
                清除日期
              </span>
            </div>,
          ]}
        />
      </CyFormItem>

      <CyFormItem labelWidth={100} align="right" label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
      {/* <CyFormItem label="状态" name="isEnabled" labelWidth={100} initialValue={true} align="right">
        <FormSwitch />
      </CyFormItem> */}
    </>
  )
}

export default CompanyManageForm
