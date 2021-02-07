import React from 'react';
import { Input } from 'antd';
import FileUpload from '@/components/file-upload';
import CyFormItem from '@/components/cy-form-item';

const CompanyFileForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="名称" name="name" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="文件类别" name="fileCategory">
        <Input placeholder="请选择文件类别" />
      </CyFormItem>

      <CyFormItem label="上传文件" name="fileld">
        <FileUpload maxCount={1} />
      </CyFormItem>

      <CyFormItem label="备注" name="describe">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default CompanyFileForm;
