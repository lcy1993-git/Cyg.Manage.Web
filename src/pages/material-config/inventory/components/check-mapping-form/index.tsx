import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useRef, useState, useEffect } from 'react';
import EnumSelect from '@/components/enum-select';
import styles from './index.less';
import { CreateMethod } from '@/services/material-config/inventory';

import UrlSelect from '@/components/url-select';
interface CheckMappingParams {
  inventoryOverviewId: string;
  currentInv: object[];
}

const { Search } = Input;

const CheckMapping: React.FC<CheckMappingParams> = (props) => {
  const { inventoryOverviewId, currentInv } = props;

  const tableRef = useRef<HTMLDivElement>(null);
  const [createMethod, setCreateMethod] = useState('');

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const columns = [
    {
      title: '资源库物料编码',
      dataIndex: 'materialCode',
      index: 'materialCode',
      width: 160,
    },
    {
      title: '名称',
      dataIndex: 'resourceMaterial',
      index: 'resourceMaterial',
      width: 220,
    },
    {
      title: '规格型号',
      dataIndex: 'resourceMaterialSpec',
      index: 'resourceMaterialSpec',
      width: 220,
    },
    {
      title: '类别',
      dataIndex: 'category',
      index: 'category',
      width: 220,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      index: 'unit',
      width: 150,
    },
    {
      title: '协议库存映射物料',
      dataIndex: 'area',
      index: 'area',
      width: 180,
    },
    {
      title: '协议库存所在地区',
      dataIndex: 'area',
      index: 'area',
      width: 180,
    },
    {
      title: '需求公司',
      dataIndex: 'demandCompany',
      index: 'demandCompany',
      width: 360,
    },
    {
      title: '订单净价',
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      width: 180,
    },
    {
      title: '计量单位',
      dataIndex: 'measurementUnit',
      index: 'measurementUnit',
      width: 180,
    },
    {
      title: '创建方式',
      dataIndex: 'howToCreateText',
      index: 'howToCreateText',
      width: 150,
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

  const searchByMethod = (value: any) => {
    setCreateMethod(value);
    search();
  };

  useEffect(() => {
    searchByMethod(createMethod);
  }, [createMethod]);

  const tableLeftSlot = (
    <div className={styles.searchArea}>
      <TableSearch label="关键词" width="230px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => search()}
          enterButton
          placeholder="关键词"
        />
      </TableSearch>
      <TableSearch className={styles.createMethod} marginLeft="20px" label="创建方式" width="220px">
        <EnumSelect
          allowClear
          allLabel="-选择创建方式-"
          enumList={CreateMethod}
          placeholder="请选择创建方式"
          onChange={(value: any) => searchByMethod(value)}
        ></EnumSelect>
      </TableSearch>
      <TableSearch
        className={styles.inventorySelect}
        marginLeft="20px"
        label="当前协议库存"
        width="400px"
      >
        <UrlSelect
          disabled
          defaultValue={inventoryOverviewId}
          allowClear
          showSearch
          defaultData={currentInv}
          titleKey="title"
          valueKey="value"
          placeholder="请选择"
        />
      </TableSearch>
    </div>
  );

  const tableRightSlot = (
    <>
      <Button className="mr7" type="primary" onClick={() => editMapping()}>
        <EditOutlined />
        编辑映射
      </Button>
    </>
  );
  const editMapping = () => {};

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => tableLeftSlot}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/Inventory/GetMaterialInventoryMappingList"
        columns={columns}
        type="radio"
        requestSource="resource"
        tableTitle="协议库存物料映射全表查看"
        extractParams={{
          inventoryOverviewId: inventoryOverviewId,
          keyWord: searchKeyWord,
          howToCreate: createMethod,
        }}
      />
    </div>
  );
};

export default CheckMapping;
