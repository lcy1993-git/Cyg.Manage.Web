import { Tabs } from 'antd';
import React from 'react';

const { TabPane } = Tabs;

const LogDetailTab: React.FC = () => {
  const callback = (key: any) => {
    console.log(key);
  };
  return (
    <>
      <Tabs onChange={callback} type="card">
        <TabPane tab="Tab 1" key="1">
          Content of Tab Pane 1
        </TabPane>
        <TabPane tab="Tab 2" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="Tab 3" key="3">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  );
};

export default LogDetailTab;
