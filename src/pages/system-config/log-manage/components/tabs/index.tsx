import { Tabs } from 'antd';
import React from 'react';
import BaseInfo from '../base-info';

const { TabPane } = Tabs;

// TODO 参数声明,不能是any
interface LogDetailTabProps {
  detailData: any
}

const LogDetailTab: React.FC<LogDetailTabProps> = (props) => {
  const {detailData} = props;
  
  return (
    <>
      <Tabs className="normalTabs" tabBarGutter={25}>
        <TabPane tab="基本信息" key="1">
          <BaseInfo baseInfo={detailData} />
        </TabPane>
        <TabPane tab="内容" key="2">
          Content of Tab Pane 2
        </TabPane>
        <TabPane tab="请求头" key="3">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="Post数据源" key="4">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="响应内容" key="5">
          Content of Tab Pane 3
        </TabPane>
        <TabPane tab="异常" key="6">
          Content of Tab Pane 3
        </TabPane>
      </Tabs>
    </>
  );
};

export default LogDetailTab;
