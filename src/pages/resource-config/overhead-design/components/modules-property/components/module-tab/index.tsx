import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface ModuleProps {
  baseInfo: any;
}

const Modules: React.FC<ModuleProps> = (props) => {
  const { baseInfo } = props;
  return (
    <div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="模块名称">{baseInfo?.moduleName}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="模块简称">{baseInfo?.shortName}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="典设编码">{baseInfo?.typicalCode}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="杆型编码">{baseInfo?.poleTypeCode}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="单位">{baseInfo?.unit}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="模块分类">{baseInfo?.moduleType}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="所属工程">{baseInfo?.forProject}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="所属设计">{baseInfo?.forDesign}</ReadonlyItem>
        </div>
      </div>

      <div>
        <ReadonlyItem label="描述">{baseInfo?.remark}</ReadonlyItem>
      </div>
    </div>
  );
};

export default Modules;
