import CyFormItem from '@/components/cy-form-item';
import React, { useMemo } from 'react';
import { Row, Col } from 'antd';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';

interface DefaultOptionsParams {
  groupId: string;
}

const DefaultSign: React.FC<DefaultOptionsParams> = (props) => {
  const { groupId } = props;
  const { data: approveData = [] } = useGetSelectData({
    url: '/CompanySign/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { category: 1, groupId: groupId },
  });
  const { data: auditData = [] } = useGetSelectData({
    url: '/CompanySign/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { category: 2, groupId: groupId },
  });
  const { data: checkData = [] } = useGetSelectData({
    url: '/CompanySign/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { category: 3, groupId: groupId },
  });
  const { data: designData = [] } = useGetSelectData({
    url: '/CompanySign/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { category: 4, groupId: groupId },
  });

  return (
    <>
      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="批准" name="approve">
            <DataSelect
              options={approveData}
              style={{ width: '220px' }}
              placeholder="请选择批准人员"
            />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="审核" name="audit">
            <DataSelect
              options={auditData}
              style={{ width: '220px' }}
              placeholder="请选择审核人员"
            />
          </CyFormItem>
        </Col>
      </Row>

      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="校核" name="calibration">
            <DataSelect
              options={checkData}
              style={{ width: '220px' }}
              placeholder="请选择校核人员"
            />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="设计/勘测" name="designSurvey">
            <DataSelect
              options={designData}
              style={{ width: '220px' }}
              placeholder="请选择设计/勘测人员"
            />
          </CyFormItem>
        </Col>
      </Row>
    </>
  );
};

export default DefaultSign;
