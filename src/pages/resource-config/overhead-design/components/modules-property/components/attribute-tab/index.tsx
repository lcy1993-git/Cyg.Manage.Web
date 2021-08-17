import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface AttributeProps {
  info: any;
}

const Attribute: React.FC<AttributeProps> = (props) => {
  const { info } = props;
  let attribute = info?.propertys;

  return (
    <div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="高度(m)">{attribute?.height}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="埋深(m)">
            {attribute?.depth}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="呼称高(m)">{attribute?.nominalHeight}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="钢材强度">
            {attribute?.steelStrength}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="电杆强度">{attribute?.poleStrength}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="杆梢径(mm)">
            {attribute?.rodDiameter}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="基重">{attribute?.baseWeight}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="分段方式">
            {attribute?.segmentMode}
          </ReadonlyItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="土方参数">{attribute?.earthwork}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="导线排列方式">
            {attribute?.arrangement}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="气象区">{attribute?.meteorologic}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="回路数">
            {attribute?.loopNumber}
          </ReadonlyItem>
        </div>
      </div>

      <div className="flex">
        <div className="flex1">
          <ReadonlyItem label="线数">{attribute?.lineNumber}</ReadonlyItem>
        </div>
        <div className="flex1">
          <ReadonlyItem labelWidth={80} label="导线类型">
            {attribute?.conductorType}
          </ReadonlyItem>
        </div>
      </div>
      <div className="flex">
        <ReadonlyItem label="导线型号">{attribute?.conductorSpec}</ReadonlyItem>
      </div>
    </div>
  );
};

export default Attribute;
