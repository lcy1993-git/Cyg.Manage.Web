import CyFormItem from '@/components/cy-form-item';
import React from 'react';
import { Input, Row, Col } from 'antd';
import { useGetSelectData } from '@/utils/hooks';
import DataSelect from '@/components/data-select';

interface DefaultOptionsParams {
  groupId: string;
}

const DefaultParams: React.FC<DefaultOptionsParams> = (props) => {
  const { groupId } = props;

  const { data: templateData = [] } = useGetSelectData({
    url: '/CompanyFile/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { fileCategory: 1, groupId: groupId },
  });
  const { data: directoryData = [] } = useGetSelectData({
    url: '/CompanyFile/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { fileCategory: 3, groupId: groupId },
  });

  const { data: descriptionData = [] } = useGetSelectData({
    url: '/CompanyFile/GetList',
    method: 'post',
    titleKey: 'name',
    valueKey: 'id',
    extraParams: { fileCategory: 4, groupId: groupId },
  });

  return (
    <>
      <Row gutter={18}>
        <Col>
          <CyFormItem
            labelWidth={120}
            align="right"
            label="设计单位"
            name="designOrganize"
            rules={[{ max: 12, message: '设计单位超出字符数限制，限制为12个字符' }]}
          >
            <Input style={{ width: '220px' }} placeholder="--请输入设计单位--" />
          </CyFormItem>
        </Col>

        <Col>
          <CyFormItem labelWidth={120} align="right" label="图框模板" name="frameTemplate">
            <DataSelect
              options={templateData}
              style={{ width: '220px' }}
              placeholder="请选择图框模板"
            />
          </CyFormItem>
        </Col>
      </Row>
      <Row gutter={18}>
        <Col>
          <CyFormItem labelWidth={120} align="right" label="目录模板" name="directoryTemplate">
            <DataSelect
              options={directoryData}
              style={{ width: '220px' }}
              placeholder="请选择目录模板"
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
            <DataSelect
              options={descriptionData}
              style={{ width: '220px' }}
              placeholder="请选择设计总说明模板"
            />
          </CyFormItem>
        </Col>
      </Row>
    </>
  );
};

export default DefaultParams;
