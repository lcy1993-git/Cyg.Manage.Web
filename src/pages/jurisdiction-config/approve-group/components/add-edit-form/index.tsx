import React, { useEffect, useMemo } from 'react'
import { Input, TreeSelect } from 'antd'
import CyFormItem from '@/components/cy-form-item'
import UrlSelect from '@/components/url-select'
import { getGroupUser } from '@/services/jurisdiction-config/approve-group'

import rules from './rule'
import { useRequest } from 'ahooks'
import uuid from 'node-uuid'
import { flatten } from '@/utils/utils'

interface CompanyGroupFormProps {
  id?: string
  groupId?: string
  getPersonArray?: (array: any) => void
  personDefaultValue?: any
  editForm?: any
}

const ApproveGroupForm: React.FC<CompanyGroupFormProps> = (props) => {
  const { groupId, getPersonArray, personDefaultValue, editForm } = props
  // const { data: approveUser = [] } = useRequest(() =>
  //   getGroupUser({ category: 1, groupId: groupId })
  // )
  // const { data: usersData = [] } = useRequest(() => getGroupUser({ category: 2, groupId: groupId }))

  const mapTreeData = (data: any) => {
    const keyValue = uuid.v1()
    return {
      title: data.text,
      value: keyValue,
      key: keyValue,
      chooseValue: data.id,
      children: data.children ? data.children.map(mapTreeData) : [],
    }
  }

  // const getUserIds = (groupArray: any) => {
  //   let allIds: any[] = []
  //   ;(function deep(groupArray) {
  //     groupArray?.forEach((item: any) => {
  //       if (item.children && item.children.length > 0) {
  //         deep(item.children)
  //       } else {
  //         allIds.push(item.id)
  //       }
  //     })
  //   })(groupArray)
  //   return allIds
  // }

  // const allUserIds = getUserIds(usersData)

  // const handleData = useMemo(() => {
  //   const copyOptions = JSON.parse(JSON.stringify(usersData))?.map(mapTreeData)
  //   copyOptions?.unshift({ title: '所有人', value: allUserIds, children: usersData })
  //   return copyOptions
  //     ?.map((item: any) => {
  //       return {
  //         title: item.title,
  //         value: item.value,
  //         children: item.children ? item.children?.map(mapTreeData) : [],
  //       }
  //     })
  //     .slice(0, 1)
  // }, [JSON.stringify(usersData)])

  // useEffect(() => {
  //   if (personDefaultValue) {
  //     const flattenArray = flatten(handleData)

  //     const handlePersonUserIds = flattenArray
  //       .filter((item: any) => personDefaultValue.includes(item.chooseValue))
  //       .map((item: any) => item.value)

  //     editForm.setFieldsValue({
  //       userIds: handlePersonUserIds,
  //     })
  //   }
  // }, [JSON.stringify(personDefaultValue), JSON.stringify(handleData)])

  // useEffect(() => {
  //   getPersonArray?.(flatten(handleData))
  // }, [JSON.stringify(handleData)])

  return (
    <>
      <CyFormItem label="名称" name="name" required rules={rules.name}>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="审批责任人" name="userId" required rules={rules.userId}>
        <UrlSelect
          showSearch
          url="/CompanyUser/GetList"
          titlekey="text"
          valuekey="value"
          placeholder="请选择审批责任人"
          extraParams={{ clientCategory: 0 }}
        />
      </CyFormItem>

      <CyFormItem label="成员" name="userIds">
        <UrlSelect
          showSearch
          url="/ProjectApproveGroup/GetUserList"
          titlekey="text"
          valuekey="value"
          placeholder="请选择成员"
          requestType="post"
          mode="multiple"
          extraParams={{ category: 2, groupId: groupId }}
        />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input.TextArea showCount maxLength={200} />
      </CyFormItem>
    </>
  )
}

export default ApproveGroupForm
