import React, { Dispatch, SetStateAction } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
// import DesignTable from './components/design-table';
import ProspectTable from './components/prospect-table';

const { TabPane } = Tabs;

interface MissionParams {
  userId: string;
  recevierId: string | undefined;
  setReceiverName?: Dispatch<SetStateAction<string>>;
  setEngineerIds?: Dispatch<SetStateAction<string[]>>;
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>;
  isFresh?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  getEngineerData?: Dispatch<SetStateAction<any[]>>;
}

const MissionTab: React.FC<MissionParams> = (props) => {
  const { userId, recevierId } = props;
  return (
    <div className={styles.missionTabs}>
      <Tabs className="normalTabs noMargin">
        <TabPane tab="勘察任务" key="prospect">
          <ProspectTable userId={userId} recevierId={recevierId} />
        </TabPane>
        <TabPane tab="设计任务" key="design">
          {/* <DesignTable /> */}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MissionTab;
