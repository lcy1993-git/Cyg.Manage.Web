import CyFormItem from '@/components/cy-form-item';
import React, { useState, useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Input, Form, message, Row, Col, Button, TreeSelect } from 'antd';
import { getCompanyFileTree } from '@/services/operation-config/company-file';
// import { GetTreeByCategory } from '@/services/operation-config/company-file';

// interface DefaultOptionsParams {
//   categoryData: GetTreeByCategory[];
// }

const DefaultParams: React.FC = () => {
  const { data: categoryData = [] } = useRequest(() => getCompanyFileTree());
  console.log(categoryData);

  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      value: data.id,
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  const handleData = useMemo(() => {
    return categoryData?.map(mapTreeData);
  }, [JSON.stringify(categoryData)]);

  return (
    <>
      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="设计单位" name="designOrganize">
            <Input style={{ width: '200px' }} placeholder="--请输入设计单位--" />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="图框模板" name="frameTemplate">
            <TreeSelect
              key="frameTemplate"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>
      </Row>
      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="目录模板" name="directoryTemplate">
            <TreeSelect
              key="directoryTemplate"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem
            labelWidth={120}
            align="right"
            label="设计总说明模板"
            name="descriptionTemplate"
          >
            <TreeSelect
              key="descriptionTemplate"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>
      </Row>

      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="批准" name="approve">
            <TreeSelect
              key="approve"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="审核" name="audit">
            <TreeSelect
              key="audit"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>
      </Row>

      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="校核" name="calibration">
            <TreeSelect
              key="calibration"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="设计/勘测" name="designSurvey">
            <TreeSelect
              key="designSurvey"
              style={{ width: '200px' }}
              treeData={handleData}
              placeholder="请选择"
              treeDefaultExpandAll
              allowClear
            />
          </CyFormItem>
        </Col>
      </Row>
    </>
  );
};

export default DefaultParams;
