import GeneralTable from '@/components/general-table';
import { Input, Button, Modal, message, Spin } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

import { deleteResourceInventoryMap } from '@/services/material-config/inventory';
// import UrlSelect from '@/components/url-select';

import { ImportOutlined } from '@ant-design/icons';

import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import MapLibModal from '../map-lib-modal';
import CheckMapping from '../check-mapping-form';

const HasMapModal: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  // const [companyWord, setCompanyWord] = useState<string>('');
  const [mapLibModalVisible, setMapLibModalVisible] = useState<boolean>(false);
  const [mappingListModalVisible, setMappingListModalVisible] = useState<boolean>(false);
  const [editMapListModalVisible, setEditMapListModalVisible] = useState<boolean>(false);

  const [mappingId, setMappingId] = useState<string>('');
  const [inventoryId, setInventoryId] = useState<string>('');
  const [inventoryName, setInventoryName] = useState<string>('');

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {/* {buttonJurisdictionArray?.includes('inventory-import') && ( */}
        <Button className="mr7" onClick={() => createMapEvent()}>
          <ImportOutlined />
          新建映射
        </Button>
        {/* )} */}
        {/* {buttonJurisdictionArray?.includes('inventory-check-mapping') && ( */}
        <Button className="mr7" onClick={() => deleteMapEvent()}>
          删除映射
        </Button>
        {/* )} */}

        {/* {buttonJurisdictionArray?.includes('inventory-create-mapping') && ( */}
        <Button className="mr7" onClick={() => editMapEvent()}>
          编辑映射
        </Button>
        {/* )} */}
        {/* {buttonJurisdictionArray?.includes('inventory-create-mapping') && ( */}
        <Button className="mr7" onClick={() => checkMapEvent()}>
          查看映射
        </Button>
        {/* )} */}
      </div>
    );
  };

  //映射操作
  const createMapEvent = () => {
    setMapLibModalVisible(true);
  };

  const deleteMapEvent = async () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择要删除的映射');
      return;
    }
    await deleteResourceInventoryMap({ mappingId: tableSelectRows[0].id });
    message.success('删除映射成功');
    setTableSelectRow([]);
    refresh();
  };

  const editMapEvent = () => {};

  const checkMapEvent = () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择要查看的映射');
      return;
    }
    setInventoryId(tableSelectRows[0].inventoryOverviewId);
    setInventoryName(tableSelectRows[0].name);
    setMappingId(tableSelectRows[0].id);
    setMappingListModalVisible(true);
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const columns = [
    {
      dataIndex: 'resourceLibName',
      index: 'resourceLibName',
      title: '资源库名称',
      width: 180,
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '协议库名称',
      width: 180,
    },
    {
      dataIndex: 'supplier',
      index: 'supplier',
      title: '状态',
      width: 400,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      width: 180,
    },
  ];

  return (
    <>
      <GeneralTable
        ref={tableRef}
        needCommonButton={true}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/Inventory/GetMappingInventoryOverviewPageList"
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="已映射列表"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />

      <MapLibModal
        visible={mapLibModalVisible}
        onChange={setMapLibModalVisible}
        changeFinishEvent={refresh}
      />

      <Modal
        bodyStyle={{ height: 820, overflowY: 'auto' }}
        footer=""
        centered
        width="96%"
        title="查看映射关系"
        visible={mappingListModalVisible}
        onCancel={() => setMappingListModalVisible(false)}
      >
        <CheckMapping
          mappingId={mappingId}
          inventoryOverviewId={inventoryId}
          invName={inventoryName}
        />
      </Modal>
    </>
  );
};

export default HasMapModal;
