import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { useRequest } from 'ahooks';
import { getCompanyGroups, getReceiver } from '@/services/personnel-config/work-handover';
import { Checkbox } from 'antd';
import Recevier from '../recevier/index';
import styles from './index.less';
import EngineerTableList from '../engineer-table-list/index';
import { boolean } from 'umi/node_modules/@umijs/deps/compiled/yargs';
import { number } from 'yargs';

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

  const [checkAllisChecked, setCheckAllisChecked] = useState<boolean>(false);
  const [checkAllisIndeterminate, setCheckAllisIndeterminate] = useState<boolean>(false);
  /**
   * @flag
   * 事件触发标识
   * @state
   *  0 表示无任何操作
   *  1 表示取消全选
   *  2 表示全选
   */
  const [emitAll, setEmitAll] = useState<{flag: boolean, state: number}>({flag: false, state: 0});

  const onAllChange = () => {
    setEmitAll({
      flag: !emitAll?.flag,
      state: !checkAllisChecked || checkAllisIndeterminate ? 2 : 1
    })
  }

  return (
    <>
      <div className={styles.manageReceive}>
        <Checkbox checked={checkAllisChecked} indeterminate={checkAllisIndeterminate} onChange={() => onAllChange()}>全选</Checkbox>
        <Recevier
          userId={userId}
          clientCategory={2}
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
          emitAll={emitAll}
          setCheckAllisChecked={setCheckAllisChecked}
          setCheckAllisIndeterminate={setCheckAllisIndeterminate}
        />
      </div>
    </>
  );
};

export default ProjectManage;
