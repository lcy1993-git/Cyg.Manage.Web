import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import EnumRadio from '@/components/enum-radio';
import { BelongUserRoleEnum, BelongManageEnum } from '@/services/personnel-config/manage-user';
import rules from '../rule';
import UrlSelect from '@/components/url-select';

interface ManageUserForm {
  type?: 'add' | 'edit';
}

const ManageUserForm: React.FC<ManageUserForm> = (props) => {
  const { type = 'edit' } = props;

  return (
    <>
      {type === 'add' && (
        <CyFormItem label="用户名" name="userName" required rules={rules.userName}>
          <Input placeholder="请输入用户名" />
        </CyFormItem>
      )}

      {type === 'add' && (
        <CyFormItem label="密码" name="pwd" required hasFeedback rules={rules.pwd}>
          <Input type="password" placeholder="请输入密码" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem
          label="确认密码"
          name="confirmPwd"
          required
          hasFeedback
          dependencies={['pwd']}
          rules={[
            {
              required: true,
              message: '请确认密码',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('pwd') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('两次密码输入不一致，请确认');
              },
            }),
          ]}
        >
          <Input type="password" placeholder="请再次输入密码" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="角色" name="roleId" required rules={rules.role}>
          <EnumSelect enumList={BelongUserRoleEnum} placeholder="请选择角色" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="公司" name="companyId">
          <Input placeholder="请选择公司" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem label="区域" name="province" required rules={rules.role}>
          <UrlSelect
            showSearch
            url="/Area/GetList?pId=-1"
            titleKey="text"
            valueKey="value"
            placeholder="请选择省份"
          />
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

      <CyFormItem label="状态" name="userStatus" initialValue={"1"} required>
        <EnumRadio enumList={BelongManageEnum} />
      </CyFormItem>
    </>
  );
};

export default ManageUserForm;
