import { useControllableValue } from 'ahooks';
import { Modal, Input, Button, message, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import MapRemarkModal from '../map-remark-modal';

interface MapLibModalParams {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: () => void;
}

const { Search } = Input;

const MapLibModal: React.FC<MapLibModalParams> = (props) => {
  const { changeFinishEvent } = props;
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [libTableSelectRows, setLibTableSelectRow] = useState<any[]>([]);
  const [invTableSelectRows, setInvTableSelectRow] = useState<any[]>([]);
  const [remarkModalVisible, setRemarkModalVisible] = useState<boolean>(false);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [searchInvKeyWord, setSearchInvKeyWord] = useState<string>('');

  const resourceTableRef = useRef<HTMLDivElement>(null);
  const inventoryTableRef = useRef<HTMLDivElement>(null);

  const resourceLibColumns = [
    {
      dataIndex: 'id',
      index: 'id',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'libName',
      index: 'libName',
      title: '名称',
    },
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
  ];

  const inventoryColumns = [
    {
      dataIndex: 'id',
      index: 'id',
      title: '编号',
      width: '33.33%',
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '名称',
    },
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
  ];

  //搜索
  const resourceTableSearch = () => {
    if (resourceTableRef && resourceTableRef.current) {
      //@ts-ignore

      resourceTableRef.current.search();
    }
  };
  const InventoryTableSearch = () => {
    if (resourceTableRef && resourceTableRef.current) {
      //@ts-ignore

      inventoryTableRef.current.search();
    }
  };

  const resourceLibSearch = () => {
    return (
      <TableSearch width="208px">
        <Search
          value={searchKeyWord}
          placeholder="搜索/资源库名称"
          enterButton
          onSearch={() => resourceTableSearch()}
          onChange={(e) => setSearchKeyWord(e.target.value)}
        />
      </TableSearch>
    );
  };

  const inventorySearch = () => {
    return (
      <TableSearch width="208px">
        <Search
          value={searchInvKeyWord}
          placeholder="搜索/协议库存名称"
          enterButton
          onSearch={() => InventoryTableSearch()}
          onChange={(e) => setSearchInvKeyWord(e.target.value)}
        />
      </TableSearch>
    );
  };

  const mapLibEvent = async () => {
    if (libTableSelectRows && libTableSelectRows.length === 0) {
      message.warning('未选择资源库');
      return;
    }
    if (invTableSelectRows && invTableSelectRows.length === 0) {
      message.warning('未选择协议库存');
      return;
    }
    setRemarkModalVisible(true);
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="映射资源库"
        visible={state as boolean}
        bodyStyle={{
          padding: '0px 10px 10px 10px',
          height: '800px',
          overflowY: 'auto',
          backgroundColor: '#F7F7F7',
        }}
        width="86%"
        destroyOnClose
        centered
        footer={[
          <Button
            key="cancle"
            onClick={() => {
              setState(false);
              setLibTableSelectRow([]);
              setInvTableSelectRow([]);
            }}
          >
            关闭
          </Button>,
          <Button key="save" type="primary" onClick={() => mapLibEvent()}>
            映射
          </Button>,
        ]}
        onCancel={() => {
          setState(false);
          setLibTableSelectRow([]);
          setInvTableSelectRow([]);
        }}
      >
        <div className={styles.mapForm}>
          <div className={styles.resourceTable}>
            <GeneralTable
              ref={resourceTableRef}
              defaultPageSize={20}
              columns={resourceLibColumns}
              extractParams={{
                keyWord: searchKeyWord,
              }}
              getSelectData={(data) => setLibTableSelectRow(data)}
              buttonLeftContentSlot={resourceLibSearch}
              url="/ResourceLib/GetPageList"
              requestSource="resource"
              tableTitle="资源库列表"
            />
          </div>

          <div className={styles.currentMapTable}>
            <div className={styles.currentMapTableContent}>
              <GeneralTable
                type="checkbox"
                ref={inventoryTableRef}
                defaultPageSize={20}
                columns={inventoryColumns}
                extractParams={{
                  keyWord: searchInvKeyWord,
                }}
                buttonLeftContentSlot={inventorySearch}
                getSelectData={(data) => setInvTableSelectRow(data)}
                url="/Inventory/GetInventoryOverviewPageList"
                requestSource="resource"
                tableTitle="协议库存列表"
              />
            </div>
          </div>
        </div>
        {/* </Spin> */}
      </Modal>
      <MapRemarkModal
        refreshEvent={changeFinishEvent}
        visible={remarkModalVisible}
        onChange={setRemarkModalVisible}
        libId={libTableSelectRows[0]?.id}
        invIds={invTableSelectRows?.map((item) => item.id)}
      />
    </>
  );
};

export default MapLibModal;
