import React, { useMemo } from 'react';
import { Input, InputNumber, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import { TreeDataItem } from '@/services/jurisdiction-config/company-manage';
import ClickInputNumber from '@/components/clickInput-number';
import FormSwitch from '@/components/form-switch';

import rules from '../../rule';

interface CompanyManageForm {}

interface CompanyManageFormProps {
  treeData: TreeDataItem[];
}

const CompanyManageForm: React.FC<CompanyManageFormProps> = (props) => {
  const { treeData = [] } = props;
  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children?.map(mapTreeData),
    };
  };

  const handleData = useMemo(() => {
    return treeData.map(mapTreeData);
  }, [JSON.stringify(treeData)]);

  return (
    <>
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

      <CyFormItem
        labelWidth={100}
        align="right"
        label="勘察端"
        name="prospect"
        initialValue={5}
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        initialValue={5}
        label="设计端"
        name="design"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="技经端"
        initialValue={5}
        name="skillBy"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="评审端"
        initialValue={5}
        name="review"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} limit={5} />
      </CyFormItem>

      <CyFormItem
        labelWidth={100}
        align="right"
        label="管理端"
        initialValue={5}
        name="manage"
        required
      >
        <ClickInputNumber minNumber={0} maxNumber={50} limit={5} />
      </CyFormItem>

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
      <CyFormItem label="状态" name="isEnabled" labelWidth={100} initialValue={true} align="right">
        <FormSwitch />
      </CyFormItem>
    </>
  );
};

export default CompanyManageForm;
