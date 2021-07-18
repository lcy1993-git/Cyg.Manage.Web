import React, { Dispatch, SetStateAction } from 'react';
import Recevier from '../../../recevier/index';
import styles from './index.less';
import EngineerTableList from '../../../engineer-table-list/index';

interface ProsepectTableParams {
  userId: string;
  recevierId: string | undefined;
  setReceiverName?: Dispatch<SetStateAction<string>>;
  setEngineerIds?: Dispatch<SetStateAction<string[]>>;
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>;
  isFresh?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  getEngineerData?: Dispatch<SetStateAction<any[]>>;
}

const ProspectTable: React.FC<ProsepectTableParams> = (props) => {
  const {
    userId,
    recevierId,
    getReceiverId,
    setReceiverName,
    getEngineerData,
    setEngineerIds,
    isFresh,
    setIsFresh,
  } = props;
  return (
    <>
      <div className={styles.prospectReceive}>
        <Recevier
          userId={userId}
          clientCategory={2}
          isCompanyGroupIdentity={false}
          receiverId={recevierId}
          changeVal={getReceiverId}
          setReceiverName={setReceiverName}
        />
      </div>
      {/* <div> */}
        <EngineerTableList
          getEngineerData={getEngineerData}
          userId={userId}
          category={2}
          setEngineerIds={setEngineerIds}
          isFresh={isFresh}
          setIsFresh={setIsFresh}
        />
      {/* </div> */}
    </>
  );
};

export default ProspectTable;
