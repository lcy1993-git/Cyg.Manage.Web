import { createCompanyHierarchy } from '@/services/jurisdiction-config/company-manage';
import { useControllableValue, useRequest } from 'ahooks';
import { Modal, Input, Button, Select, Table, message, Spin, Tabs } from 'antd';
import React, { useMemo, useRef, useState, SetStateAction, Dispatch } from 'react';
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import CommonTitle from '@/components/common-title';
import EmptyTip from '@/components/empty-tip';
import { PlusOutlined } from '@ant-design/icons';

interface UnitConfigProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  companyId: string;
}

const { Search } = Input;
const { TabPane } = Tabs;

const UnitConfig: React.FC<UnitConfigProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });
  const [libTableSelectRow, setLibTableSelectRow] = useState<any[]>([]);

  const [addTableSelectRows, setAddTableSelectRows] = useState<any[]>([]);
  const [superiorTableSelectRows, setSuperiorTableSelectRows] = useState<any[]>([]);
  const [subordinateTableSelectRows, setSubordinateTableSelectRows] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('superior');
  // const [resizableColumns, setResizableColumns] = useState<object[]>([]);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const addTableRef = useRef<HTMLDivElement>(null);
  const superiorRef = useRef<HTMLDivElement>(null);
  const subordinateRef = useRef<HTMLDivElement>(null);

  const { companyId } = props;

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

  const addColumns = [
    {
      dataIndex: 'name',
      index: 'name',
      title: '公司名称',
      width: 240,
    },
    {
      dataIndex: 'adminUserName',
      index: 'adminUserName',
      title: '管理员账号',
      width: 180,
    },
    {
      dataIndex: 'address',
      index: 'address',
      title: '详细地址',
    },
  ];

  const tableSearch = () => {
    return (
      <TableSearch width="278px">
        <Search
          value={searchKeyWord}
          placeholder="请输入公司名称/管理员账号"
          enterButton
          onSearch={() => search()}
          onChange={(e) => setSearchKeyWord(e.target.value)}
        />
      </TableSearch>
    );
  };

  const search = () => {
    if (currentTab === 'superior') {
      if (superiorRef && superiorRef.current) {
        // @ts-ignore
        superiorRef.current.search();
      }
    }
    if (currentTab === 'subordinate') {
      if (subordinateRef && subordinateRef.current) {
        // @ts-ignore
        subordinateRef.current.search();
      }
    }
  };

  const resourceTableChangeEvent = async (data: any) => {
    setLibTableSelectRow(data);

    // if (data && data.length > 0) {
    //   await getMapData({
    //     materialId: data[0]?.id,
    //     area: '-1',
    //   });
    // }
  };

  const removeEvent = () => {
    // if (mapTableSelectArray && mapTableSelectArray.length === 0) {
    //   message.warning('请先选择要移除的映射');
    //   return;
    // }
    // const copyArrayIds = [...mapTableSelectArray];
    // const copyHasData = [...hasMapTableShowData];
    // const newArray = copyHasData.filter((item) => !copyArrayIds.includes(item.id));
    // setHasMapTableShowData(newArray);
    // message.success('已移除');
    // setMapTableSelectArray([]);
  };

  //刷新

  const superiorFresh = () => {
    if (superiorRef && superiorRef.current) {
      //@ts-ignore
      superiorRef.current.refresh();
    }
  };

  //添加协作公司
  const addEvent = async () => {
    if (currentTab === 'superior') {
      if (addTableSelectRows && addTableSelectRows.length === 0) {
        message.warning('请选择需要添加的上级公司');
        return;
      }

      const preCompanyId = addTableSelectRows[0].id;
      await createCompanyHierarchy({ preCompanyId: preCompanyId, companyId: companyId });
      message.success('添加上级公司成功');
      superiorFresh();
    }
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
      </div>
    );
  };

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
            <Tabs
              defaultActiveKey="superior"
              type="card"
              onChange={(value) => setCurrentTab(value)}
            >
              <TabPane tab="上级公司" key="superior" style={{ height: '740px' }}>
                <GeneralTable
                  noPaging
                  ref={superiorRef}
                  defaultPageSize={20}
                  getSelectData={(data) => setSuperiorTableSelectRows(data)}
                  columns={addColumns}
                  extractParams={{
                    category: 1,
                    companyId: companyId,
                    keyWord: searchKeyWord,
                  }}
                  buttonLeftContentSlot={tableSearch}
                  url="/CompanyHierarchy/GetList"
                />
              </TabPane>
              <TabPane tab="下级公司" key="subordinate" style={{ height: '740px' }}>
                <GeneralTable
                  noPaging
                  ref={subordinateRef}
                  defaultPageSize={20}
                  getSelectData={(data) => setSubordinateTableSelectRows(data)}
                  columns={addColumns}
                  extractParams={{
                    category: 2,
                    companyId: companyId,
                    keyWord: searchKeyWord,
                  }}
                  buttonLeftContentSlot={tableSearch}
                  url="/CompanyHierarchy/GetList"
                />
              </TabPane>
            </Tabs>
          </div>

          <div className={styles.currentMapTable}>
            <div className={styles.currentMapTableContent}>
              <GeneralTable
                noPaging
                tableTitle="添加公司"
                ref={addTableRef}
                defaultPageSize={20}
                getSelectData={(data) => setAddTableSelectRows(data)}
                columns={addColumns}
                extractParams={{
                  category: 3,
                  companyId: companyId,
                  keyWord: searchKeyWord,
                }}
                buttonRightContentSlot={tableElement}
                buttonLeftContentSlot={tableSearch}
                url="/CompanyHierarchy/GetList"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UnitConfig;
