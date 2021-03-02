import React, { useState } from 'react';
import { TreeSelect, Divider } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import EnumSelect from '@/components/enum-select';
import { Arrangement, getGroupInfo } from '@/services/project-management/all-project';
import { useMount, useRequest } from 'ahooks';
import Search from 'antd/lib/input/Search';

interface GetGroupUserProps {
  onChange?: (checkedValue: string) => void 
}

interface ArrangeType {
  type: 'users' | 'entrust';
}

const ArrangeForm: React.FC<GetGroupUserProps> = (props) => {
  const { onChange } = props;

  const [checkedValue, setCheckedValue] = useState<string>("2");

  const {data: surveyData = []} = useRequest(() => getGroupInfo("4"))

  const {data: designData = []} = useRequest(() => getGroupInfo("8"))

  const {data: auditData = []} = useRequest(() => getGroupInfo("16"))

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  const typeChange = (value: string) => {
    setCheckedValue(value)
    onChange?.(value)
  }

  const arrangementEvent = (value: any) => {};

  useMount(() => {
    onChange?.("2")
  })

  return (
    <>
      <CyFormItem label="安排方式">
        <div>
          <EnumSelect defaultValue="2" onChange={(value) => typeChange(value as string)} enumList={Arrangement} />
        </div>
      </CyFormItem>
      {
        checkedValue === "2" &&
        <>
          <CyFormItem label="勘察" name="surveyUser" required>
            <TreeSelect
              style={{ width: '100%' }}
              treeData={surveyData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>

          <CyFormItem label="设计" name="designUser" required>
            <TreeSelect
              style={{ width: '100%' }}
              treeData={designData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>

          <Divider>设计校审</Divider>

          <CyFormItem label="校对" name="designAssessUser1">
            <TreeSelect
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
          <CyFormItem label="校核" name="designAssessUser2">
            <TreeSelect
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
          <CyFormItem label="审核" name="designAssessUser3">
            <TreeSelect
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
          <CyFormItem label="审定" name="designAssessUser4" required>
            <TreeSelect
              style={{ width: '100%' }}
              treeData={auditData.map(mapTreeData)}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </>
      }
      {
        checkedValue === "1" &&
        <CyFormItem label="单位" name="unit">
          <Search placeholder="请输入单位" />
        </CyFormItem>
      }
    </>
  );
};

export default ArrangeForm;
