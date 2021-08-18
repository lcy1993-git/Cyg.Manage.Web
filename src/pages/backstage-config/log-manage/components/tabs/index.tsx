import { Tabs } from 'antd';
import Content from '../content';
import React from 'react';
import BaseInfo from '../base-info';
import ReqHeader from '../req-header';
import ReqPostBody from '../req-post-body';
import ResContent from '../res-content';
import Exception from '../exception';

const { TabPane } = Tabs;

// TODO 参数声明,不能是any
interface LogDetailTabProps {
  detailData: any;
}

const LogDetailTab: React.FC<LogDetailTabProps> = (props) => {
  const { detailData } = props;

  return (
    <>
      <Tabs className="normalTabs" tabBarGutter={25}>
        <TabPane tab="基本信息" key="1">
          <BaseInfo baseInfo={detailData} />
        </TabPane>
        <TabPane tab="内容" key="2">
          <Content info={detailData} />
        </TabPane>
        <TabPane tab="请求头" key="3">
          <ReqHeader info={detailData} />
        </TabPane>
        <TabPane tab="Post数据源" key="4">
          <ReqPostBody info={detailData} />
        </TabPane>
        <TabPane tab="响应内容" key="5">
          <ResContent info={detailData} />
        </TabPane>
        <TabPane tab="异常" key="6">
          <Exception info={detailData} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default LogDetailTab;
