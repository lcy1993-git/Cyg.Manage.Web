import React from 'react';
import { InputNumber } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

interface EditComponentDetailParams {
  resourceLibId: string;
}

const EditComponentDetail: React.FC<EditComponentDetailParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <CyFormItem label="组件" name="componentId">
        <UrlSelect
          requestSource="resource"
          url="/Component/GetList"
          valueKey="componentId"
          titleKey="componentName"
          allowClear
          requestType="post"
          postType="query"
          placeholder="--组件--"
          libId={resourceLibId}
        />
      </CyFormItem>

      <CyFormItem label="物料" name="materialId">
        <UrlSelect
          requestSource="resource"
          url="/Material/GetList"
          valueKey="materialId"
          titleKey="materialName"
          allowClear
          requestType="post"
          postType="query"
          placeholder="--物料--"
          libId={resourceLibId}
        />
      </CyFormItem>

      <CyFormItem label="数量" name="itemNumber">
        <InputNumber min={0} />
      </CyFormItem>
    </>
  );
};

export default EditComponentDetail;
