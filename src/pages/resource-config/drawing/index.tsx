import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button, message } from 'antd';
import React, { useEffect, useState } from 'react';
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less';
import UrlSelect from '@/components/url-select';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useRequest } from 'ahooks';
import { ImportOutlined } from '@ant-design/icons';
import ImportChartModal from './component/import-form';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

const Drawing: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false);
  const [resourceLibId, setResourceLibId] = useState<string | undefined>('');
  const { data: keyData } = useRequest(() => getUploadUrl());

  const chartSecurityKey = keyData?.uploadChartApiSecurity;
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

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

  const uploadFinishEvent = () => {
    refresh();
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
        {buttonJurisdictionArray?.includes('drawing-import') && (
          <Button className="mr7" onClick={() => importChartEvent()}>
            <ImportOutlined />
            导入图纸
          </Button>
        )}
      </div>
    );
  };

  const importChartEvent = () => {
    if (!resourceLibId) {
      message.error('请先选择资源库');
      return;
    }
    setImportFormVisible(true);
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        rowKey="chartId"
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/Chart/GetPageList"
        tableTitle="图纸"
        type="radio"
        extractParams={{
          resourceLibId: resourceLibId,
          keyWord: searchKeyWord,
        }}
      />
      <ImportChartModal
        libId={resourceLibId}
        securityKey={chartSecurityKey}
        requestSource="upload"
        visible={importFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportFormVisible}
      />
    </PageCommonWrap>
  );
};

export default Drawing;
