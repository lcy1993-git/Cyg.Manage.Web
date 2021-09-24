import React, { useMemo, useState } from 'react';
import { Input, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumRadio from '@/components/enum-radio';
import rules from '../rule';
import UrlSelect from '@/components/url-select';
import { getTreeSelectData } from '@/services/jurisdiction-config/company-manage';
import { useRequest } from 'ahooks';
import EnumSelect from '@/components/enum-select';

interface ManageUserForm {
  type?: 'add' | 'edit';
}

export enum rootTypes {
  '公司管理员' = 3,
  '平台管理员' = 4,
}

export enum platformTypes {
  '公司管理员' = 3,
}

const ManageUserForm: React.FC<ManageUserForm> = (props) => {
  const { type = 'edit' } = props;
  const { isSuperAdmin = '' } = JSON.parse(localStorage.getItem('userInfo') ?? '{}');

  const [selectedUserType, setSelectedUserType] = useState<number>(0);

  // const mapTreeData = (data: any) => {
  //   return {
  //     title: data.text,
  //     value: data.id,
  //     children: data.children ? data.children.map(mapTreeData) : [],
  //   };
  // };

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
        <CyFormItem label="账号类型" name="userType" required rules={rules.userType}>
          <EnumSelect
            enumList={isSuperAdmin ? rootTypes : platformTypes}
            placeholder="请选择账号类型"
            onChange={(value: any) => setSelectedUserType(value)}
          />
        </CyFormItem>
      )}
      {type === 'add' && Number(selectedUserType) === 3 && (
        <CyFormItem label="公司" name="companyId" required rules={rules.company}>
          <UrlSelect
            requestType="post"
            showSearch
            url="/Company/GetList"
            titlekey="text"
            valuekey="value"
            placeholder="请选择公司"
          />
        </CyFormItem>
      )}
      {/* {type === 'add' && (
        <CyFormItem label="区域" name="province" required rules={rules.role}>
          <UrlSelect
            showSearch
            url="/Area/GetList?pId=-1"
            titlekey="text"
            valuekey="value"
            placeholder="请选择省份"
          />
        </CyFormItem>
      )} */}
      {type === 'edit' && (
        <>
          <CyFormItem label="手机" name="phone" rules={rules.phone}>
            <Input placeholder="请填写手机号码" />
          </CyFormItem>
          <CyFormItem label="邮箱" name="email" rules={rules.email}>
            <Input placeholder="请填写邮箱信息" />
          </CyFormItem>
        </>
      )}

      <CyFormItem label="姓名" name="name">
        <Input placeholder="请输入姓名" />
      </CyFormItem>

      {/* <CyFormItem label="状态" name="userStatus" initialValue={'1'} required>
        <EnumRadio enumList={BelongStatusEnum} />
      </CyFormItem> */}
    </>
  );
};

export default ManageUserForm;
