import React from 'react';
import { InputNumber } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import Scrollbars from 'react-custom-scrollbars';

interface EditModuleDetailParams {
  resourceLibId: string;
}

const EditModuleDetail: React.FC<EditModuleDetailParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <Scrollbars style={{ height: '100px' }}>
        <CyFormItem label="所属部件" name="part">
          <UrlSelect
            requestSource="resource"
            url="/ModulesDetails/GetParts"
            valueKey="value"
            titleKey="key"
            allowClear
            placeholder="--所属部件--"
          />
        </CyFormItem>
        <CyFormItem label="组件" name="componentId">
          <CascaderUrlSelect urlHead="Component" libId={resourceLibId} />,
        </CyFormItem>

        <CyFormItem label="物料" name="materialId">
          <CascaderUrlSelect urlHead="Material" libId={resourceLibId} />
        </CyFormItem>

        <CyFormItem label="数量" name="itemNumber">
          <InputNumber min={0} />
        </CyFormItem>
      </Scrollbars>
    </>
  );
};

export default EditModuleDetail;
