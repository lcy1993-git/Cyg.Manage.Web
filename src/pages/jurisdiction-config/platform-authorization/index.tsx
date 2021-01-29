import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input } from 'antd';
import React, { useState } from 'react';

const { Search } = Input;

const PlatformAuthorization: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      index: 'isDisable',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
    },
  ];

<<<<<<< HEAD
    const searchElement = () => {
        return (
            
            <TableSearch label="关键词" width="203px">
                <Search value={searchKeyWord} onSearch={() => search({keyWord: searchKeyWord})} onChange={(e) => setSearchKeyWord(e.target.value)} placeholder="模板名称" enterButton />
            </TableSearch>
        )
    }

    const refresh = () => {
        if(tableRef && tableRef.current) {
            //@ts-ignore
            tableRef.current?.refresh();
        }
    }
=======
  const searchElement = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onSearch={() => search({ keyWord: searchKeyWord })}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          placeholder="模板名称"
          enterButton
        />
      </TableSearch>
    );
  };
>>>>>>> f90a1347954d305c642ba25dfdfdf9562392885a

  const refresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const search = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search(params);
    }
  };

  const buttonElement = () => {
    return (
      <div>
        <Button type="primary" className="mr7">
          添加
        </Button>
        <Button className="mr7">编辑</Button>
        <Button className="mr7">删除</Button>
        <Button className="mr7">分配功能模块</Button>
        <Button className="mr7">授权</Button>
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={buttonElement}
        url="/AuthTemplate/GetPagedList"
        columns={columns}
      />
    </PageCommonWrap>
  );
};

export default PlatformAuthorization;
