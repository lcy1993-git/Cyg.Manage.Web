import React from 'react'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'

interface AddAdminFormProps {
  companyId: string
}

const AddAdminForm: React.FC<AddAdminFormProps> = (props) => {
  const { companyId } = props
  return (
    <>
      <CyFormItem labelWidth={100} align="right" label="公司管理员" name="userId">
        <UrlSelect
          allowClear
          showSearch
          requestSource="project"
          requestType="post"
          url="/CompanyUser/GetByCompany"
          titlekey="userName"
          valuekey="id"
          placeholder="请选择"
          extraParams={{
            companyId: companyId,
          }}
          // onChange={(value: any) => setCategory(value)}
        />
      </CyFormItem>
    </>
  )
}

export default AddAdminForm
