import React, { useMemo } from 'react';
import { Input, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumRadio from '@/components/enum-radio';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import rules from '../rule';
import { CompanyGroupTreeData } from '@/services/operation-config/company-group';

interface CompanyUserFormProps {
  treeData: CompanyGroupTreeData[];
  type?: 'add' | 'edit';
}

const CompanyUserForm: React.FC<CompanyUserFormProps> = (props) => {
  const { treeData = [], type = 'edit' } = props;

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData);
  }, [JSON.stringify(treeData)]);

  return (
    <>
      <CyFormItem label="所属部组" name="groupIds">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择部组(非必选)"
          treeDefaultExpandAll
          allowClear
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
        <EnumRadio enumList={BelongManageEnum} />
      </CyFormItem>
    </>
  );
};

export default CompanyUserForm;
