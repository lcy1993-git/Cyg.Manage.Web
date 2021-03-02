import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

const { TextArea } = Input;
interface PoleTypeParams {
  type?: 'edit' | 'add';
  resourceLibId: string;
}

const ModulesPropertyForm: React.FC<PoleTypeParams> = (props) => {
  const { type = 'edit', resourceLibId } = props;
  console.log(resourceLibId);

  return (
    <>
      {type == 'add' && (
        <CyFormItem label="编号" name="moduleId" required>
          <Input placeholder="请输入编号" />
        </CyFormItem>
      )}

      <CyFormItem label="名称" name="moduleName" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="简称" name="shortName" required>
        <Input placeholder="请输入简称" />
      </CyFormItem>

      {type == 'add' && (
        <CyFormItem label="典设编码" name="typicalCode" required>
          <Input placeholder="请输入典设编码" />
        </CyFormItem>
      )}

      {type == 'add' && (
        <CyFormItem label="杆型简称" name="poleTypeCode" required>
          <UrlSelect
            showSearch
            requestSource="resource"
            url="/PoleType/GetList"
            titleKey="poleTypeCode"
            valueKey="poleTypeName"
            placeholder="请选择杆型简称"
            extraParams={{ libId: resourceLibId }}
          />
        </CyFormItem>
      )}

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

      <CyFormItem label="单位" name="unit">
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="模块分类" name="moduleType">
        <Input placeholder="请输入模块分类" />
      </CyFormItem>

      <CyFormItem label="所属工程" name="forProject">
        <Input placeholder="请输入所属工程" />
      </CyFormItem>

      <CyFormItem label="所属设计" name="forDesign">
        <Input placeholder="请输入所属设计" />
      </CyFormItem>

      <CyFormItem label="描述" name="remark">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
      </CyFormItem>
    </>
  );
};

export default ModulesPropertyForm;
