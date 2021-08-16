import React, { useMemo } from 'react';
import { Input, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import { GetUserTreeByGroup } from '@/services/personnel-config/company-user';

import rules from './rule';

interface CompanyGroupFormProps {
  treeData: GetUserTreeByGroup[];
  id?: string;
  type?: 'add' | 'edit';
}

const CompanyGroupForm: React.FC<CompanyGroupFormProps> = (props) => {
  const { treeData = [], id, type = '' } = props;

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    return treeData
      ?.filter((item, index) => {
        return item.id != id;
      })
      .map(mapTreeData);
  }, [JSON.stringify(treeData)]);

  return (
    <>
      <CyFormItem label="上级部组" name="parentId">
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
        <Input placeholder="请输入部组名称" />
      </CyFormItem>

      {type === 'add' && (
        <CyFormItem label="部组管理员" name="adminUserId" required rules={rules.adminUserId}>
          <UrlSelect
            showSearch
            url="/CompanyUser/GetList"
            titlekey="text"
            valuekey="value"
            placeholder="请选择部组管理员"
            extraParams={{ clientCategory: 2 }}
          />
        </CyFormItem>
      )}

      {type === 'edit' && (
        <CyFormItem label="部组管理员" name="adminUserId">
          <UrlSelect
            showSearch
            url="/CompanyUser/GetList"
            titlekey="text"
            valuekey="value"
            placeholder="请选择部组管理员"
            extraParams={{ clientCategory: 2 }}
            disabled
          />
        </CyFormItem>
      )}

      <CyFormItem label="部组成员" name="userIds">
        <UrlSelect
          mode="multiple"
          showSearch
          url="/CompanyUser/GetList"
          extraParams={{ clientCategory: 2 }}
          titlekey="text"
          valuekey="value"
          placeholder="请选择部组成员"
        />
      </CyFormItem>
    </>
  );
};

export default CompanyGroupForm;
