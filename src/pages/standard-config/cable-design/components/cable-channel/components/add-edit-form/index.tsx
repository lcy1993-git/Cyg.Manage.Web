import React from 'react';
import { Input, Tooltip } from 'antd';
import CyFormItem from '@/components/cy-form-item';
import UrlSelect from '@/components/url-select';
import { QuestionCircleOutlined } from '@ant-design/icons';
import EnumSelect from '@/components/enum-select';
import {
  forDesignType,
  forProjectType,
  feature,
  coverMode,
  grooveStructure,
} from '@/services/resource-config/resource-enum';

const { TextArea } = Input;
interface PoleTypeParams {
  type?: 'edit' | 'add';
  resourceLibId: string;
}

const CableChannelForm: React.FC<PoleTypeParams> = (props) => {
  const { type = 'edit', resourceLibId } = props;
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
      {type == 'add' && (
        <CyFormItem
          label="模块编码"
          name="channelId"
          labelWidth={130}
          align="right"
          required
          rules={[{ required: true, message: '模块编码不能为空' }]}
        >
          <Input placeholder="请输入编号" />
        </CyFormItem>
      )}

      <CyFormItem
        label="模块名称"
        name="channelName"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '模块名称不能为空' }]}
      >
        <Input placeholder="请输入模块名称" />
      </CyFormItem>

      <CyFormItem
        label="模块简称"
        name="shortName"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '模块简称不能为空' }]}
      >
        <Input placeholder="请输入模块简称" />
      </CyFormItem>

      <CyFormItem
        label="简号"
        name="channelCode"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '简号不能为空' }]}
      >
        <Input placeholder="请输入简号" />
      </CyFormItem>

      <CyFormItem
        labelSlot={unitSlot}
        name="unit"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '单位不能为空' }]}
      >
        <Input placeholder="请输入单位" />
      </CyFormItem>

      <CyFormItem label="设计图" name="designChartIds" labelWidth={130} align="right">
        <UrlSelect
          requestType="post"
          mode="multiple"
          showSearch
          requestSource="resource"
          url="/Chart/GetDesignChartList"
          titlekey="chartName"
          valuekey="chartId"
          placeholder="请选择图纸"
          postType="query"
          libId={resourceLibId}
        />
      </CyFormItem>
      <CyFormItem label="加工图" name="processChartIds" labelWidth={130} align="right">
        <UrlSelect
          requestType="post"
          mode="multiple"
          showSearch
          requestSource="resource"
          url="/Chart/GetProcessChartList"
          titlekey="chartName"
          valuekey="chartId"
          placeholder="请选择图纸"
          postType="query"
          libId={resourceLibId}
        />
      </CyFormItem>

      <CyFormItem
        label="所属工程"
        name="forProject"
        required
        align="right"
        labelWidth={130}
        initialValue="不限"
        rules={[{ required: true, message: '所属工程不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属工程" enumList={forProjectType} valueString />
      </CyFormItem>

      <CyFormItem
        label="所属设计"
        name="forDesign"
        required
        align="right"
        labelWidth={130}
        initialValue="不限"
        rules={[{ required: true, message: '所属设计不能为空' }]}
      >
        <EnumSelect placeholder="请选择所属设计" enumList={forDesignType} valueString />
      </CyFormItem>

      <CyFormItem
        label="通道预留宽度(mm)"
        name="reservedWidth"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '通道预留宽度不能为空' }]}
      >
        <Input placeholder="请输入通道预留宽度" type="number" />
      </CyFormItem>

      <CyFormItem
        label="挖深(mm)"
        name="digDepth"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '挖深不能为空' }]}
      >
        <Input placeholder="请输入挖深" type="number" />
      </CyFormItem>

      <CyFormItem
        label="敷设方式"
        name="layingMode"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '敷设方式不能为空' }]}
      >
        <Input placeholder="请输入敷设方式" />
      </CyFormItem>

      <CyFormItem
        label="可容纳电缆数量"
        name="cableNumber"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '可容纳电缆数量不能为空' }]}
      >
        <Input placeholder="请输入电缆数量" />
      </CyFormItem>

      <CyFormItem
        label="支架层数"
        name="bracketNumber"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '支架层数不能为空' }]}
      >
        <Input placeholder="请输入支架层数" />
      </CyFormItem>
      <CyFormItem
        label="排列方式"
        name="arrangement"
        labelWidth={130}
        align="right"
        required
        rules={[{ required: true, message: '排列方式不能为空' }]}
      >
        <Input placeholder="请输入排列方式" />
      </CyFormItem>
    </>
  );
};

export default CableChannelForm;
