import CyFormItem from '@/components/cy-form-item';
import React, { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Row, Col, TreeSelect } from 'antd';
import { getCompanyFileTree } from '@/services/operation-config/company-file';

const DefaultSign: React.FC = () => {
  const { data: categoryData } = useRequest(() => getCompanyFileTree());

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

  const selectData = handleData?.map((item) => {
    return item.children;
  });

  const treeData = selectData?.map((item) => {
    return item.map((item: any) => {
      return {
        title: item.title,
        value: item.value,
      };
    });
  });

  return (
    <>
      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="批准" name="approve">
            <TreeSelect
              key="approve"
              style={{ width: '200px' }}
              treeData={
                selectData?.map((item) => {
                  return item.map((item: any) => {
                    return {
                      title: item.title,
                      value: item.value,
                    };
                  });
                })[1]
              }
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
              treeData={
                selectData?.map((item) => {
                  return item.map((item: any) => {
                    return {
                      title: item.title,
                      value: item.value,
                    };
                  });
                })[1]
              }
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
              treeData={
                selectData?.map((item) => {
                  return item.map((item: any) => {
                    return {
                      title: item.title,
                      value: item.value,
                    };
                  });
                })[1]
              }
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
              treeData={
                selectData?.map((item) => {
                  return item.map((item: any) => {
                    return {
                      title: item.title,
                      value: item.value,
                    };
                  });
                })[1]
              }
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

export default DefaultSign;
