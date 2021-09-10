import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
// import { getCompanyGroups, getReceiver } from '@/services/personnel-config/work-handover';
import Recevier from '../recevier/index';
import TreeTable from '@/components/tree-table';
import CyTag from '@/components/cy-tag';
import styles from './index.less';

interface GroupIdentityParams {
  userId: string;
  receiverId: string | undefined;
  getReceiverId?: Dispatch<SetStateAction<string | undefined>>;
  setReceiverName?: Dispatch<SetStateAction<string>>;
  isFresh?: boolean;
  doneFlag?: boolean;
  setIsFresh?: Dispatch<SetStateAction<boolean>>;
  getGroupIds?: Dispatch<SetStateAction<string[]>>;
}

const GroupIdentity: React.FC<GroupIdentityParams> = (props) => {
  const {
    userId,
    getReceiverId,
    getGroupIds,
    isFresh,
    setIsFresh,
    receiverId,
    setReceiverName,
    doneFlag,
  } = props;

  const [tableSelectRows, setTableSelectRows] = useState<any>([]);

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFresh) {
      refresh();
      setTableSelectRows([]);
      setIsFresh?.(false);
    }
  }, [isFresh]);

  const columns = [
    {
      title: '部组名称',
      dataIndex: 'name',
      index: 'name',
      width: 240,
    },
    {
      title: '当前身份',
      dataIndex: 'id',
      index: 'id',
      render: (text: any, record: any) => {
        return '部组管理员';
      },
      width: 240,
    },
    {
      title: '部组成员',
      dataIndex: 'users',
      index: 'users',
      render: (text: any, record: any) => {
        return record.users.map((item: any) => {
          return (
            <CyTag key={item.value} className="mr7">
              {item.text}
            </CyTag>
          );
        });
      },
    },
  ];

  //交接刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  //处理获取部组Id
  const handleGroupIds = useMemo(() => {
    return tableSelectRows?.map((item: any) => {
      return item.id;
    });
  }, [tableSelectRows]);

  //传值
  useEffect(() => {
    getGroupIds?.(handleGroupIds);
  }, [tableSelectRows]);

  return (
    <>
      <div className={styles.identityHead}>
        <Recevier
          receiverId={receiverId}
          userId={userId}
          clientCategory={2}
          isCompanyGroupIdentity={true}
          changeVal={getReceiverId}
          setReceiverName={setReceiverName}
        />
      </div>
      <div className={styles.identityTable}>
        <TreeTable
          showButtonContent={false}
          ref={tableRef}
          getSelectData={(data) => setTableSelectRows(data)}
          columns={columns}
          url="/UserHandover/GetCompanyGroups"
          type="checkbox"
          params={{ userId: userId }}
          emptyContent={doneFlag ? '您已经交接完毕了~' : '暂无可交接的内容'}
          imgSrc={doneFlag ? 'finish' : 'empty'}
        />
      </div>
    </>
  );
};

export default GroupIdentity;
