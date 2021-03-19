import React from 'react';
import { Input, Select } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

const { TextArea } = Input;
interface PoleTypeParams {
  type?: 'edit' | 'add';
  resourceLibId: string;
}

const CableWellForm: React.FC<PoleTypeParams> = (props) => {
  const { type = 'edit', resourceLibId } = props;

  return (
    <>
      {type == 'add' && (
        <CyFormItem label="编号" name="cableWellId" labelWidth={98} align="right" required>
          <Input placeholder="请输入编号" />
        </CyFormItem>
      )}

      <CyFormItem label="名称" name="cableWellName" labelWidth={98} align="right" required>
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem label="简称" name="shortName" labelWidth={98} align="right" required>
        <Input placeholder="请输入简称" />
      </CyFormItem>

      <CyFormItem label="典设编码" name="typicalCode" labelWidth={98} align="right" required>
        <Input placeholder="请输入典设编码" />
      </CyFormItem>

      <CyFormItem label="加工图" name="chartIds" labelWidth={98} align="right">
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

      <CyFormItem label="类型" name="type" labelWidth={98} align="right">
        <Input placeholder="请输入类型" />
      </CyFormItem>

      <CyFormItem label="单位" name="unit" labelWidth={98} align="right">
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="宽度(mm)" name="width" labelWidth={98} align="right">
        <Input placeholder="请输入宽度" />
      </CyFormItem>

      <CyFormItem label="井深(mm)" name="depth" labelWidth={98} align="right">
        <Input placeholder="请输入井深" />
      </CyFormItem>

      <CyFormItem label="是否封闭" name="isConfined" labelWidth={98} align="right" initialValue={0}>
        <Select>
          <option value={1}>是</option>
          <option value={0}>否</option>
        </Select>
      </CyFormItem>

      <CyFormItem
        labelWidth={98}
        align="right"
        label="是否转接孔管"
        name="isSwitchingPipe"
        initialValue={0}
      >
        <Select>
          <option value={1}>是</option>
          <option value={0}>否</option>
        </Select>
      </CyFormItem>

      <CyFormItem label="特征" name="feature" labelWidth={98} align="right">
        <Input placeholder="请输入特征" />
      </CyFormItem>

      <CyFormItem label="路面环境" name="pavement" labelWidth={98} align="right">
        <Input placeholder="请输入路面环境" />
      </CyFormItem>

      <CyFormItem label="尺寸" name="size" labelWidth={98} align="right">
        <Input placeholder="请输入尺寸" />
      </CyFormItem>

      <CyFormItem label="盖板模式" name="coverMode" labelWidth={98} align="right">
        <Input placeholder="请输入盖板模式" />
      </CyFormItem>

      <CyFormItem label="沟体结构" name="grooveStructure" labelWidth={98} align="right">
        <Input placeholder="请输入沟体结构" />
      </CyFormItem>

      <CyFormItem label="所属工程" name="forProject" labelWidth={98} align="right">
        <Input placeholder="请输入所属工程" />
      </CyFormItem>

      <CyFormItem label="所属设计" name="forDesign" labelWidth={98} align="right">
        <Input placeholder="请输入所属设计" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark" labelWidth={98} align="right">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
      </CyFormItem>
    </>
  );
};

export default CableWellForm;
