import React from 'react';
import { Input, InputNumber } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import rules from '../rule';
import UrlSelect from '@/components/url-select';

const BatchAddCompanyUser: React.FC = () => {
  return (
    <>
      <CyFormItem label="生成数量" name="qty" rules={rules.qtyNumber}>
        <InputNumber min={1} max={99} defaultValue={0} />
      </CyFormItem>

      <CyFormItem label="所属部组" name="GroupIds">
        <UrlSelect
          showSearch
          url="/Area/GetList?pId=-1"
          titleKey="text"
          valueKey="value"
          placeholder="请选择所属部组"
        />
      </CyFormItem>

      <CyFormItem label="密码" name="pwd" required rules={rules.pwd}>
        <Input type="password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem label="确认密码" name="confirmPwd" required rules={rules.confirmPwd}>
        <Input type="password" placeholder="请再次输入密码" />
      </CyFormItem>
    </>
  );
};

export default BatchAddCompanyUser;
