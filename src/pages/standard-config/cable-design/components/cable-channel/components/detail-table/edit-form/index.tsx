import React from 'react';
import { Input, InputNumber } from 'antd';
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
      <Scrollbars autoHeight>
        <CyFormItem
          align="right"
          label="组件"
          name="componentId"
          dependencies={['materialId']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('materialId') != undefined && value) {
                  return Promise.reject('组件或物料选其一');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <CascaderUrlSelect urlHead="Component" libId={resourceLibId} />
        </CyFormItem>

        <CyFormItem
          align="right"
          label="物料"
          name="materialId"
          dependencies={['componentId']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue('componentId') != undefined && value) {
                  return Promise.reject('组件或物料选其一');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <CascaderUrlSelect urlHead="Material" libId={resourceLibId} />
        </CyFormItem>

        <CyFormItem
          align="right"
          label="数量"
          name="itemNumber"
          rules={[
            { required: true, message: '数量不能为空' },
            { pattern: /^[1-9]\d*$/, message: '请输入正整数' },
          ]}
          required
        >
          <Input type="number" min={1} style={{ width: '395px' }} />
        </CyFormItem>
      </Scrollbars>
    </>
  );
};

export default EditCableChannelDetail;
