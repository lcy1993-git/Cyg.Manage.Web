import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import rule from '../../resource-rule';

const { TextArea } = Input;

const ResourceLibForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="资源库名称" name="libName" required rules={rule.name}>
        <Input placeholder="请输入资源库名称"></Input>
      </CyFormItem>
      <CyFormItem label="版本" name="version" rules={rule.version}>
        <Input placeholder="请输入版本号" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
      </CyFormItem>
    </>
  );
};

export default ResourceLibForm;
