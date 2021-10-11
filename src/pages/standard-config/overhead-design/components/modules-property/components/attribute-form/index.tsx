import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';

interface AttributeParams {
  resourceLibId: string;
}

const ModuleAttributeForm: React.FC<AttributeParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <CyFormItem label="高度(m)" name="height" labelWidth={111} align="right">
        <Input type="number" />
      </CyFormItem>

      <CyFormItem label="埋深(m)" name="depth" labelWidth={111} align="right">
        <Input type="number" />
      </CyFormItem>

      <CyFormItem label="呼称高(m)" name="nominalHeight" labelWidth={111} align="right">
        <Input type="number" />
      </CyFormItem>

      <CyFormItem label="钢材强度" name="steelStrength" labelWidth={111} align="right">
        <Input />
      </CyFormItem>
      <CyFormItem label="电杆强度" name="poleStrength" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="杆梢径(mm)" name="rodDiameter" labelWidth={111} align="right">
        <Input type="number" />
      </CyFormItem>

      <CyFormItem label="基重(kg)" name="baseWeight" labelWidth={111} align="right">
        <Input type="number" />
      </CyFormItem>

      <CyFormItem label="分段方式" name="segmentMode" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="土方参数" name="earthwork" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="导线排列方式" name="arrangement" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="气象区" name="meteorologic" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="回路数" name="loopNumber" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="线数" name="lineNumber" labelWidth={111} align="right">
        <Input type="number" />
      </CyFormItem>

      <CyFormItem label="导线类型" name="conductorType" labelWidth={111} align="right">
        <Input />
      </CyFormItem>

      <CyFormItem label="导线型号" name="conductorSpec" labelWidth={111} align="right">
        <Input />
      </CyFormItem>
    </>
  );
};

export default ModuleAttributeForm;
