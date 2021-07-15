import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { getCompanyGroups, getReceiver } from '@/services/personnel-config/work-handover';
import Recevier from '../recevier/index';
import { Checkbox } from 'antd';
import TreeTable from '@/components/tree-table';
import CyTag from '@/components/cy-tag';
import styles from './index.less';
import EngineerTableList from '../engineer-table-list/index';

interface ProjectManageParams {
  userId: string;
  recevierId: string | undefined;
}

const ProjectManage: React.FC<ProjectManageParams> = (props) => {
  const { userId, recevierId } = props;

  return (
    <>
      <div className={styles.manageReceive}>
        <Recevier
          userId={userId}
          clientCategory={2}
          isCompanyGroupIdentity={false}
          receiverId={recevierId}
        />
      </div>
      <div>
        <EngineerTableList userId={userId} category={1} />
      </div>
    </>
  );
};

export default ProjectManage;
