import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
// import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import CommonTitle from '@/components/common-title';
import UrlSelect from '@/components/url-select';
import CableDesignTab from './components/cableDesign-tab';
import { ImportOutlined } from '@ant-design/icons';
import ImportCableModal from './components/import-form';

const CableDesign: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [importCableVisible, setImportCableVisible] = useState<boolean>(false);

  //选择资源库传libId
  const searchByLib = (value: any) => {
    // console.log(value);
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

  const uploadFinishEvent = () => {
    refresh();
  };

  const importCableDesignEvent = () => {
    if (!resourceLibId) {
      message.error('请先选择资源库');
      return;
    }
    setImportCableVisible(true);
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.cableDesign}>
        <div className={styles.cableTitle}>
          <div className="flex1">
            <CommonTitle>电缆设计</CommonTitle>
          </div>
          <div className="flex">
            <div className="flex1 flex">
              <TableSearch className={styles.libSearch} label="资源库" width="240px">
                <UrlSelect
                  style={{ width: '180px' }}
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
            <div>
              <Button className="mr7" onClick={() => importCableDesignEvent()}>
                <ImportOutlined />
                导入(电缆井+电缆通道)
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.cableTable}>
          <CableDesignTab libId={resourceLibId} />
        </div>
      </div>
      <ImportCableModal
        libId={resourceLibId}
        requestSource="resource"
        visible={importCableVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportCableVisible}
      />
    </PageCommonWrap>
  );
};

export default CableDesign;
