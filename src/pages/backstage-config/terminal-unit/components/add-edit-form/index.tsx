import React from 'react';
import { Input, DatePicker } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import rule from '../rule';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const MapFieldForm: React.FC = () => {
  return (
    <>
      <CyFormItem label="设备号" name="serialNumber" required rules={rule.serialNumber}>
        <Input placeholder="请输入设备号" />
      </CyFormItem>

      <CyFormItem
        label="差分账号"
        name="differentialAccount"
        required
        rules={rule.differentialAccount}
      >
        <Input placeholder="请输入账号" />
      </CyFormItem>

      <CyFormItem label="差分密码" name="differentialPwd" required rules={rule.differentialPwd}>
        <Input type="password" placeholder="请输入密码" />
      </CyFormItem>

      <CyFormItem label="到期时间" name="expiryTime" required rules={rule.expiryTime}>
        <DatePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder="到期时间"
        />
      </CyFormItem>

      <CyFormItem label="序号" name="orderNumber">
        <Input placeholder="请输入序号" />
      </CyFormItem>

      <CyFormItem label="省区" name="provice">
        <Input placeholder="请输入省/区" />
      </CyFormItem>

      <CyFormItem label="单位公司" name="company">
        <Input placeholder="请输入单位公司" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注" />
      </CyFormItem>
    </>
  );
};

export default MapFieldForm;
