import React from 'react';
import { Input } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';

interface ChartListFromLibParams {
  resourceLibId: string;
}

const MaterialForm: React.FC<ChartListFromLibParams> = (props) => {
  const { resourceLibId } = props;

  return (
    <>
      <CyFormItem
        label="编号"
        name="materialId"
        required
        rules={[{ required: true, message: '编号不能为空' }]}
      >
        <Input placeholder="请输入编号"></Input>
      </CyFormItem>

      <CyFormItem
        label="类型"
        name="category"
        required
        rules={[{ required: true, message: '类型不能为空' }]}
      >
        <Input placeholder="请输入类型" />
      </CyFormItem>

      <CyFormItem
        label="名称"
        name="materialName"
        required
        rules={[{ required: true, message: '名称不能为空' }]}
      >
        <Input placeholder="请输入物料名称"></Input>
      </CyFormItem>

      <CyFormItem label="规格型号" name="spec">
        <Input placeholder="请输入规格型号" />
      </CyFormItem>

      <CyFormItem label="单位" name="unit">
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="单重(kg)" name="pieceWeight">
        <Input placeholder="请输入单重" />
      </CyFormItem>

      <CyFormItem label="单价(元)" name="unitPrice">
        <Input placeholder="请输入单价" />
      </CyFormItem>

      <CyFormItem label="类别" name="materialType">
        <Input placeholder="请输入类别" />
      </CyFormItem>

      <CyFormItem label="用途" name="usage">
        <Input placeholder="请输入用途" />
      </CyFormItem>
      <CyFormItem label="物料(运检)" name="inspection">
        <Input placeholder="请输入" />
      </CyFormItem>
      <CyFormItem label="描述" name="description">
        <Input placeholder="请输入描述" />
      </CyFormItem>

      <CyFormItem label="物资编号" name="code">
        <Input placeholder="请输入物资编号" />
      </CyFormItem>

      <CyFormItem label="供给方" name="supplySide">
        <Input placeholder="请输入供给方" />
      </CyFormItem>

      <CyFormItem label="运输类型" name="transportationType">
        <Input placeholder="请输入运输类型" />
      </CyFormItem>

      <CyFormItem label="统计类型" name="statisticType">
        <Input placeholder="请输入统计类型" />
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

export default MaterialForm;
