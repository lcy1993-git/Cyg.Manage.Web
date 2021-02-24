import { Tabs, Input } from 'antd';
import React from 'react';
import CableWell from '../cable-well';
import CableChannel from '../cable-channel';
import TableSearch from '@/components/table-search';

const { TabPane } = Tabs;
const { Search } = Input;

interface CableDesignParams {
  libId: string;
}
const CableDesignTab: React.FC<CableDesignParams> = (props) => {
  const { libId } = props;

  return (
    <div>
      <Tabs className="normalTabs noMargin">
        <TabPane key="well" tab="电缆井">
          <CableWell libId={libId} />
        </TabPane>
        <TabPane key="channel" tab="电缆通道">
          <CableChannel libId={libId} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CableDesignTab;
