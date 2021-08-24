import { Tabs } from 'antd';
import React from 'react';
import Modules from '../module-tab';
import Attribute from '../attribute-tab';

const { TabPane } = Tabs;

// TODO 参数声明,不能是any
interface ModuleDetailTabProps {
  detailData: any;
}

const ModuleDetailTab: React.FC<ModuleDetailTabProps> = (props) => {
  const { detailData } = props;

  return (
    <>
      <Tabs className="normalTabs" tabBarGutter={25}>
        <TabPane tab="基本信息" key="1">
          <Modules baseInfo={detailData} />
        </TabPane>
        <TabPane tab="内容" key="2">
          <Attribute info={detailData} />
        </TabPane>
      </Tabs>
    </>
  );
};

export default ModuleDetailTab;
