import React from 'react';
import { Input } from 'antd';
import FileUpload from '@/components/file-upload';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import rules from './rule';
interface CompanyFileForm {
  type?: 'add' | 'edit';
  securityKey?: string;
  groupData?: any;
}

const CompanyFileForm: React.FC<CompanyFileForm> = (props) => {
  const { type = 'edit', groupData } = props;
  console.log(groupData.items);

  const groupName = groupData.items?.map((item: any) => {
    return item.name;
  });

  return (
    <>
      <CyFormItem
        label="名称"
        name="name"
        required
        hasFeedback
        rules={[
          { required: true, message: '文件名不能为空' },
          () => ({
            validator(_, value) {
              if (groupName.includes(value)) {
                return Promise.reject('文件名已存在');
              }
              return Promise.resolve();
            },
          }),
        ]}
      >
        <Input placeholder="请输入名称" />
      </CyFormItem>
      {type === 'add' && (
        <CyFormItem label="文件类别" name="fileCategory" required rules={rules.fileCategory}>
          <UrlSelect
            titleKey="text"
            valueKey="value"
            url="/CompanyFile/GetCategorys"
            placeholder="请选择文件类别"
          />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="上传文件" name="file" required rules={rules.fileld}>
          <FileUpload maxCount={1} />
        </CyFormItem>
      )}

      {type === 'edit' && (
        <CyFormItem label="上传文件" name="file">
          <FileUpload maxCount={1} />
        </CyFormItem>
      )}

      <CyFormItem label="备注" name="describe">
        <Input.TextArea showCount maxLength={100} placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default CompanyFileForm;
