import React from 'react'
import { Input } from 'antd'
import FormSwitch from '@/components/form-switch'
import CyFormItem from '@/components/cy-form-item'
import DateFormItem from '@/components/date-from-item'
import FileUpload from '@/components/file-upload'
// import CompanyFileForm from '@/pages/operation-config/company-file/components/add-edit-form';
interface IForm {
  type?: 'add' | 'edit'
  selectList?: number[]
  addUploadFile: any
}
const AdjustmentFileForm: React.FC<IForm> = ({ addUploadFile }) => {
  return (
    <>
      <CyFormItem label="文件名称" name="name" required>
        <Input placeholder="请输入文件名称" />
      </CyFormItem>
      <CyFormItem label="发布时间" name="publishDate">
        <DateFormItem />
      </CyFormItem>
      <CyFormItem label="发布单位" name="publishedBy" required>
        <Input placeholder="请输入编号发布单位" />
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input.TextArea rows={3} />
      </CyFormItem>
      <CyFormItem label="上传文件" name="files" required>
        {/* <FileUpload accept=".pdf" maxCount={1} trigger={false} /> */}
        <FileUpload uploadFileBtn uploadFileFn={addUploadFile} maxCount={1} accept=".pdf" />
      </CyFormItem>
      <CyFormItem label="状态" name="enabled">
        <FormSwitch />
      </CyFormItem>
    </>
  )
}

export default AdjustmentFileForm
