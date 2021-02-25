import React from 'react';
import { Input, Radio } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

const { TextArea } = Input;
interface PoleTypeParams {
  type?: 'edit' | 'add';
  resourceLibId: string;
}

const PoleTypeForm: React.FC<PoleTypeParams> = (props) => {
  const { type = 'edit', resourceLibId } = props;
  console.log(resourceLibId);

  return (
    <>
      {type == 'add' && (
        <CyFormItem label="简号编码" name="poleTypeCode" required>
          <Input placeholder="请输入简号编码" />
        </CyFormItem>
      )}

      <CyFormItem label="名称" name="poleTypeName" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="类别" name="category">
        <Input placeholder="请输入类别" />
      </CyFormItem>

      <CyFormItem label="电压等级" name="kvLevel">
        <Input placeholder="请输入电压等级" />
      </CyFormItem>

      <CyFormItem label="类型" name="type">
        <Input placeholder="请输入类型" />
      </CyFormItem>

      <CyFormItem label="转角" name="corner">
        <Input placeholder="请输入转角" />
      </CyFormItem>

      <CyFormItem label="材质" name="material">
        <Input placeholder="请输入材质" />
      </CyFormItem>

      <CyFormItem label="回路数" name="loopNumber">
        <Input placeholder="请输入回路数" />
      </CyFormItem>

      <CyFormItem label="是否耐张" name="isTension">
        <Radio.Group value={1} defaultValue={2}>
          <Radio value={1}>是</Radio>
          <Radio value={2}>否</Radio>
        </Radio.Group>
      </CyFormItem>

      <CyFormItem label="描述" name="remark">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
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
          extraParams={resourceLibId}
        />
      </CyFormItem>
    </>
  );
};

export default PoleTypeForm;
