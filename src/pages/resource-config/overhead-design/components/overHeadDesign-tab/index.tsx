import { Tabs } from 'antd';
import React from 'react';
import PoleType from '../pole-type';
import ModulesProperty from '../modules-property';

const { TabPane } = Tabs;

interface CableDesignParams {
  libId: string;
}
const OverHeadDesignTab: React.FC<CableDesignParams> = (props) => {
  const { libId } = props;

  return (
    <Tabs className="normalTabs noMargin">
      <TabPane key="pole" tab="杆型">
        <PoleType libId={libId} />
      </TabPane>
      <TabPane key="modules" tab="模块">
        <ModulesProperty libId={libId} />
      </TabPane>
    </Tabs>
  );
};

export default OverHeadDesignTab;
