import GeneralTable from '@/components/general-table';
import TableStatus from '@/components/table-status';
import TableSearch from '@/components/table-search';
import { Input, Button, message } from 'antd';
import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  batchAddAuthorization,
  batchRemoveAuthorization,
} from '@/services/jurisdiction-config/role-permissions';
import { Popconfirm } from 'antd';

interface ExtractParams {
  templateId: string;
}

interface RoleAuthorizationProps {
  extractParams: ExtractParams;
  onChange: () => void;
}

const { Search } = Input;

const RoleAuthorization: React.FC<RoleAuthorizationProps> = (props) => {
  const tableRef = useRef<HTMLDivElement>(null);

  const { extractParams, onChange } = props;

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [selectRows, setSelectRows] = useState<any[]>([]);

  const columns = [
    {
      title: '用户名',
      dataIndex: 'roleName',
      index: 'roleName',
    },
    {
      title: '授权类型',
      dataIndex: 'roleTypeText',
      index: 'roleTypeText',
      render: (text: string, record: any) => {
        switch (record.roleType) {
          case 1:
            return <TableStatus color="gray">{record.roleTypeText}</TableStatus>;
          case 2:
            return <TableStatus color="orange">{record.roleTypeText}</TableStatus>;
          default:
            return null;
        }
      },
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
      authorizeType: 1,
      objectIds: batchObjectIds,
    });
    refresh();
    onChange?.();
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
      authorizeType: 1,
      objectIds: batchObjectIds,
    });
    refresh();
    onChange?.();
    message.success('授权移除成功');
  };

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/AuthTemplate/GetRoles"
        columns={columns}
        type="checkbox"
        getSelectData={(data) => setSelectRows(data)}
        extractParams={{ ...extractParams, keyWord: searchKeyWord }}
      />
    </div>
  );
};

export default RoleAuthorization;
