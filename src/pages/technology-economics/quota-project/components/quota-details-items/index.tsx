import React from 'react';
import { Input, InputNumber, TreeSelect } from 'antd';
import CyFormItem from '@/components/cy-form-item';

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

const DictionaryForm: React.FC<DictionaryFormItem> = () => {
  
  return (
    <>
      <CyFormItem label="所属类别" name="">
        <TreeSelect
                showSearch
                style={{ width: '100%' }}
                treeDefaultExpandAll
                treeData={treeData}
                defaultValue={"0-0-2"}
                switcherIcon={()=><span>123</span>}
        /> 
      </CyFormItem>

      <CyFormItem label="名称" name="quotaId" required>
        <Input placeholder="请输入定额编号" />
      </CyFormItem>

      <CyFormItem label="编号" name="name" required>
        <Input placeholder="请输入定额名称" />
      </CyFormItem>

      <CyFormItem label="单位" name="unit" required>
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="单重" name="price">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>

      <CyFormItem label="系数" name="calculation">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>

      <CyFormItem label="数量" name="laborCost">
        <InputNumber style={{width: '100%'}}/>
      </CyFormItem>
    </>
  );
};

export default DictionaryForm;