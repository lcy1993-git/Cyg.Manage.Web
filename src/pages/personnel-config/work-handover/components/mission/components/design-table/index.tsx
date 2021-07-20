import React, { Dispatch, SetStateAction, useState } from 'react';
import Recevier from '../../../recevier/index';
import EngineerTableList from '../../../engineer-table-list/index';

interface ProsepectTableParams {
  userId: string;
  recevierId: string | undefined;
  setReceiverName?: Dispatch<SetStateAction<string>>;
  getProjectIds?: Dispatch<SetStateAction<string[]>>;
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>;
  isFresh?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  getEngineerData?: Dispatch<SetStateAction<any[]>>;
}

const DesignTable: React.FC<ProsepectTableParams> = (props) => {
  const {
    userId,
    recevierId,
    getReceiverId,
    setReceiverName,
    getEngineerData,
    isFresh,
    setIsFresh,
    getProjectIds,
  } = props;
  return (
    <>
      <div style={{ padding: '20px' }}>
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
        fieldFlag={false}
        checkboxSet={true}
        getEngineerData={getEngineerData}
        userId={userId}
        category={3}
        isFresh={isFresh}
        setIsFresh={setIsFresh}
        getProjectIds={getProjectIds}
      />
      {/* </div> */}
    </>
  );
};

export default DesignTable;
