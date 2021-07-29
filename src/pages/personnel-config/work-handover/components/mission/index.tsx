import React, { Dispatch, SetStateAction } from 'react';
import { Tabs } from 'antd';
import styles from './index.less';
// import DesignTable from './components/design-table';
import ProspectTable from './components/prospect-table';
import DesignTable from './components/design-table';

const { TabPane } = Tabs;

interface MissionParams {
  userId: string;
  recevierId: string | undefined;
  setReceiverName?: Dispatch<SetStateAction<string>>;
  getProjectIds?: Dispatch<SetStateAction<string[]>>;
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>;
  isFresh?: boolean;
  doneFlag?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  setDoneFlag?: Dispatch<SetStateAction<boolean>>;
  changeTabKey?: Dispatch<SetStateAction<string>>;
  getEngineerData?: Dispatch<SetStateAction<any[]>>;
}

const MissionTab: React.FC<MissionParams> = (props) => {
  const {
    userId,
    recevierId,
    getReceiverId,
    getProjectIds,
    changeTabKey,
    isFresh,
    doneFlag,
    setIsFresh,
    setDoneFlag,
    setReceiverName,
  } = props;

  return (
    <div className={styles.missionTabs}>
      <Tabs
        className="normalTabs noMargin"
        onChange={(key: string) => {
          changeTabKey?.(key);
          getReceiverId?.(undefined);
          setReceiverName?.('');
          setDoneFlag?.(false);
        }}
      >
        <TabPane tab="勘察任务" key="prospect">
          <ProspectTable
            recevierId={recevierId}
            isFresh={isFresh}
            doneFlag={doneFlag}
            setIsFresh={setIsFresh}
            userId={userId}
            setReceiverName={setReceiverName}
            getReceiverId={getReceiverId}
            getProjectIds={getProjectIds}
          />
        </TabPane>
        <TabPane tab="设计任务" key="design">
          <DesignTable
            isFresh={isFresh}
            setIsFresh={setIsFresh}
            userId={userId}
            doneFlag={doneFlag}
            setReceiverName={setReceiverName}
            recevierId={recevierId}
            getReceiverId={getReceiverId}
            getProjectIds={getProjectIds}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default MissionTab;
