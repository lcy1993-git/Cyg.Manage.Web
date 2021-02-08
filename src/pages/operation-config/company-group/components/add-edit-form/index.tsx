import React, { useMemo } from 'react';
import { Input, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import { BelongModuleEnum, CompanyGroupTreeData } from '@/services/operation-config/company-group';

import rules from './rule';

interface CompanyGroupFormProps {
  treeData: CompanyGroupTreeData[];
  usersData: object[];
}

const CompanyGroupForm: React.FC<CompanyGroupFormProps> = (props) => {
  const { treeData = [], usersData = [] } = props;
  // console.log(treeData);

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

  // console.log();
  
  return (
    <>
      <CyFormItem label="所属部组" name="parentId">
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          treeData={handleData}
          placeholder="请选择部组(非必选)"
          treeDefaultExpandAll
          allowClear
        />
      </CyFormItem>
      <CyFormItem label="部组名称" name="name" required rules={rules.name}>
        <Input placeholder="请输入" />
      </CyFormItem>

      <CyFormItem label="部组管理员" name="adminUserId" required rules={rules.adminUserId}>
        <EnumSelect placeholder="请选择" enumList={BelongModuleEnum} />
      </CyFormItem>
      <CyFormItem label="部组成员" name="userIds">
        <Input placeholder="请输入" />
      </CyFormItem>
    </>
  );
};

export default CompanyGroupForm;
