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

      <CyFormItem label="是否耐张" name="isTension" initialValue={false}>
        <Radio.Group>
          <Radio value={true}>是</Radio>
          <Radio value={false}>否</Radio>
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
          titlekey="chartName"
          valuekey="chartId"
          placeholder="请选择图纸"
          postType="query"
          libId={resourceLibId}
        />
      </CyFormItem>
    </>
  );
};

export default PoleTypeForm;
