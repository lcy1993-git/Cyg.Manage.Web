import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

const { TextArea } = Input;

const ResourceLibForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="资源库名称" name="libName" required>
        <Input placeholder="请输入资源库名称"></Input>
      </CyFormItem>
      <CyFormItem label="版本" name="version">
        <Input placeholder="请输入版本号" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
      </CyFormItem>
    </>
  );
};

export default ResourceLibForm;
