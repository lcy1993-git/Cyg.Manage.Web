import React, { useState } from 'react';
import { Input, Tooltip } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import EnumSelect from '@/components/enum-select';
import { QuestionCircleOutlined } from '@ant-design/icons';
interface ChartListFromLibParams {
  resourceLibId: string;
}

enum materialType {
  '材料' = '材料',
  '设备' = '设备',
}

enum supplySideType {
  '甲供' = '甲供',
  '乙供' = '乙供',
}

enum kvLevelType {
  '不限' = '不限',
  '10kV' = '10kV',
  '220V' = '220V',
  '380V' = '380V',
}
enum forProjectType {
  '不限' = '不限',
  '城网' = '城网',
  '农网' = '农网',
}
enum forDesignType {
  '不限' = '不限',
  '架空' = '架空',
  '电缆' = '电缆',
}

const MaterialForm: React.FC<ChartListFromLibParams> = (props) => {
  const { resourceLibId } = props;

  const [forDesign, setForDesign] = useState<string>('不限');
  const [forProject, setForProject] = useState<string>('不限');
  const [kvLevel, setKvLevel] = useState<string>('不限');

  const unitSlot = () => {
    return (
      <>
        <span>单位</span>
        <Tooltip title="长度单位请用m/km" placement="top">
          <QuestionCircleOutlined style={{ paddingLeft: 8, fontSize: 14 }} />
        </Tooltip>
      </>
    );
  };

  return (
    <>
      <CyFormItem
        label="物料编码"
        name="materialId"
        required
        rules={[{ required: true, message: '物料编码不能为空' }]}
      >
        <Input placeholder="请输入物料编码"></Input>
      </CyFormItem>

      <CyFormItem label="物资编号" name="code">
        <Input placeholder="请输入物资编号" />
      </CyFormItem>

      <CyFormItem
        label="物料类型"
        name="category"
        required
        rules={[{ required: true, message: '类型不能为空' }]}
      >
        <EnumSelect placeholder="请选择物料类型" enumList={materialType} valueString />
      </CyFormItem>

      <CyFormItem
        label="物料名称"
        name="materialName"
        required
        rules={[{ required: true, message: '物料名称不能为空' }]}
      >
        <Input placeholder="请输入物料名称"></Input>
      </CyFormItem>

      <CyFormItem
        label="规格型号"
        name="spec"
        required
        rules={[{ required: true, message: '规格型号不能为空' }]}
      >
        <Input placeholder="请输入规格型号" />
      </CyFormItem>

      <CyFormItem
        label="类别"
        name="materialType"
        required
        rules={[{ required: true, message: '类别不能为空' }]}
      >
        <Input placeholder="请输入类别" />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        rules={[{ required: true, message: '单位不能为空' }]}
        required
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="单重(kg)" name="pieceWeight">
        <Input placeholder="请输入单重" />
      </CyFormItem>

      <CyFormItem label="供给方" name="supplySide">
        <EnumSelect placeholder="请选择供给方" enumList={supplySideType} valueString allowClear />
      </CyFormItem>

      <CyFormItem label="运输类型" name="transportationType">
        <Input placeholder="请输入运输类型" />
      </CyFormItem>

      <CyFormItem
        label="电压等级"
        name="kvLevel"
        required
        rules={[{ required: true, message: '电压等级不能为空' }]}
      >
        <EnumSelect
          placeholder="请选择电压等级"
          enumList={kvLevelType}
          valueString
          defaultValue={kvLevel}
          value={kvLevel}
          // onChange={(value: any) => {
          //   console.log(value);
          //   setKvLevel(value);
          // }}
        />
      </CyFormItem>

      <CyFormItem
        label="所属工程"
        name="forProject"
        required
        rules={[{ required: true, message: '所属工程不能为空' }]}
      >
        <EnumSelect
          value={forProject}
          placeholder="请选择所属工程"
          enumList={forProjectType}
          valueString
          defaultValue="不限"
          onChange={(value: any) => setForProject(value)}
        />
      </CyFormItem>

      <CyFormItem
        label="所属设计"
        name="forDesign"
        required
        rules={[{ required: true, message: '所属设计不能为空' }]}
      >
        <EnumSelect
          value={forDesign}
          placeholder="请选择所属设计"
          enumList={forDesignType}
          valueString
          defaultValue="不限"
          onChange={(value: any) => setForDesign(value)}
        />
      </CyFormItem>

      <CyFormItem label="加工图" name="chartIds">
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
