import { Tabs } from 'antd';
import React from 'react';
import CableWell from '../cable-well';
import CableChannel from '../cable-channel';

const { TabPane } = Tabs;

interface ExtractParams {
  templateId: string;
}

interface SuperManageAuthorizationProps {
  extractParams: ExtractParams;
}

const CableDesignTab: React.FC<SuperManageAuthorizationProps> = (props) => {
  const { extractParams } = props;

  return (
    <div>
      <Tabs className="normalTabs noMargin">
        <TabPane key="role" tab="电缆井">
          <CableWell extractParams={extractParams} />
        </TabPane>
        <TabPane key="user" tab="电缆通道">
          <CableChannel extractParams={extractParams} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default CableDesignTab;
