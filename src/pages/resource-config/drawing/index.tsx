import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input } from 'antd';
import React, { useMemo, useState } from 'react';
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less';
import UrlSelect from '@/components/url-select';
import TableImportButton from '@/components/table-import-button';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useRequest } from 'ahooks';

const { Search } = Input;

const Drawing: React.FC = () => {
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

  console.log(data);

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="关键词"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="选择资源" width="300px">
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
      </div>
    );
  };

  //选择资源库传libId
  const searchByLib = (value: any) => {
    console.log(value);
    setResourceLibId(value);
    search();
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
      dataIndex: 'chartId',
      index: 'chartId',
      title: '图纸编号',
      width: 150,
    },
    {
      dataIndex: 'fileId',
      index: 'fileId',
      title: '文件编号',
      width: 150,
    },
    {
      dataIndex: 'category',
      index: 'category',
      title: '类别',
      width: 200,
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 200,
    },
    {
      dataIndex: 'fileName',
      index: 'fileName',
      title: '文件名',
    },
    {
      dataIndex: 'chartName',
      index: 'chartName',
      title: '图纸名称',
    },
  ];

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <TableImportButton
          buttonTitle="导入图纸"
          modalTitle="导入图纸"
          className={styles.importBtn}
          importUrl="/Upload/Chart"
        />
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/Chart/GetPageList"
        tableTitle="图纸"
        type="checkbox"
        extractParams={{
          resourceLibId: resourceLibId,
          keyWord: searchKeyWord,
        }}
      />
    </PageCommonWrap>
  );
};

export default Drawing;
