import GeneralTable from '@/components/general-table';
import TableStatus from '@/components/table-status';
import TableSearch from '@/components/table-search';
import { Input, Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  batchAddAuthorization,
  batchRemoveAuthorization,
} from '@/services/jurisdiction-config/platform-authorization';
import { Popconfirm } from 'antd';

interface ExtractParams {
  templateId: string;
}

interface UserAuthorizationProps {
  extractParams: ExtractParams;
}

const { Search } = Input;

const UserAuthorization: React.FC<UserAuthorizationProps> = (props) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const { extractParams } = props;

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [selectRows, setSelectRows] = useState<any[]>([]);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      index: 'userName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
      width: 160,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      index: 'nickName',
      width: 220,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      index: 'namec',
      width: 220,
    },
    {
      title: '角色',
      dataIndex: 'roleTypeText',
      index: 'roleTypeText',
      render: (text: string, record: any) => {
        switch (record.userType) {
          case 1:
            return <TableStatus color="gray">{record.userTypeText}</TableStatus>;
          case 2:
            return <TableStatus color="orange">{record.userTypeText}</TableStatus>;
          default:
            return <TableStatus color="gray">{record.userTypeText}</TableStatus>;
        }
      },
      width: 120,
    },
    {
      title: '授权状态',
      dataIndex: 'isAuthorized',
      index: 'isAuthorized',
      width: 120,
      render: (text: string, record: any) => {
        if (record.isAuthorized) {
          return <span className="colorPrimary">已授权</span>;
        } else {
          return <span className="colorRed">未授权</span>;
        }
      },
    },
  ];

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.search();
    }
  };

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.refresh();
    }
  };

  const tableLeftSlot = (
    <TableSearch label="关键词" width="230px">
      <Search
        value={searchKeyWord}
        onChange={(e) => setSearchKeyWord(e.target.value)}
        onSearch={() => search()}
        enterButton
        placeholder="关键词"
      />
    </TableSearch>
  );

  const tableRightSlot = (
    <>
      <Button className="mr7" type="primary" onClick={() => batchAddAuthorizationEvent()}>
        <PlusOutlined />
        批量授权
      </Button>
      <Popconfirm
        placement="top"
        title={'确认进行批量移除授权吗'}
        onConfirm={() => batchRemoveAuthorizationEvent()}
        okText="确认"
        cancelText="取消"
      >
        <Button className="mr7">批量移除</Button>
      </Popconfirm>
    </>
  );

  const batchAddAuthorizationEvent = async () => {
    if (selectRows.length === 0) {
      message.error('请至少选中一条数据');
      return;
    }
    const batchObjectIds = selectRows.map((item) => item.id);

    const { templateId } = extractParams;

    await batchAddAuthorization({
      templateId,
      authorizeType: 2,
      objectIds: batchObjectIds,
    });
    refresh();
    message.success('授权成功');
  };

  const batchRemoveAuthorizationEvent = async () => {
    if (selectRows.length === 0) {
      message.error('请至少选中一条数据');
      return;
    }
    const batchObjectIds = selectRows.map((item) => item.id);

    const { templateId } = extractParams;

    await batchRemoveAuthorization({
      templateId,
      authorizeType: 2,
      objectIds: batchObjectIds,
    });
    refresh();
    message.success('授权移除成功');
  };

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/AuthTemplate/GetUsers"
        columns={columns}
        type="checkbox"
        getSelectData={(data) => setSelectRows(data)}
        extractParams={{ ...extractParams, keyWord: searchKeyWord }}
      />
    </div>
  );
};

export default UserAuthorization;
