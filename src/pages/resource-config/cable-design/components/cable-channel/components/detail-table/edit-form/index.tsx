import React from 'react';
import { InputNumber } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import CascaderUrlSelect from '@/components/material-cascader-url-select';
import Scrollbars from 'react-custom-scrollbars';

interface EditCableChannelDetailParams {
  resourceLibId: string;
}

const EditCableChannelDetail: React.FC<EditCableChannelDetailParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <Scrollbars style={{ height: '150px' }}>
        <CyFormItem label="组件" name="componentId">
          <CascaderUrlSelect urlHead="Component" libId={resourceLibId} />
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

export default EditCableChannelDetail;
