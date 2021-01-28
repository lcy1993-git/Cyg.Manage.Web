import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import EnumRadio from '@/components/enum-radio';
import {
  BelongUserRoleEnum,
  BelongManageEnum,
  BelongProvinceEnum,
} from '@/services/personnel-config/manage-user';
import rules from './rule';

interface ManageUserForm {
  type?: 'add' | 'edit' | 'reset';
}

const ManageUserForm: React.FC<ManageUserForm> = (props) => {
  const { type = 'edit' } = props;
  return (
    <>
      {type === 'add' && (
        <CyFormItem label="用户名" name="userName" rules={rules.userName}>
          <Input placeholder="请输入用户名" />
        </CyFormItem>
      )}

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
      {type === 'add' && (
        <CyFormItem label="角色" name="roleId" required rules={rules.role}>
          <EnumSelect enumList={BelongUserRoleEnum} />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="公司" name="companyId">
          <Input placeholder="请选择公司" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="区域" name="province" required rules={rules.role}>
          <EnumSelect enumList={BelongProvinceEnum} />
        </CyFormItem>
      )}

      {type === 'add' && (
        <CyFormItem label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="请填写邮箱" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="昵称" name="nickName">
          <Input placeholder="请设置昵称" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="真实姓名" name="name">
          <Input placeholder="请输入真实姓名" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="状态" name="userStatus" required>
          <EnumRadio enumList={BelongManageEnum} defaultValue="1" />
        </CyFormItem>
      )}


      {type === 'edit' && (
        <CyFormItem label="邮箱" name="email" rules={rules.email}>
          <Input placeholder="请填写邮箱" />
        </CyFormItem>
      )}
      {type === 'edit' && (
        <CyFormItem label="昵称" name="nickName">
          <Input placeholder="请设置昵称" />
        </CyFormItem>
      )}
      {type === 'edit' && (
        <CyFormItem label="真实姓名" name="name">
          <Input placeholder="请输入真实姓名" />
        </CyFormItem>
      )}
      {type === 'edit' && (
        <CyFormItem label="状态" name="userStatus" required>
          <EnumRadio enumList={BelongManageEnum} />
        </CyFormItem>
      )}

      {type === 'reset' && (
        <CyFormItem label="密码" name="pwd" required>
          <Input type="password" placeholder="请输入密码" />
        </CyFormItem>
      )}
      {type === 'reset' && (
        <CyFormItem label="确认密码" name="confirmPwd" required rules={rules.confirmPwd}>
          <Input type="password" placeholder="请再次输入密码" />
        </CyFormItem>
      )}
    </>
  );
};

export default ManageUserForm;
