import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

interface ChartListFromLibParams {
  resourceLibId: string;
  type?: 'add' | 'edit';
}

const ComponentForm: React.FC<ChartListFromLibParams> = (props) => {
  const { type = 'edit', resourceLibId } = props;
  // console.log(resourceLibId);

  return (
    <>
      {type === 'add' && (
        <CyFormItem label="编号" name="componentId" required>
          <Input placeholder="请输入编号"></Input>
        </CyFormItem>
      )}
      <CyFormItem label="名称" name="componentName" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="规格型号" name="componentSpec">
        <Input placeholder="请输入规格型号" />
      </CyFormItem>

      <CyFormItem label="典设编码" name="typicalCode">
        <Input placeholder="请输入典设编码" />
      </CyFormItem>

      <CyFormItem label="单位" name="unit">
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="设备类别" name="deviceCategory">
        <Input placeholder="请输入设备类别" />
      </CyFormItem>

      <CyFormItem label="组件分类" name="componentType">
        <Input placeholder="请输入组件分类" />
      </CyFormItem>

      <CyFormItem label="电压等级" name="kvLevel">
        <Input placeholder="请输入电压等级" />
      </CyFormItem>

      <CyFormItem label="所属工程" name="forProject">
        <Input placeholder="请输入所属工程" />
      </CyFormItem>

      <CyFormItem label="所属设计" name="forDesign">
        <Input placeholder="请输入所属设计" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark">
        <Input placeholder="请输入备注" />
      </CyFormItem>

      <CyFormItem label="图纸" name="chartIds">
        <UrlSelect
          requestType="post"
          mode="multiple"
          showSearch
          requestSource="resource"
          url="/Chart/GetList"
          titleKey="chartName"
          valueKey="chartId"
          placeholder="请选择图纸"
          postType="query"
          libId={resourceLibId}
        />
      </CyFormItem>
    </>
  );
};

export default ComponentForm;
