import React, { useMemo, useState } from 'react'
import { Input, Select, TreeSelect } from 'antd'
import CyFormItem from '@/components/cy-form-item'
// import EnumRadio from '@/components/enum-radio'
// import UrlSelect from '@/components/url-select'
// import { BelongStatusEnum } from '@/services/personnel-config/manage-user'
import rules from '../rule'
import { CompanyGroupTreeData } from '@/services/operation-config/company-group'
import { getClientCategorys } from '@/services/personnel-config/company-user'
import { useRequest } from 'ahooks'
import Spin from 'antd/es/spin'
import { noAutoCompletePassword } from '@/utils/utils'

interface CompanyUserFormProps {
  treeData: CompanyGroupTreeData[]
  type?: 'add' | 'edit'
}

const CompanyUserForm: React.FC<CompanyUserFormProps> = (props) => {
  const { treeData = [], type = 'edit' } = props
  const [category, setCategory] = useState<any>([])

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children.map(mapTreeData),
    }
  }

  const { data: categoryData, loading } = useRequest(() => getClientCategorys(), {
    onSuccess: () => {
      setCategory(categoryData?.map((item) => ({ label: item.text, value: item.value })))
    },
  })

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData)
  }, [JSON.stringify(treeData)])

  return (
    <>
      <Spin spinning={loading}>
        <CyFormItem label="所属部组" name="groupIds">
          <TreeSelect
            style={{ width: '100%' }}
            multiple
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={handleData}
            placeholder="请选择部组(非必选)"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
        {type === 'add' && (
          <CyFormItem label="密码" name="pwd" required rules={rules.pwd} hasFeedback>
            <Input
              type="password"
              placeholder="请输入密码"
              {...noAutoCompletePassword}
              onPaste={(e) => e.preventDefault()}
            />
          </CyFormItem>
        )}
        {type === 'add' && (
          <CyFormItem
            label="确认密码"
            name="confirmPwd"
            required
            hasFeedback
            dependencies={['pwd']}
            rules={[
              {
                required: true,
                message: '请确认密码',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('pwd') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject('两次密码输入不一致，请确认')
                },
              }),
            ]}
          >
            <Input
              type="password"
              placeholder="请再次输入密码"
              onPaste={(e) => e.preventDefault()}
            />
          </CyFormItem>
        )}

        <CyFormItem label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="请填写邮箱" {...noAutoCompletePassword} />
        </CyFormItem>

        <CyFormItem label="姓名" name="name" rules={rules.realName} required>
          <Input placeholder="请输入姓名" />
        </CyFormItem>
        <CyFormItem label="身份证号" name="idNumber" rules={rules.idNumber} required>
          <Input placeholder="请输入身份证号" />
        </CyFormItem>

        <CyFormItem label="授权端口" name="clientCategorys">
          <Select
            mode="multiple"
            showSearch
            options={category}
            placeholder="请选择授权端口"
            loading={categoryData ? false : true}
          />
        </CyFormItem>

        {/* <CyFormItem label="状态" name="userStatus" initialValue={'1'}>
          <EnumRadio enumList={BelongStatusEnum} />
        </CyFormItem> */}
      </Spin>
    </>
  )
}

export default CompanyUserForm
