import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

const { TextArea } = Input;
interface PoleTypeParams {
  type?: 'edit' | 'add';
  resourceLibId: string;
}

const CableChannelForm: React.FC<PoleTypeParams> = (props) => {
  const { type = 'edit', resourceLibId } = props;

  return (
    <>
      {type == 'add' && (
        <CyFormItem
          label="编号"
          name="channelId"
          labelWidth={111}
          align="right"
          required
          rules={[{ required: true, message: '通道编号不能为空' }]}
        >
          <Input placeholder="请输入编号" />
        </CyFormItem>
      )}

      <CyFormItem
        label="名称"
        name="channelName"
        labelWidth={111}
        align="right"
        required
        rules={[{ required: true, message: '名称不能为空' }]}
      >
        <Input placeholder="请输入名称" />
      </CyFormItem>

      <CyFormItem
        label="简称"
        name="shortName"
        labelWidth={111}
        align="right"
        required
        rules={[{ required: true, message: '简称不能为空' }]}
      >
        <Input placeholder="请输入简称" />
      </CyFormItem>

      <CyFormItem
        label="典设编码"
        name="typicalCode"
        labelWidth={111}
        align="right"
        required
        rules={[{ required: true, message: '典设编码不能为空' }]}
      >
        <Input placeholder="请输入典设编码" />
      </CyFormItem>
      <CyFormItem
        label="规格简号"
        name="channelCode"
        labelWidth={111}
        align="right"
        required
        rules={[{ required: true, message: '规格简号不能为空' }]}
      >
        <Input placeholder="请输入规格简号" />
      </CyFormItem>

      <CyFormItem label="加工图" name="chartIds" labelWidth={111} align="right">
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

      <CyFormItem label="单位" name="unit" labelWidth={111} align="right">
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="预留宽度(mm)" name="reservedWidth" labelWidth={111} align="right">
        <Input placeholder="请输入预留宽度" />
      </CyFormItem>

      <CyFormItem label="挖深(mm)" name="digDepth" labelWidth={111} align="right">
        <Input placeholder="请输入挖深" />
      </CyFormItem>

      <CyFormItem label="敷设方式" name="layingMode" labelWidth={111} align="right">
        <Input placeholder="请输入敷设方式" />
      </CyFormItem>

      <CyFormItem label="电缆数量" name="cableNumber" labelWidth={111} align="right">
        <Input placeholder="请输入电缆数量" />
      </CyFormItem>

      <CyFormItem label="路面环境" name="pavement" labelWidth={111} align="right">
        <Input placeholder="请输入路面环境" />
      </CyFormItem>

      <CyFormItem label="保护方式" name="protectionMode" labelWidth={111} align="right">
        <Input placeholder="请输入保护方式" />
      </CyFormItem>

      <CyFormItem label="电缆管材质编号" name="ductMaterialId" labelWidth={111} align="right">
        <Input placeholder="请输入材质编号" />
      </CyFormItem>

      <CyFormItem label="排列方式" name="arrangement" labelWidth={111} align="right">
        <Input placeholder="请输入排列方式" />
      </CyFormItem>

      <CyFormItem label="支架层数" name="bracketNumber" labelWidth={111} align="right">
        <Input placeholder="请输入支架层数" />
      </CyFormItem>

      <CyFormItem label="所属工程" name="forProject" labelWidth={111} align="right">
        <Input placeholder="请输入所属工程" />
      </CyFormItem>

      <CyFormItem label="所属设计" name="forDesign" labelWidth={111} align="right">
        <Input placeholder="请输入所属设计" />
      </CyFormItem>

      <CyFormItem label="备注" name="remark" labelWidth={111} align="right">
        <TextArea showCount maxLength={100} placeholder="备注说明" />
      </CyFormItem>
    </>
  );
};

export default CableChannelForm;
