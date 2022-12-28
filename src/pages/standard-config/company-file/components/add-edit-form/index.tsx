import CyFormItem from '@/components/cy-form-item'
import FileUpload from '@/components/file-upload'
import UrlSelect from '@/components/url-select'
import { Input } from 'antd'
import React, { useMemo, useState } from 'react'
interface CompanyFileForm {
  type?: 'add' | 'edit'
  securityKey?: string
  groupData?: any
  editingName?: string
  fileCategory?: number | undefined
  uploadFileFn: () => Promise<void>
  isBasisExist?: boolean
}

const CompanyFileForm: React.FC<CompanyFileForm> = (props) => {
  const { type = 'edit', groupData, editingName, uploadFileFn, fileCategory, isBasisExist } = props

  const [categoryValue, setCategoryValue] = useState<number>()

  const groupName = groupData.items?.map((item: any) => {
    return item.name
  })

  const acceptValue = useMemo(() => {
    if (categoryValue === 9 || fileCategory === 9) {
      return '.docx,.xlsx'
    }
    if ([5, 6, 8].includes(categoryValue!) || [5, 6, 8].includes(fileCategory!)) {
      return '.docx,.doc'
    }
    if ([10, 11].includes(categoryValue!) || [10, 11].includes(fileCategory!)) {
      return '.xls,.xlsx'
    }
    return '.dwg'
  }, [categoryValue])

  return (
    <>
      <CyFormItem
        label="名称"
        name="name"
        required
        hasFeedback
        rules={[
          { max: 12, message: '名称超出字符数限制，限制为12个字符' },
          {
            pattern: /^[^\\\.^/:*?？！!@￥"<>《》#|;，。,；：'‘’“”、=\^\s]+$/,
            message: '文件名不能包含/:*?"<>|空格等特殊字符',
          },
          { required: true, message: '文件名不能为空' },
          () => ({
            validator(_, value) {
              if (groupName.includes(value) && editingName != value) {
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
        <CyFormItem
          label="文件类别"
          name="fileCategory"
          required
          rules={[
            { required: true, message: '请选择文件类别' },
            () => ({
              validator(_, value) {
                if (isBasisExist && value === 5) {
                  return Promise.reject('每个文件组内仅能上传一份立项依据')
                }
                return Promise.resolve()
              },
            }),
          ]}
        >
          <UrlSelect
            onChange={(value: any) => setCategoryValue(value)}
            titlekey="text"
            valuekey="value"
            url="/CompanyFile/GetCategorys"
            placeholder="请选择文件类别"
          />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem
          label="上传文件"
          name="file"
          required
          rules={[{ required: true, message: '还未上传文件' }]}
        >
          <FileUpload uploadFileBtn uploadFileFn={uploadFileFn} maxCount={1} accept={acceptValue} />
        </CyFormItem>
      )}

      {type === 'edit' && (
        <CyFormItem label="上传文件" name="file">
          <FileUpload uploadFileBtn uploadFileFn={uploadFileFn} maxCount={1} accept={acceptValue} />
        </CyFormItem>
      )}

      <CyFormItem label="备注" name="describe">
        <Input.TextArea showCount maxLength={100} placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  )
}

export default CompanyFileForm
