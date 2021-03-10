import React from 'react';
import { Input } from 'antd';
import FileUploadOnline from '@/components/file-upload-online';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import rules from './rule';
interface CompanyFileForm {
  type?: 'add' | 'edit';
  securityKey?: string;
}

const CompanyFileForm: React.FC<CompanyFileForm> = (props) => {
  const { type = 'edit', securityKey } = props;
  




  return (
    <>
      <CyFormItem label="名称" name="name" required rules={rules.name}>
        <Input placeholder="请输入名称" />
      </CyFormItem>
      {type === 'add' && (
        <CyFormItem label="文件类别" name="fileCategory" required rules={rules.fileCategory}>
          <UrlSelect
            titleKey="text"
            valueKey="value"
            url="/CompanyFile/GetCategorys"
            placeholder="应用"
          />
        </CyFormItem>
      )}

      <CyFormItem label="上传文件" name="file" required rules={rules.fileld}>
        <FileUploadOnline maxCount={1} />
      </CyFormItem>

      <CyFormItem label="备注" name="describe">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default CompanyFileForm;
