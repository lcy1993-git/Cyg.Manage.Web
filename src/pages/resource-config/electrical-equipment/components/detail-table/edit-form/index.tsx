import React from 'react';
import { InputNumber } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';

interface EditComponentDetailParams {
  resourceLibId: string;
}

const EditComponentDetail: React.FC<EditComponentDetailParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <CyFormItem label="组件" name="componentId">
        <CascaderUrlSelect requestSource="component" urlHead="Component" libId={resourceLibId} />
      </CyFormItem>

      <CyFormItem label="物料" name="materialId">
        <CascaderUrlSelect requestSource="material" urlHead="Material" libId={resourceLibId} />
      </CyFormItem>

      <CyFormItem label="数量" name="itemNumber">
        <InputNumber min={0} />
      </CyFormItem>
    </>
  );
};

export default EditComponentDetail;
