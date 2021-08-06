import React, { useMemo, useState } from 'react';
import { Input } from 'antd';
import FileUpload, { UploadStatus } from '@/components/file-upload';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import rules from './rule';
import { getCompanyUserDetail } from '@/services/personnel-config/company-user';
import { useRequest } from 'ahooks';
import { useGetSelectData } from '@/utils/hooks';
interface CompanyFileForm {
  type?: 'add' | 'edit';
  securityKey?: string;
  groupData?: any;
  editingName?: string;
  uploadFileFn: () => Promise<void>;
}

const SignFileForm: React.FC<CompanyFileForm> = (props) => {
  const { type = 'edit', groupData, editingName, uploadFileFn } = props;
  const groupName = groupData?.items?.map((item: any) => {
    return item.name;
  });

  const { data: allUsers = [] } = useGetSelectData({
    url: '/CompanyUser/GetList?clientCategory=0',
  });

  console.log(allUsers);

  const handleData = useMemo(() => {
    const copyOptions = JSON.parse(JSON.stringify(allUsers));
    copyOptions?.unshift({ value: 'none', label: '无' });
    return copyOptions?.map((item: any) => {
      return {
        title: item.label,
        value: item.value,
      };
    });
  }, [allUsers]);

  return (
    <>
      {/* {type === 'add' && ( */}
      <CyFormItem label="文件类别" name="category" required rules={rules.fileCategory}>
        <UrlSelect
          // mode="multiple"
          titlekey="text"
          valuekey="value"
          url="/CompanySign/GetCategorys"
          placeholder="请选择文件类别"
        />
      </CyFormItem>
      {/* )} */}

      <CyFormItem label="人员" name="userId" required rules={rules.signUser}>
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
  );
};

export default SignFileForm;
