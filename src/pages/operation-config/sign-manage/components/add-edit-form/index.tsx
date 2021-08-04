import React, { useState } from 'react';
import { Input } from 'antd';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import rules from './rule';
interface CompanyFileForm {
  type?: 'add' | 'edit';
  securityKey?: string;
  groupData?: any;
  editingName?: string;
  fileCategory?: number | undefined;
  uploadFileFn: () => Promise<void>;
}

const SignFileForm: React.FC<CompanyFileForm> = (props) => {
  const { type = 'edit', groupData, editingName, uploadFileFn, fileCategory } = props;
  const [categoryValue, setCategoryValue] = useState<number>();
  const groupName = groupData.items?.map((item: any) => {
    return item.name;
  });

  return (
    <>
      {/* {type === 'add' && ( */}
        <CyFormItem label="文件类别" name="fileCategory" required rules={rules.fileCategory}>
          <UrlSelect
            onChange={(value: any) => setCategoryValue(value)}
            titlekey="text"
            valuekey="value"
            url="/CompanyFile/GetCategorys"
            placeholder="请选择文件类别"
          />
        </CyFormItem>
      {/* )} */}

      <CyFormItem label="人员" name="fileCategory" required rules={rules.signUser}>
        <UrlSelect
          onChange={(value: any) => setCategoryValue(value)}
          titlekey="text"
          valuekey="value"
          url="/CompanyFile/GetCategorys"
          placeholder="请选择签批人员"
        />
      </CyFormItem>

      <CyFormItem
        label="名称"
        name="name"
        required
        hasFeedback
        rules={[
          { max: 12, message: '名称超出字符数限制，限制为12个字符' },
          { required: true, message: '文件名不能为空' },
          () => ({
            validator(_, value) {
              if (groupName.includes(value) && editingName != value) {
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
        <CyFormItem label="上传文件" name="file" required rules={rules.fileld}>
          <FileUpload
            uploadFileBtn
            uploadFileFn={uploadFileFn}
            maxCount={1}
            accept={
              categoryValue === 5 ||
              categoryValue === 6 ||
              categoryValue === 8 ||
              categoryValue === 9
                ? '.docx,.doc'
                : '.dwg'
            }
          />
        </CyFormItem>
      )}

      {type === 'edit' && (
        <CyFormItem label="上传文件" name="file">
          <FileUpload
            uploadFileBtn
            uploadFileFn={uploadFileFn}
            maxCount={1}
            accept={
              fileCategory === 5 || fileCategory === 6 || fileCategory === 8 || fileCategory === 9
                ? '.docx,.doc'
                : '.dwg'
            }
          />
        </CyFormItem>
      )}

      <CyFormItem label="备注" name="describe">
        <Input.TextArea showCount maxLength={100} placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default SignFileForm;
