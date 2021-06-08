import { getAreaList, getHasMapData, saveMapData } from '@/services/material-config/inventory';
import { useControllableValue, useRequest } from 'ahooks';
import { Modal, Input, Button, Select, Table, message, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import CommonTitle from '@/components/common-title';
import EmptyTip from '@/components/empty-tip';
import InventoryTable from '../create-mapping-form';
// import { Resizable } from 'react-resizable';
// import { components, handleResize } from '@/components/resizable-table';

interface CreateMapProps {
  inventoryOverviewId?: string;
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  changeFinishEvent?: () => void;
  mappingId?: string;
  libId?: string;
}

const { Search } = Input;

const CreateMap: React.FC<CreateMapProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [activeMaterialId, setActiveMaterialId] = useState<string>('');
  const [libTableSelectRows, setLibTableSelectRow] = useState<any[]>([]);

  const [activeHasMapAreaId, setActiveHasMapAreaId] = useState<string>('-1');
  const [hasMapTableShowData, setHasMapTableShowData] = useState<any[]>([]);
  const [mapTableSelectArray, setMapTableSelectArray] = useState<any[]>([]);
  // const [resizableColumns, setResizableColumns] = useState<object[]>([]);

  const [addMapTableVisible, setAddMapTableVisible] = useState<boolean>(false);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const resourceTableRef = useRef<HTMLDivElement>(null);
  const inventoryTableRef = useRef<HTMLDivElement>(null);
  const { inventoryOverviewId = '', mappingId, libId = '' } = props;

  const { data: areaList = [] } = useRequest(() => getAreaList(inventoryOverviewId), {
    ready: !!inventoryOverviewId,
    refreshDeps: [inventoryOverviewId],
  });

  const { data: hasMapData = [], run: getMapData, loading } = useRequest(
    () =>
      getHasMapData({
        inventoryOverviewId: inventoryOverviewId,
        mappingId: mappingId,
        materialId: activeMaterialId,
        area: activeHasMapAreaId,
      }),
    {
      ready: !!inventoryOverviewId,
      refreshDeps: [inventoryOverviewId, activeMaterialId, activeHasMapAreaId],
      onSuccess: () => {
        setHasMapTableShowData(hasMapData);
      },
    },
  );

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

  const areaOptions = useMemo(() => {
    const copyList = JSON.parse(JSON.stringify(areaList));
    copyList.unshift('全部区域');
    return copyList.map((item: any) => ({
      label: item === '' ? '无' : item,
      value: item === '全部区域' ? '-1' : item,
    }));
  }, [JSON.stringify(areaList)]);

  const resourceLibColumns = [
    {
      dataIndex: 'materialId',
      index: 'materialId',
      title: '编号',
      width: 100,
    },
    {
      dataIndex: 'category',
      index: 'category',
      title: '类型',
      width: 100,
    },
    {
      dataIndex: 'materialName',
      index: 'materialName',
      title: '名称',
      width: 200,
    },
    {
      dataIndex: 'spec',
      index: 'spec',
      title: '规格型号',
      width: 240,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 80,
    },
    {
      dataIndex: 'pieceWeight',
      index: 'pieceWeight',
      title: '单重(kg)',
      width: 100,
    },
    {
      dataIndex: 'unitPrice',
      index: 'unitPrice',
      title: '单价(元)',
      width: 100,
    },

    {
      dataIndex: 'materialType',
      index: 'materialType',
      title: '类别',
      width: 140,
    },
  ];

  const hasMapTableColumns = [
    {
      dataIndex: 'materialCode',
      index: 'materialCode',
      title: '物料编号',
      width: 180,
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
      width: 80,
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
    {
      dataIndex: 'howToCreate',
      index: 'howToCreate',
      title: '创建方式',
      width: 80,
      render: (text: any, record: any) => {
        return record.howToCreateText;
      },
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
          placeholder="物料编号/名称"
          enterButton
          onSearch={() => resourceTableSearch()}
          onChange={(e) => setSearchKeyWord(e.target.value)}
        />
      </TableSearch>
    );
  };

  //当前映射过滤 --unfinished--
  const hasMapSearch = (value: any) => {
    hasMapTableShowData.filter((item) => {
      if (item.demandCompany.indexOf(value)) {
        return {
          ...item,
        };
      }
    });
  };

  const resourceTableChangeEvent = (data: any) => {
    setLibTableSelectRow(data);
    if (data && data.length > 0) {
      setActiveMaterialId(data[0].id);
      if (inventoryTableRef && inventoryTableRef.current) {
        // @ts-ignore
        inventoryTableRef.current.searchByParams({
          materialId: data[0].id,
          inventoryOverviewId,
          area: '-1',
        });
      }
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
    if (libTableSelectRows && libTableSelectRows.length === 0) {
      message.warning('请选择要添加映射的行');
      return;
    }
    setAddMapTableVisible(true);
  };

  const hasMapSelection = {
    onChange: (values: any[], selectedRows: any[]) => {
      setMapTableSelectArray(selectedRows.map((item) => item['id']));
    },
  };

  const saveEvent = async () => {
    // 相比之前的数据，多出来的是增加的， 少的就是减少的
    const copyHasMapData = [...hasMapData];
    const copyHasShowMapData = [...hasMapTableShowData];

    const checkedIdList = copyHasShowMapData
      .filter((item) => copyHasMapData.findIndex((ite) => item.id === ite.id) === -1)
      .map((item) => item.id);
    const uncheckedIdList = copyHasMapData
      .filter((item) => copyHasShowMapData.findIndex((ite) => item.id === ite.id) === -1)
      .map((item) => item.id);

    await saveMapData({
      inventoryOverviewId,
      materialId: activeMaterialId,
      mappingId: mappingId,
      checkedIdList,
      uncheckedIdList,
    });
    message.success('信息保存成功');
    getMapData();
  };

  return (
    <>
      <Modal
        maskClosable={false}
        title="编辑映射"
        visible={state as boolean}
        bodyStyle={{
          padding: '0px 10px 10px 10px',
          height: '800px',
          overflowY: 'auto',
          backgroundColor: '#F7F7F7',
        }}
        width="98%"
        destroyOnClose
        centered
        footer={[
          <Button
            key="cancle"
            onClick={() => {
              setState(false);
              setActiveMaterialId('');
              setHasMapTableShowData([]);
            }}
          >
            关闭
          </Button>,
          <Button key="save" type="primary" onClick={() => saveEvent()}>
            保存
          </Button>,
        ]}
        onCancel={() => setState(false)}
      >
        <div className={styles.mapForm}>
          <div className={styles.resourceTable}>
            <GeneralTable
              scroll={{ y: 547 }}
              size="middle"
              ref={resourceTableRef}
              defaultPageSize={20}
              getSelectData={resourceTableChangeEvent}
              columns={resourceLibColumns}
              extractParams={{
                resourceLibId: libId,
                keyWord: searchKeyWord,
              }}
              buttonLeftContentSlot={resourceLibSearch}
              url="/Material/GetPageList"
              requestSource="resource"
              tableTitle="资源库列表"
            />
          </div>

          <div className={styles.currentMapTable}>
            <div className={styles.currentMapTableButtonContent}>
              <div className="flex1">
                <div className={styles.currentMapTableSearch}>
                  <TableSearch width="208px">
                    <Search
                      placeholder="物料编号/需求公司"
                      enterButton
                      onSearch={(value: any) => hasMapSearch(value)}
                    />
                  </TableSearch>
                  <TableSearch width="240px">
                    <Select
                      options={areaOptions}
                      value={activeHasMapAreaId}
                      onChange={(value) => setActiveHasMapAreaId(value as string)}
                      placeholder="区域"
                      style={{ width: '100%' }}
                    />
                  </TableSearch>
                </div>
              </div>
              <div className={styles.buttonArea}>
                <Button className="mr7" onClick={() => removeEvent()}>
                  移除
                </Button>
                <Button type="primary" onClick={() => addMapEvent()}>
                  添加
                </Button>
              </div>
            </div>
            <div className={styles.currentMapTableTitle}>
              <CommonTitle>当前映射关系</CommonTitle>
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

      <InventoryTable
        hasMapData={hasMapTableShowData}
        changeEvent={setHasMapTableShowData}
        areaOptions={areaOptions}
        inventoryOverviewId={inventoryOverviewId}
        materialId={activeMaterialId}
        mappingId={mappingId}
        visible={addMapTableVisible}
        onChange={setAddMapTableVisible}
      />
    </>
  );
};

export default CreateMap;
