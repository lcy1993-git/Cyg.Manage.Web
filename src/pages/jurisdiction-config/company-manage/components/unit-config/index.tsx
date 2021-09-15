import { getHasMapData } from '@/services/material-config/inventory';
import { useControllableValue, useRequest } from 'ahooks';
import { Modal, Input, Button, Select, Table, message, Spin, Tabs } from 'antd';
import React, { useMemo, useRef, useState, SetStateAction, Dispatch } from 'react';
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import CommonTitle from '@/components/common-title';
import EmptyTip from '@/components/empty-tip';
// import { Resizable } from 'react-resizable';
// import { components, handleResize } from '@/components/resizable-table';

interface UnitConfigProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: () => void;
}

const { Search } = Input;
const { TabPane } = Tabs;

const UnitConfig: React.FC<UnitConfigProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [libTableSelectRow, setLibTableSelectRow] = useState<any[]>([]);

  const [hasMapTableShowData, setHasMapTableShowData] = useState<any[]>([]);
  const [mapTableSelectArray, setMapTableSelectArray] = useState<any[]>([]);

  // const [resizableColumns, setResizableColumns] = useState<object[]>([]);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const resourceTableRef = useRef<HTMLDivElement>(null);
  const {} = props;

  const { data: hasMapData = [], run: getMapData, loading } = useRequest(getHasMapData, {
    manual: true,
    // ready: !!inventoryOverviewId,
    // refreshDeps: [inventoryOverviewId, activeMaterialId, activeHasMapAreaId],
    onSuccess: () => {
      setHasMapTableShowData(hasMapData);
    },
  });

  /**可伸缩配置 */
  // const tableComponents = components;

  // const handleResize1 = (index: any) => (e: any, { size }) => {
  //   let columns = resourceLibColumns;
  //   columns = handleResize({
  //     width: size.width,
  //     index,
  //     columns,
  //   });
  //   setResizableColumns(columns);
  // };

  // const columns = resizableColumns.map((col, index) => ({
  //   ...col,
  //   onHeaderCell: (column: any) => ({
  //     width: column.width,
  //     onResize: handleResize1(index),
  //   }),
  // }));

  const resourceLibColumns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '公司名称',
      width: 180,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '管理员账号',
      width: 180,
    },
    {
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      title: '详细地址',
      width: 80,
    },
  ];

  const hasMapTableColumns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '公司名称',
      width: 180,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '管理员账号',
      width: 180,
    },
    {
      dataIndex: 'orderPrice',
      index: 'orderPrice',
      title: '详细地址',
      width: 80,
    },
  ];

  const resourceTableSearch = () => {
    if (resourceTableRef && resourceTableRef.current) {
      //@ts-ignore

      resourceTableRef.current.search();
    }
  };

  const resourceLibSearch = () => {
    return (
      <TableSearch width="208px">
        <Search
          value={searchKeyWord}
          placeholder="请输入公司名称/管理员账号"
          enterButton
          onSearch={() => resourceTableSearch()}
          onChange={(e) => setSearchKeyWord(e.target.value)}
        />
      </TableSearch>
    );
  };

  const resourceTableChangeEvent = async (data: any) => {
    setLibTableSelectRow(data);

    if (data && data.length > 0) {
      await getMapData({
        materialId: data[0]?.id,
        area: '-1',
      });
    }
  };

  const removeEvent = () => {
    if (mapTableSelectArray && mapTableSelectArray.length === 0) {
      message.warning('请先选择要移除的映射');
      return;
    }
    const copyArrayIds = [...mapTableSelectArray];
    const copyHasData = [...hasMapTableShowData];

    const newArray = copyHasData.filter((item) => !copyArrayIds.includes(item.id));

    setHasMapTableShowData(newArray);
    message.success('已移除');
    setMapTableSelectArray([]);
  };

  //添加映射
  const addMapEvent = () => {
    if (libTableSelectRow && libTableSelectRow.length === 0) {
      message.warning('请选择要添加映射的行');
      return;
    }
  };

  const hasMapSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setMapTableSelectArray(selectedRows.map((item) => item['id']));
    },
  };

  const saveEvent = async () => {};

  return (
    <>
      <Modal
        maskClosable={false}
        title="协作单位配置"
        visible={state as boolean}
        bodyStyle={{
          padding: '0px 10px 10px 10px',
          height: '800px',
          overflowY: 'auto',
          backgroundColor: '#F7F7F7',
        }}
        width="98%"
        footer={null}
        destroyOnClose
        centered
        onCancel={() => setState(false)}
      >
        <div className={styles.mapForm}>
          <div className={styles.resourceTable}>
            <Tabs defaultActiveKey="superior">
              <TabPane tab="上级公司" key="superior">
                <GeneralTable
                  size="middle"
                  ref={resourceTableRef}
                  defaultPageSize={20}
                  getSelectData={resourceTableChangeEvent}
                  columns={resourceLibColumns}
                  extractParams={{
                    keyWord: searchKeyWord,
                  }}
                  buttonLeftContentSlot={resourceLibSearch}
                  url="/Material/GetPageList"
                  requestSource="resource"
                />
              </TabPane>
              <TabPane tab="下级公司" key="subordinate">
                <GeneralTable
                  size="middle"
                  ref={resourceTableRef}
                  defaultPageSize={20}
                  getSelectData={resourceTableChangeEvent}
                  columns={resourceLibColumns}
                  extractParams={{
                    keyWord: searchKeyWord,
                  }}
                  buttonLeftContentSlot={resourceLibSearch}
                  url="/Material/GetPageList"
                  requestSource="resource"
                />
              </TabPane>
            </Tabs>
          </div>

          <div className={styles.currentMapTable}>
            <div className={styles.currentMapTableButtonContent}>
              <div className={styles.currentMapTableTitle}>
                <CommonTitle>添加公司</CommonTitle>
              </div>
              <div className={styles.addCompanySearch}>
                <TableSearch width="308px">
                  <Search
                    placeholder="请输入公司名称/管理员账号"
                    enterButton
                    //   onSearch={(value: any) => hasMapSearch(value)}
                  />
                </TableSearch>
                <div className={styles.buttonArea}>
                  <Button className="mr7" onClick={() => removeEvent()}>
                    移除
                  </Button>
                  <Button type="primary" onClick={() => addMapEvent()}>
                    添加
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.currentMapTableContent}>
              <Spin spinning={loading}>
                <Table
                  scroll={{ y: 547 }}
                  size="middle"
                  locale={{
                    emptyText: <EmptyTip className="pt20 pb20" />,
                  }}
                  dataSource={hasMapTableShowData}
                  bordered={true}
                  rowKey={'id'}
                  pagination={false}
                  rowSelection={{
                    type: 'checkbox',
                    columnWidth: '38px',
                    selectedRowKeys: mapTableSelectArray,
                    ...hasMapSelection,
                  }}
                  columns={hasMapTableColumns}
                />
              </Spin>
            </div>
            <div className={styles.hasMapAccount}>
              共<span className={styles.accountNumber}>{hasMapTableShowData.length}</span>条记录
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnitConfig;
