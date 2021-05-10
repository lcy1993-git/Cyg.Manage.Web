import React from 'react';
import { Input, InputNumber, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';

import FormSwitch from '@/components/form-switch';

interface DictionaryFormItem {
  parentName?: string;
}

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
  },
];

const DictionaryForm: React.FC<DictionaryFormItem> = (props) => {
  const { parentName } = props;

  return (
    <>
      <CyFormItem label="所属目录" name="">
        <TreeSelect
                showSearch
                style={{ width: '100%' }}
                treeDefaultExpandAll
                treeData={treeData}
                defaultValue={"0-0-2"}
                switcherIcon={()=><span>123</span>}
        /> 
      </CyFormItem>

      <CyFormItem label="定额编号" name="quotaId" required>
        <Input placeholder="请输入定额编号" />
      </CyFormItem>

      <CyFormItem label="定额名称" name="name" required>
        <Input placeholder="请输入定额名称" />
      </CyFormItem>

      <CyFormItem label="单位" name="unit" required>
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="单价" name="price">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>

      <CyFormItem label="计算式" name="calculation">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>

      <CyFormItem label="人工费" name="laborCost">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>

      <CyFormItem label="材料费" name="materialFee">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>

      <CyFormItem label="机械费" name="machineryFee">
        <InputNumber style={{width: '100%'}} />
      </CyFormItem>

      <CyFormItem label="工作内容" name="content">
        <Input.TextArea />
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;