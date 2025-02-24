import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import UrlSelect from '@/components/url-select'
import { useGetSelectData } from '@/utils/hooks'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Input, Tooltip } from 'antd'
import React, { useMemo } from 'react'
import rules from './rule'
interface CompanyFileForm {
  type?: 'add' | 'edit'
  securityKey?: string
  groupData?: any
  editingName?: string
  uploadFileFn: () => Promise<void>
}

const SignFileForm: React.FC<CompanyFileForm> = (props) => {
  const { type = 'edit', groupData, editingName, uploadFileFn } = props
  const groupName = groupData?.items?.map((item: any) => {
    return item.name
  })

  const { data: allUsers = [] } = useGetSelectData({
    url: '/CompanyUser/GetList',
    extraParams: { clientCategory: 0 },
  })

  const handleData = useMemo(() => {
    const copyOptions = JSON.parse(JSON.stringify(allUsers))
    copyOptions?.unshift({ value: 'none', label: '无' })
    return copyOptions?.map((item: any) => {
      return {
        title: item.label,
        value: item.value,
      }
    })
  }, [allUsers])

  const personSlot = () => {
    return (
      <>
        <span>人员</span>
        <Tooltip
          title="请保持签批和人员对应，如果该签批找不到对应人员，可选择“无”"
          placement="left"
        >
          <QuestionCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
        </Tooltip>
      </>
    )
  }

  return (
    <>
      {type === 'add' && (
        <CyFormItem label="文件类别" name="categorys" required rules={rules.fileCategory}>
          <UrlSelect
            mode="multiple"
            titlekey="text"
            valuekey="value"
            url="/CompanySign/GetCategorys"
            placeholder="请选择文件类别"
          />
        </CyFormItem>
      )}
      {type === 'edit' && (
        <CyFormItem label="文件类别" name="category" required rules={rules.fileCategory}>
          <UrlSelect
            disabled
            mode="multiple"
            titlekey="text"
            valuekey="value"
            url="/CompanySign/GetCategorys"
            placeholder="请选择文件类别"
          />
        </CyFormItem>
      )}

      <CyFormItem labelSlot={personSlot} name="userId" required rules={rules.signUser}>
        <UrlSelect
          titlekey="title"
          valuekey="value"
          placeholder="请选择签批人员"
          defaultData={handleData}
        />
      </CyFormItem>

      <CyFormItem
        label="名称"
        name="name"
        required
        hasFeedback
        rules={[
          { max: 12, message: '名称超出字符数限制，限制为12个字符' },
          {
            pattern: /^[^\\\\.^/:*?？！!@￥"<>《》#|;，。,；：'‘’“”、=\\^\s]+$/,
            message: '文件名不能包含/:*?"<>|空格等特殊字符',
          },
          { required: true, message: '文件名不能为空' },
          () => ({
            validator(_, value) {
              if (groupName.includes(value) && editingName !== value) {
                return Promise.reject('文件名已存在')
              }
              return Promise.resolve()
            },
          }),
        ]}
      >
        <Input placeholder="请输入名称" />
      </CyFormItem>

      {type === 'add' && (
        <CyFormItem label="上传文件" name="file" required rules={rules.fileld}>
          <FileUpload uploadFileBtn uploadFileFn={uploadFileFn} maxCount={1} accept=".dwg" />
        </CyFormItem>
      )}

      {type === 'edit' && (
        <CyFormItem label="上传文件" name="file">
          <FileUpload uploadFileBtn uploadFileFn={uploadFileFn} maxCount={1} accept=".dwg" />
        </CyFormItem>
      )}

      <CyFormItem label="备注" name="describe">
        <Input.TextArea showCount maxLength={100} placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  )
}

export default SignFileForm
