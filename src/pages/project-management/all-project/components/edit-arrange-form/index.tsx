import React from 'react';
import { TreeSelect, Divider } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import { getGroupInfo } from '@/services/project-management/all-project';
import { useRequest } from 'ahooks';

const EditArrangeForm: React.FC = (props) => {

  const { data: surveyData = [] } = useRequest(() => getGroupInfo('4'));

  const { data: designData = [] } = useRequest(() => getGroupInfo('8'));

  const { data: auditData = [] } = useRequest(() => getGroupInfo('16'));

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  return (
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
  );
};

export default EditArrangeForm;
