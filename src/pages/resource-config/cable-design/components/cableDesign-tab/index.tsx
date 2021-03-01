import { Tabs } from 'antd';
import React from 'react';
import CableWell from '../cable-well';
import CableChannel from '../cable-channel';

const { TabPane } = Tabs;

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
