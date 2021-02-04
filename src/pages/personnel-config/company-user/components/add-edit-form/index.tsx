import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumRadio from '@/components/enum-radio';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import rules from '../rule';
import UrlSelect from '@/components/url-select';

interface ManageUserForm {
  type?: 'add' | 'edit';
}

const ManageUserForm: React.FC<ManageUserForm> = (props) => {
  const { type = 'edit' } = props;
  return (
    <>
      <CyFormItem label="所属部组" name="GroupIds">
        <UrlSelect
          showSearch
          url="/Area/GetList?pId=-1"
          titleKey="text"
          valueKey="value"
          placeholder="请选择所属部组"
        />
      </CyFormItem>
      {type === 'add' && (
        <CyFormItem label="密码" name="pwd" required>
          <Input type="password" placeholder="请输入密码" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="确认密码" name="confirmPwd" required rules={rules.confirmPwd}>
          <Input type="password" placeholder="请再次输入密码" />
        </CyFormItem>
      )}

      <CyFormItem label="邮箱" name="email" rules={rules.email}>
        <Input placeholder="请填写邮箱" />
      </CyFormItem>

      <CyFormItem label="昵称" name="nickName">
        <Input placeholder="请设置昵称" />
      </CyFormItem>

      <CyFormItem label="真实姓名" name="name">
        <Input placeholder="请输入真实姓名" />
      </CyFormItem>

      <CyFormItem label="状态" name="userStatus" required>
        <EnumRadio enumList={BelongManageEnum} defaultValue="1" />
      </CyFormItem>
    </>
  );
};

export default ManageUserForm;
