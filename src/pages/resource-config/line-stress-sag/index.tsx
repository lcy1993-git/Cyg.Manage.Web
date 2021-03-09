import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less';
import UrlSelect from '@/components/url-select';
import TableImportButton from '@/components/table-import-button';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useRequest } from 'ahooks';
import FileUploadOnline from '@/components/file-upload-online';
import CygFormItem from '@/components/cy-form-item';

const { Search } = Input;

const LineStressSag: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [resourceLibId, setResourceLibId] = useState<string | null>('');
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const { data: keyData } = useRequest(() => getUploadUrl());

  const LineStressChartApiSecurity = keyData?.uploadLineStressChartApiSecurity;
  console.log(LineStressChartApiSecurity);

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="搜索" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="导线型号"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="资源库" width="300px">
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

  useEffect(() => {
    searchByLib(resourceLibId);
  }, [resourceLibId]);

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const columns = [
    {
      dataIndex: 'meteorologic',
      index: 'meteorologic',
      title: '气象区',
      width: 140,
    },
    {
      dataIndex: 'spec',
      index: 'spec',
      title: '导线型号',
      width: 220,
    },
    {
      dataIndex: 'chartName',
      index: 'chartName',
      title: '图纸',
    },
    {
      dataIndex: 'isExistsChart',
      index: 'isExistsChart',
      title: '图纸是否存在',
      width: 180,
      render: (text: any, record: any) => {
        return record.isExistsChart == false ? '不存在' : '存在';
      },
    },
    {
      dataIndex: 'safetyFactor',
      index: 'safetyFactor',
      title: '安全系数',
      width: 140,
    },
  ];

  const importLineStress = () => {
    setImportModalVisible(true);
  };

  const saveImport = () => {};

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {/* <Button className="mr7" onClick={() => importLineStress()}>
          导入应力弧垂表
        </Button> */}
        <TableImportButton
          requestSource="resource"
          buttonTitle="导入应力弧垂表"
          modalTitle="导入应力弧垂表"
          className={styles.importBtn}
          importUrl="/LineStressSag/SaveImport"
          extraParams={{ libId: resourceLibId }}
          postType="query"
        />
        <TableImportButton
          requestSource="upload"
          buttonTitle="上传图纸"
          modalTitle="导入应力弧垂表-图纸"
          className={styles.importBtn}
          importUrl="/Upload/LineStressSag"
          extraParams={{ libId: resourceLibId, securityKey: LineStressChartApiSecurity }}
        />
      </div>
    );
  };

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
        url="/LineStressSag/GetPageList"
        tableTitle="应力弧垂表"
        type="radio"
        extractParams={{
          resourceLibId: resourceLibId,
          keyWord: searchKeyWord,
        }}
      />
      {/* <Modal
        visible={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        onOk={() => saveImport()}
      >
        <CygFormItem label="导入应力弧垂表" labelWidth={112} className={styles.importLineSag}>
          <FileUploadOnline
            action="/Upload/LineStressSag"
            maxCount={1}
            extramParams={{ libId: resourceLibId, securityKey: LineStressChartApiSecurity }}
          ></FileUploadOnline>
        </CygFormItem>
      </Modal> */}
    </PageCommonWrap>
  );
};

export default LineStressSag;
