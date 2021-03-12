import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, message } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import CommonTitle from '@/components/common-title';
import UrlSelect from '@/components/url-select';
import OverHeadDesignTab from './components/overHeadDesign-tab';
import { ImportOutlined } from '@ant-design/icons';
import ImportOverheadModal from './components/import-form';

const OverheadDesign: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [importOverheadVisible, setImportOverheadVisible] = useState<boolean>(false);

  //选择资源库传libId
  const searchByLib = (value: any) => {
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

  const importOverheadDesignEvent = () => {
    if (!resourceLibId) {
      message.error('请先选择资源库');
      return;
    }
    setImportOverheadVisible(true);
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.overHeadDesign}>
        <div className={styles.overHeadTitle}>
          <div className="flex1">
            <CommonTitle>架空设计</CommonTitle>
          </div>
          <div className="flex">
            <div className="flex1 flex">
              <TableSearch label="资源库" width="240px">
                <UrlSelect
                  allowClear
                  showSearch
                  style={{ width: '180px' }}
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
              <Button className="mr7" onClick={() => importOverheadDesignEvent()}>
                <ImportOutlined />
                导入(杆型+模块)
              </Button>
            </div>
          </div>
        </div>
        <div className={styles.overHeadTable}>
          <OverHeadDesignTab libId={resourceLibId} />
        </div>
      </div>
      <ImportOverheadModal
        libId={resourceLibId}
        requestSource="resource"
        visible={importOverheadVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportOverheadVisible}
      />
    </PageCommonWrap>
  );
};

export default OverheadDesign;
