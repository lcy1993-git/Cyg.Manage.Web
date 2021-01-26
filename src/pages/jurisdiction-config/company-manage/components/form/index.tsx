import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import rules from './rule';

const CompanyManageForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="公司名称" name="name" required rules={rules.name}>
        <Input placeholder="请输入公司名" />
      </CyFormItem>
      <CyFormItem label="公司用户库存" name="addUserStock" required>
        <Input placeholder="请输入库存" />
      </CyFormItem>
      <CyFormItem label="详细地址" name="address" required rules={rules.address}>
        <Input placeholder="请输入地址" />
      </CyFormItem>
      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default CompanyManageForm;
