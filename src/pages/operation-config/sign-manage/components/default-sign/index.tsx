import CyFormItem from '@/components/cy-form-item';
import React, { useMemo } from 'react';
import { useRequest } from 'ahooks';
import { Row, Col, TreeSelect } from 'antd';
import { getCompanyFileTree } from '@/services/operation-config/company-file';
import { useGetSelectData } from '@/utils/hooks';

interface DefaultOptionsParams {
  groupId: string;
}

const DefaultSign: React.FC<DefaultOptionsParams> = (props) => {
  const { groupId } = props;
  const { data: approveData = [] } = useGetSelectData({
    url: '/CompanySign/GetList',
    extraParams: { category: 0, groupId: groupId },
  });

  console.log(approveData);

  return (
    <>
      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="批准" name="approve">
            {/* <TreeSelect
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
            /> */}
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="审核" name="audit">
            {/* <TreeSelect
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
            /> */}
          </CyFormItem>
        </Col>
      </Row>

      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="校核" name="calibration">
            {/* <TreeSelect
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
            /> */}
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
