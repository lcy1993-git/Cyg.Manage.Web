import {
  createCompanyShare,
  removeCompanyShare,
} from '@/services/jurisdiction-config/company-manage';
import { useControllableValue } from 'ahooks';
import { Modal, Input, Button, message } from 'antd';
import React, { useRef, useState, SetStateAction, Dispatch } from 'react';
import styles from './index.less';
import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface CompanyShareProps {
  visible: boolean;
  onChange: Dispatch<SetStateAction<boolean>>;
  companyId: string;
}

const { Search } = Input;

const CompanyShare: React.FC<CompanyShareProps> = (props) => {
  const [state, setState] = useControllableValue(props, { valuePropName: 'visible' });

  const [addTableSelectRows, setAddTableSelectRows] = useState<any[]>([]);
  const [shareTableSelectRows, setShareTableSelectRows] = useState<any[]>([]);
  const [isAddSearch, setIsAddSearch] = useState<boolean>(false);
  // const [resizableColumns, setResizableColumns] = useState<object[]>([]);

  const [shareKeyWord, setShareKeyWord] = useState<string>('');
  const [addKeyWord, setAddKeyWord] = useState<string>('');

  const addTableRef = useRef<HTMLDivElement>(null);
  const shareTableRef = useRef<HTMLDivElement>(null);

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
      dataIndex: 'companyName',
      index: 'companyName',
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
          value={shareKeyWord}
          placeholder="请输入公司名称/管理员账号"
          enterButton
          onSearch={() => search()}
          onChange={(e) => setShareKeyWord(e.target.value)}
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
    if (!isAddSearch) {
      if (shareTableRef && shareTableRef.current) {
        // @ts-ignore
        shareTableRef.current.search();
      }
      return;
    }
    if (addTableRef && addTableRef.current) {
      // @ts-ignore
      addTableRef.current.search();
    }
  };

  const removeEvent = async () => {
    if (shareTableSelectRows && shareTableSelectRows.length === 0) {
      message.warning('请选择需要取消共享的公司');
      return;
    }

    const shareId = shareTableSelectRows[0].id;
    await removeCompanyShare(shareId);
    message.success('已移除');
    leftTableFresh();
  };

  //刷新
  const leftTableFresh = () => {
    if (shareTableRef && shareTableRef.current) {
      //@ts-ignore
      shareTableRef.current.refresh();
    }
    if (addTableRef && addTableRef.current) {
      //@ts-ignore
      addTableRef.current.refresh();
    }
  };

  //添加共享公司
  const addEvent = async () => {
    if (addTableSelectRows && addTableSelectRows.length === 0) {
      message.warning('请选择需要共享的公司');
      return;
    }

    const shareCompanyId = addTableSelectRows[0].id;
    await createCompanyShare({ companyId: companyId, shareCompanyId: shareCompanyId });
    message.success('添加共享公司成功');
    leftTableFresh();
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
        title="共享一览表"
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
          <div className={styles.shareTable}>
            <div className={styles.leftTableContent}>
              <GeneralTable
                noPaging
                tableTitle="当前共享公司"
                ref={shareTableRef}
                defaultPageSize={20}
                getSelectData={(data) => setShareTableSelectRows(data)}
                columns={columns}
                extractParams={{
                  category: 1,
                  companyId: companyId,
                  keyWord: shareKeyWord,
                }}
                buttonRightContentSlot={leftTableButton}
                buttonLeftContentSlot={tableSearch}
                url="/CompanyShare/GetList"
              />
            </div>
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
                  category: 2,
                  companyId: companyId,
                  keyWord: addKeyWord,
                }}
                buttonRightContentSlot={tableElement}
                buttonLeftContentSlot={addTableSearch}
                url="/CompanyShare/GetList"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CompanyShare;
