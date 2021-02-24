import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less';
import UrlSelect from '@/components/url-select';
import TableImportButton from '@/components/table-import-button';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useRequest } from 'ahooks';

const { Search } = Input;

const SourceCompare: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  // const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [resourceLibId, setResourceLibId] = useState<string | null>('');
  const { data } = useRequest(getUploadUrl(), {
    manual: true,
  });

  // const uploadData = useMemo(() => {
  //   if (data) {
  //     return data;
  //   }
  // }, [JSON.stringify(data)]);

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch marginLeft="20px" label="资源库" width="230px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/ResourceLib/GetList"
            titleKey="libName"
            valueKey="id"
            placeholder="请选择"
            onChange={(value: any) => searchByLib(value)}
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="资源库" width="230px">
          <UrlSelect
            allowClear
            showSearch
            requestSource="resource"
            url="/ResourceLib/GetList"
            titleKey="libName"
            valueKey="id"
            placeholder="请选择"
            onChange={(value: any) => searchByLib(value)}
          />
        </TableSearch>
        <Button>搜索</Button>
      </div>
    );
  };

  //选择资源库传libId
  const searchByLib = (value: any) => {
    console.log(value);
    setResourceLibId(value);
    search();
  };

  useEffect(() => {
    searchByLib(resourceLibId);
  }, [resourceLibId]);

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
      <div className={styles.buttonArea}>
        <TableImportButton
          buttonTitle="导入应力弧垂表"
          modalTitle="导入应力弧垂表"
          className={styles.importBtn}
          importUrl="/LineStressSag/SaveImport"
        />
        <TableImportButton
          buttonTitle="上传图纸"
          modalTitle="导入应力弧垂表-图纸"
          className={styles.importBtn}
          importUrl="/LineStressSag/SaveImport"
        />
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <div className={styles.sourceTable}>
        <GeneralTable
          // scroll={{ x: 1000 }}
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
          // getSelectData={(data) => setTableSelectRow(data)}
          extractParams={{
            db1: '',
            db2: '',
            keyWord: searchKeyWord,
          }}
        />
      </div>
    </PageCommonWrap>
  );
};

export default SourceCompare;
