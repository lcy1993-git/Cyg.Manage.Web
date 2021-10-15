import GeneralTable from '@/components/general-table';
import { Button, Modal, message, Popconfirm } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

import { deleteResourceInventoryMap } from '@/services/material-config/inventory';

import { ImportOutlined } from '@ant-design/icons';

// import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import MapLibModal from '../map-lib-modal';
import CheckMapping from '../check-mapping-form';
import CreateMap from '../create-map';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import ModalConfirm from '@/components/modal-confirm';
const buttonJurisdictionArray = useGetButtonJurisdictionArray();

const HasMapModal: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  // const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  // const [companyWord, setCompanyWord] = useState<string>('');
  const [mapLibModalVisible, setMapLibModalVisible] = useState<boolean>(false);
  const [mappingListModalVisible, setMappingListModalVisible] = useState<boolean>(false);
  const [editMapListModalVisible, setEditMapListModalVisible] = useState<boolean>(false);

  const [mappingId, setMappingId] = useState<string>('');
  const [inventoryId, setInventoryId] = useState<string>('');
  const [libId, setLibId] = useState<string>('');
  const [inventoryName, setInventoryName] = useState<string>('');
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('new-mapping') && (
          <Button className="mr7" type="primary" onClick={() => createMapEvent()}>
            <ImportOutlined />
            新建映射
          </Button>
        )}
        {buttonJurisdictionArray?.includes('edit-mapping') && (
          <Button className="mr7" onClick={() => editMapEvent()}>
            编辑映射
          </Button>
        )}
        {buttonJurisdictionArray?.includes('delete-mapping') && (
          <ModalConfirm
            changeEvent={deleteMapEvent}
            selectData={tableSelectRows}
            title="删除映射"
          />
        )}
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
    setTableSelectRows([]);
    refresh();
  };

  const editMapEvent = () => {
    if (tableSelectRows && tableSelectRows.length === 0) {
      message.warning('请选择要编辑的映射');
      return;
    }
    setMappingId(tableSelectRows[0].id);
    setInventoryId(tableSelectRows[0].inventoryOverviewId);
    setLibId(tableSelectRows[0].resourceLibId);
    setEditMapListModalVisible(true);
  };

  const checkMapEvent = (inventoryOverviewId: string, name: string, mappingId: string) => {
    setInventoryId(inventoryOverviewId);
    setInventoryName(name);
    setMappingId(mappingId);
    setMappingListModalVisible(true);
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // const resetEvent = () => {
  //   if (tableRef && tableRef.current) {
  //     // @ts-ignore
  //     tableRef.current.reset();
  //   }
  // };

  const columns = [
    {
      dataIndex: 'resourceLibName',
      index: 'resourceLibName',
      title: '资源库名称',
      width: 240,
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('check-inventory-mapping') && (
              <span
                onClick={() => checkMapEvent(record.inventoryOverviewId, record.name, record.id)}
                className={styles.checkHasMap}
              >
                {record.resourceLibName}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('check-inventory-mapping') && (
              <span>{record.resourceLibName}</span>
            )}
          </>
        );
      },
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '协议库名称',
      width: 240,
    },
    {
      dataIndex: 'editor',
      index: 'editor',
      title: '编辑人',
      width: 280,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
    },
  ];

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/Inventory/GetMappingInventoryOverviewPageList"
        getSelectData={(data) => setTableSelectRows(data)}
        tableTitle="已映射列表"
        type="radio"
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
        destroyOnClose
      >
        <CheckMapping
          mappingId={mappingId}
          inventoryOverviewId={inventoryId}
          invName={inventoryName}
        />
      </Modal>

      <CreateMap
        visible={editMapListModalVisible}
        onChange={setEditMapListModalVisible}
        mappingId={mappingId}
        inventoryOverviewId={inventoryId}
        libId={libId}
      />
    </>
  );
};

export default HasMapModal;
