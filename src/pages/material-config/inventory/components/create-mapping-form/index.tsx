import React, { useRef, useState } from 'react';
import { useControllableValue } from 'ahooks';
import { Modal, Input, Button, Select, message } from 'antd';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
// import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';

const { Search } = Input;

interface InventoryTableParams {
  areaOptions: { label: string; value: string }[];
  inventoryOverviewId: string;
  materialId: string;
  changeEvent: (value: object[]) => void;
  onChange: Dispatch<SetStateAction<boolean>>;
  visible: boolean;
  hasMapData: any[];
}

const InventoryTable: React.FC<InventoryTableParams> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const { areaOptions, inventoryOverviewId, materialId, changeEvent, hasMapData } = props;
  const inventoryTableRef = useRef<HTMLDivElement>(null);
  const [inventoryKeyWord, setInventoryKeyWord] = useState<string>('');
  const [activeInventoryAreaId, setActiveInventoryAreaId] = useState<string>('-1');

  const [inventorySelectArray, setInventorySelectArray] = useState<any[]>([]);

  const inventoryTableSearch = () => {
    return (
      <div className="flex">
        <TableSearch width="208px">
          <Search
            value={inventoryKeyWord}
            placeholder="物料编号/需求公司"
            enterButton
            onSearch={() => inventorySearch()}
            onChange={(e) => setInventoryKeyWord(e.target.value)}
          />
        </TableSearch>
        <TableSearch width="240px">
          <Select
            options={areaOptions}
            placeholder="区域"
            value={activeInventoryAreaId}
            onChange={(value) => inventoryTableSelectChange(value as string)}
            style={{ width: '100%' }}
          />
        </TableSearch>
      </div>
    );
  };

  const inventoryTableSelectChange = (value: string) => {
    setActiveInventoryAreaId(value as string);
    if (inventoryTableRef && inventoryTableRef.current) {
      // @ts-ignore
      inventoryTableRef.current.searchByParams({
        area: value,
        inventoryOverviewId: inventoryOverviewId,
        materialId: materialId,
        keyWord: inventoryKeyWord,
      });
    }
  };

  const inventorySearch = () => {
    if (inventoryTableRef && inventoryTableRef.current) {
      //@ts-ignore
      inventoryTableRef.current.search();
    }
  };

  const inventoryTableAddButton = () => {
    return (
      <Button type="primary" onClick={() => addEvent()}>
        确认添加
      </Button>
    );
  };

  const reset = () => {
    if (inventoryTableRef && inventoryTableRef.current) {
      //@ts-ignore
      inventoryTableRef.current.reset();
    }
  };

  const addEvent = () => {
    const copyData = [...inventorySelectArray];
    const copyHasMapData = [...hasMapData];

    copyData.forEach((item) => {
      if (copyHasMapData.findIndex((ite) => ite.id === item.id) === -1) {
        copyHasMapData.push({ ...item, type: 'add' });
      }
    });
    changeEvent(copyHasMapData);
    message.success('导入成功');
    setState(false);
    reset();
  };

  const inventoryTableColumns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '物料编号',
      width: 150,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '物料描述',
      width: 180,
    },
    {
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      title: '订单净价',
      width: 80,
    },
    {
      dataIndex: 'area',
      index: 'area',
      title: '区域',
      width: 100,
    },
    {
      dataIndex: 'demandCompany',
      index: 'demandCompany',
      title: '需求公司',
      width: 140,
    },
    {
      dataIndex: 'measurementUnit',
      index: 'measurementUnit',
      title: '计量单位',
      width: 80,
    },
  ];

  return (
    <>
      <Modal
        maskClosable={false}
        centered
        title="添加-映射"
        footer=""
        onCancel={() => setState(false)}
        visible={state as boolean}
        width="72%"
        bodyStyle={{ height: '738px', overflowY: 'auto' }}
      >
        <GeneralTable
          size="middle"
          scroll={{ y: 480 }}
          ref={inventoryTableRef}
          getSelectData={(data) => setInventorySelectArray(data)}
          buttonRightContentSlot={inventoryTableAddButton}
          type="checkbox"
          columns={inventoryTableColumns}
          buttonLeftContentSlot={inventoryTableSearch}
          url="/Inventory/GetMappingInventoryList"
          requestSource="resource"
          extractParams={{
            inventoryOverviewId: inventoryOverviewId,
            area: activeInventoryAreaId,
            materialId: materialId,
            keyWord: inventoryKeyWord,
          }}
          tableTitle="协议库存表"
        />
      </Modal>
    </>
  );
};

export default InventoryTable;
