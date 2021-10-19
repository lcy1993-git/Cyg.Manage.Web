import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Input, Button } from 'antd';
import React, { useEffect, useState } from 'react';
// import ElectricCompanyForm from './components/add-edit-form';
import styles from './index.less';
import UrlSelect from '@/components/url-select';
// import TableImportButton from '@/components/table-import-button';
import { getUploadUrl } from '@/services/resource-config/drawing';
import { useRequest } from 'ahooks';
import UploadLineStressSag from './components/upload-lineStressSag';
import ImportLineStressSag from './components/import-lineStressSag';
import { message } from 'antd';
// import FileUploadOnline from '@/components/file-upload-online';
// import CygFormItem from '@/components/cy-form-item';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { ImportOutlined } from '@ant-design/icons';

const { Search } = Input;

interface libParams {
  libId: string;
}

const LineStressSag: React.FC<libParams> = (props) => {
  const { libId } = props;
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [resourceLibId, setResourceLibId] = useState<string | undefined>('');
  const [uploadLineStressSagVisible, setUploadLineStreesSagVisible] = useState<boolean>(false);
  const [importLineStressSagVisible, setImportLineStreesSagVisible] = useState<boolean>(false);

  const { data: keyData } = useRequest(() => getUploadUrl());
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const LineStressChartApiSecurity = keyData?.uploadLineStressChartApiSecurity;

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch width="298px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入应力弧垂表信息"
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

  const uploadFinishEvent = () => {
    refresh();
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {/* {buttonJurisdictionArray?.includes('line-stress-sag-import') && (
          <Button className="mr7" onClick={() => importLineStressEvent()}>
            导入应力弧垂表
          </Button>
        )}

        {buttonJurisdictionArray?.includes('line-stress-sag-upload-drawing') && (
          <Button className="mr7" onClick={() => importLineStressDrawingEvent()}>
            <ImportOutlined />
            上传图纸
          </Button>
        )} */}
      </div>
    );
  };

  const importLineStressEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请选择资源库');
    //   return;
    // }
    setImportLineStreesSagVisible(true);
  };

  const importLineStressDrawingEvent = () => {
    // if (!resourceLibId) {
    //   message.warning('请选择资源库');
    //   return;
    // }
    setUploadLineStreesSagVisible(true);
  };

  return (
    // <PageCommonWrap>
    <>
      <GeneralTable
        rowKey="id"
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        requestSource="resource"
        url="/LineStressSag/GetPageList"
        // tableTitle="应力弧垂表"
        type="radio"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />

      <UploadLineStressSag
        libId={libId}
        securityKey={LineStressChartApiSecurity}
        visible={uploadLineStressSagVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setUploadLineStreesSagVisible}
      />

      <ImportLineStressSag
        libId={libId}
        requestSource="resource"
        visible={importLineStressSagVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportLineStreesSagVisible}
      />
      {/* </PageCommonWrap> */}
    </>
  );
};

export default LineStressSag;
