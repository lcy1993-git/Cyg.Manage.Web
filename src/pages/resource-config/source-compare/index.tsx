import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, message, Modal, Spin } from 'antd';
import React, { useState } from 'react';
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less';
import UrlSelect from '@/components/url-select';
import { SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { isArray } from 'lodash';
import SourceCompareDetailTab from './components/detail-tab';
import { getSourceCompareDetail } from '@/services/resource-config/source-compare';

const SourceCompare: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [dataBase1, setDataBase1] = useState<string>('');
  const [dataBase2, setDataBase2] = useState<string>('');
  const [detailTabVisible, setDetailTabVisible] = useState<boolean>(false);

  const { data, run, loading } = useRequest(getSourceCompareDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="源资源库" width="260px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/ResourceLib/GetList"
            titleKey="libName"
            valueKey="id"
            placeholder="请选择"
            onChange={(value: any) => setDataBase1(value)}
          />
        </TableSearch>
        <TableSearch label="目标资源库" width="260px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/ResourceLib/GetList"
            titleKey="libName"
            valueKey="id"
            placeholder="请选择"
            onChange={(value: any) => setDataBase2(value)}
          />
        </TableSearch>
        <Button style={{ marginLeft: '10px' }} onClick={() => search()}>
          <SearchOutlined />
          搜索
        </Button>
      </div>
    );
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
      dataIndex: 'sourceDbName',
      index: 'sourceDbName',
      title: '源资源库',
      width: 180,
    },
    {
      dataIndex: 'compareDbName',
      index: 'compareDbName',
      title: '目标资源库',
      width: 180,
    },
    {
      dataIndex: 'statusText',
      index: 'statusText',
      title: '状态',
      width: 150,
    },
    {
      dataIndex: 'startDateText',
      index: 'startDateText',
      title: '开始日期',
      width: 180,
    },
    {
      dataIndex: 'completionDateText',
      index: 'completionDateText',
      title: '结束日期',
      width: 180,
    },
    {
      dataIndex: 'error',
      index: 'error',
      title: '异常',
      //   width: 220,
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap' as 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: (text: string, record: any) => {
        return record.error;
      },
    },
  ];

  const tableElement = () => {
    return (
      <>
        <Button className="mr7" onClick={() => checkDetailEvent()}>
          <FileTextOutlined />
          详情
        </Button>
        <Button className="mr7" onClick={() => checkDifferEvent()}>
          <FileTextOutlined />
          差异明细
        </Button>
      </>
    );
  };

  const checkDetailEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    setDetailTabVisible(true);
    await run(tableSelectRows[0].id);
  };

  const checkDifferEvent = () => {};

  return (
    <PageCommonWrap>
      <GeneralTable
        rowKey="id"
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/SourceCompare/GetCompareCategoryPageList"
        tableTitle="版本对比"
        type="radio"
        getSelectData={(data) => setTableSelectRow(data)}
        extractParams={{
          db1: dataBase1,
          db2: dataBase2,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        footer=""
        title="比对类目-详情"
        width="720px"
        visible={detailTabVisible}
        okText="确认"
        onCancel={() => setDetailTabVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Spin spinning={loading}>
          <SourceCompareDetailTab detailData={data} />
        </Spin>
      </Modal>
    </PageCommonWrap>
  );
};

export default SourceCompare;
