import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { getCompanyGroups, getReceiver } from '@/services/personnel-config/work-handover';
import Recevier from '../recevier/index';
import styles from './index.less';
import EngineerTableList from '../engineer-table-list/index';

interface ProjectManageParams {
  userId: string;
  recevierId: string | undefined;
  setReceiverName?: Dispatch<SetStateAction<string>>;
  setEngineerIds?: Dispatch<SetStateAction<string[]>>;
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>;
  isFresh?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  getEngineerData?: Dispatch<SetStateAction<any[]>>;
}

const ProjectManage: React.FC<ProjectManageParams> = (props) => {
  const {
    userId,
    recevierId,
    setReceiverName,
    setEngineerIds,
    getReceiverId,
    isFresh,
    setIsFresh,
    getEngineerData,
  } = props;

  return (
    <>
      <div className={styles.manageReceive}>
        <Recevier
          userId={userId}
          clientCategory={2}
          isCompanyGroupIdentity={false}
          receiverId={recevierId}
          changeVal={getReceiverId}
          setReceiverName={setReceiverName}
        />
      </div>
      <div>
        <EngineerTableList
          fieldFlag={true}
          getEngineerData={getEngineerData}
          userId={userId}
          category={1}
          setEngineerIds={setEngineerIds}
          isFresh={isFresh}
          setIsFresh={setIsFresh}
        />
      </div>
    </>
  );
};

export default ProjectManage;
