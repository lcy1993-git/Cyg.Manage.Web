import React from 'react';
import { InputNumber } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';

interface EditCableWellDetailParams {
  resourceLibId: string;
}

const EditCableWellDetail: React.FC<EditCableWellDetailParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <CyFormItem label="组件" name="componentId">
        <CascaderUrlSelect urlHead="Component" libId={resourceLibId} />
      </CyFormItem>

      <CyFormItem label="物料" name="materialId">
        <CascaderUrlSelect  urlHead="Material" libId={resourceLibId} />
      </CyFormItem>

      <CyFormItem label="数量" name="itemNumber">
        <InputNumber min={0} />
      </CyFormItem>
    </>
  );
};

export default EditCableWellDetail;
