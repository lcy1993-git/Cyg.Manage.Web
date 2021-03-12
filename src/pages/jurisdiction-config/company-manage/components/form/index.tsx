import React, { useMemo } from 'react';
import { Input, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import { TreeDataItem } from '@/services/jurisdiction-config/company-manage';

import rules from './rule';

interface CompanyManageForm {}

interface CompanyManageFormProps {
  treeData: TreeDataItem[];
  type?: 'add' | 'edit';
}

const CompanyManageForm: React.FC<CompanyManageFormProps> = (props) => {
  const { type = 'edit', treeData = [] } = props;
  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    return treeData.map(mapTreeData);
  }, [JSON.stringify(treeData)]);

  return (
    <>
      {type === 'add' && (
        <CyFormItem labelWidth={100} align="right" label="所属公司" name="parentId">
          <TreeSelect
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={handleData}
            placeholder="请选择"
            treeDefaultExpandAll
            allowClear
          />
        </CyFormItem>
      )}
      <CyFormItem
        labelWidth={100}
        align="right"
        label="公司名称"
        name="name"
        required
        rules={rules.name}
      >
        <Input placeholder="请输入公司名" />
      </CyFormItem>

      {type === 'edit' && (
        <CyFormItem
          labelWidth={100}
          align="right"
          label="新增用户库存"
          name="addUserStock"
          required
        >
          <Input placeholder="请输入库存" />
        </CyFormItem>
      )}
      {type === 'add' && (
        <CyFormItem labelWidth={100} align="right" label="公司用户库存" name="userStock" required>
          <Input placeholder="请输入库存" />
        </CyFormItem>
      )}

      <CyFormItem
        labelWidth={100}
        align="right"
        label="详细地址"
        name="address"
        required
        rules={rules.address}
      >
        <Input placeholder="请输入地址" />
      </CyFormItem>
      <CyFormItem labelWidth={100} align="right" label="备注" name="remark">
        <Input placeholder="请输入备注信息" />
      </CyFormItem>
    </>
  );
};

export default CompanyManageForm;
