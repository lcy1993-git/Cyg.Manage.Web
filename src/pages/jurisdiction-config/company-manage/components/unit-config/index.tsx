import {
  createCompanyHierarchy,
  removeComoanyHierarchy,
} from '@/services/jurisdiction-config/company-manage';
import { useControllableValue } from 'ahooks';
import { Modal, Input, Button, message, Tabs } from 'antd';
import React, { useRef, useState, SetStateAction, Dispatch } from 'react';
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface UnitConfigProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  companyId: string;
}

const { Search } = Input;
const { TabPane } = Tabs;

const UnitConfig: React.FC<UnitConfigProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [addTableSelectRows, setAddTableSelectRows] = useState<any[]>([]);
  const [superiorTableSelectRows, setSuperiorTableSelectRows] = useState<any[]>([]);
  const [subordinateTableSelectRows, setSubordinateTableSelectRows] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState<string>('superior');
  const [isAddSearch, setIsAddSearch] = useState<boolean>(false);
  // const [resizableColumns, setResizableColumns] = useState<object[]>([]);

  const [superiorKeyWord, setSuperiorKeyWord] = useState<string>('');
  const [subordinateKeyWord, setSubordinateKeyWord] = useState<string>('');
  const [addKeyWord, setAddKeyWord] = useState<string>('');

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

  const columns = [
    {
      dataIndex: 'name',
      index: 'name',
      title: '公司名称',
      width: 260,
    },
    {
      dataIndex: 'adminUserName',
      index: 'adminUserName',
      title: '管理员账号',
      width: 160,
    },
    {
      dataIndex: 'address',
      index: 'address',
      title: '详细地址',
    },
  ];

  const tableSearch = () => {
    return (
      <TableSearch width="268px">
        <Search
          value={currentTab === 'superior' ? superiorKeyWord : subordinateKeyWord}
          placeholder="请输入公司名称/管理员账号"
          enterButton
          onSearch={() => search()}
          onChange={(e) => {
            currentTab === 'superior'
              ? setSuperiorKeyWord(e.target.value)
              : setSubordinateKeyWord(e.target.value);
          }}
        />
      </TableSearch>
    );
  };

  const addTableSearch = () => {
    return (
      <TableSearch width="268px">
        <Search
          onFocus={() => setIsAddSearch(true)}
          onBlur={() => setIsAddSearch(false)}
          value={addKeyWord}
          placeholder="请输入公司名称/管理员账号"
          enterButton
          onSearch={() => search()}
          onChange={(e) => setAddKeyWord(e.target.value)}
        />
      </TableSearch>
    );
  };

  const search = () => {
    if (isAddSearch) {
      if (addTableRef && addTableRef.current) {
        // @ts-ignore
        addTableRef.current.search();
      }
      return;
    }
    if (currentTab === 'superior') {
      if (superiorRef && superiorRef.current) {
        // @ts-ignore
        superiorRef.current.search();
      }
      return;
    }
    if (currentTab === 'subordinate') {
      if (subordinateRef && subordinateRef.current) {
        // @ts-ignore
        subordinateRef.current.search();
      }
      return;
    }
  };

  const removeEvent = async () => {
    if (currentTab === 'superior') {
      if (superiorTableSelectRows && superiorTableSelectRows.length === 0) {
        message.warning('请选择需要移除的上级公司');
        return;
      }

      const hierarchyId = superiorTableSelectRows[0].id;
      await removeComoanyHierarchy(hierarchyId);
      message.success('移除上级公司成功');
      leftTableFresh();
    }

    if (currentTab === 'subordinate') {
      if (subordinateTableSelectRows && subordinateTableSelectRows.length === 0) {
        message.warning('请选择需要移除的下级公司');
        return;
      }

      const hierarchyId = subordinateTableSelectRows[0].id;
      await removeComoanyHierarchy(hierarchyId);
      message.success('移除下级公司成功');
      leftTableFresh();
    }
  };

  //刷新
  const leftTableFresh = () => {
    if (currentTab === 'superior') {
      if (superiorRef && superiorRef.current) {
        //@ts-ignore
        superiorRef.current.refresh();
      }
    }

    if (currentTab === 'subordinate') {
      if (subordinateRef && subordinateRef.current) {
        //@ts-ignore
        subordinateRef.current.refresh();
      }
    }
    if (addTableRef && addTableRef.current) {
      //@ts-ignore
      addTableRef.current.refresh();
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
      leftTableFresh();
    }

    if (currentTab === 'subordinate') {
      if (addTableSelectRows && addTableSelectRows.length === 0) {
        message.warning('请选择需要添加的下级公司');
        return;
      }

      const preCompanyId = addTableSelectRows[0].id;
      await createCompanyHierarchy({ preCompanyId: companyId, companyId: preCompanyId });
      message.success('添加下级公司成功');
      leftTableFresh();
    }
  };

  //添加
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

  //移除
  const leftTableButton = () => {
    return (
      <div className={styles.buttonArea}>
        <Button className="mr7" onClick={() => removeEvent()}>
          <DeleteOutlined />
          移除
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
        <div className={styles.unitConfigTable}>
          <div className={styles.hierarchyTable}>
            <Tabs
              defaultActiveKey="superior"
              type="card"
              onChange={(value) => setCurrentTab(value)}
            >
              <TabPane tab="上级公司" key="superior" style={{ height: '740px' }}>
                <div className={styles.leftTableContent}>
                  <GeneralTable
                    noPaging
                    needTitleLine={false}
                    ref={superiorRef}
                    defaultPageSize={20}
                    getSelectData={(data) => setSuperiorTableSelectRows(data)}
                    columns={columns}
                    extractParams={{
                      category: 1,
                      companyId: companyId,
                      keyWord: superiorKeyWord,
                    }}
                    buttonRightContentSlot={leftTableButton}
                    buttonLeftContentSlot={tableSearch}
                    url="/CompanyHierarchy/GetList"
                  />
                </div>
              </TabPane>
              <TabPane tab="下级公司" key="subordinate" style={{ height: '740px' }}>
                <div className={styles.leftTableContent}>
                  <GeneralTable
                    noPaging
                    needTitleLine={false}
                    ref={subordinateRef}
                    defaultPageSize={20}
                    getSelectData={(data) => setSubordinateTableSelectRows(data)}
                    columns={columns}
                    extractParams={{
                      category: 2,
                      companyId: companyId,
                      keyWord: subordinateKeyWord,
                    }}
                    buttonRightContentSlot={leftTableButton}
                    buttonLeftContentSlot={tableSearch}
                    url="/CompanyHierarchy/GetList"
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>

          <div className={styles.addTable}>
            <div className={styles.addTableContent}>
              <GeneralTable
                noPaging
                tableTitle="添加公司"
                ref={addTableRef}
                defaultPageSize={20}
                getSelectData={(data) => setAddTableSelectRows(data)}
                columns={columns}
                extractParams={{
                  category: 3,
                  companyId: companyId,
                  keyWord: addKeyWord,
                }}
                buttonRightContentSlot={tableElement}
                buttonLeftContentSlot={addTableSearch}
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
