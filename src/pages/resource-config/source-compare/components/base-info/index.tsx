import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface BaseInfoProps {
  baseInfo: any;
}

const BaseInfo: React.FC<BaseInfoProps> = (props) => {
  const { baseInfo } = props;
  return (
    <div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="源库编号">{baseInfo?.sourceId}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="源库名称">{baseInfo?.sourceDbName}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="目标库编号">{baseInfo?.compareId}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="目标库名称">{baseInfo?.compareDbName}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="进度">{baseInfo?.progressRate}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="状态">{baseInfo?.statusText}</ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="开始日期">{baseInfo?.startDateText}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem label="完成日期">{baseInfo?.completionDateText}</ReadonlyItem>
        </div>
      </div>
    </div>
  );
};

export default BaseInfo;
