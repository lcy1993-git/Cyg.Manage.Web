import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
// import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import CommonTitle from '@/components/common-title';
import TableImportButton from '@/components/table-import-button';
import UrlSelect from '@/components/url-select';
import OverHeadDesignTab from './components/overHeadDesign-tab';

const { Search } = Input;

const OverheadDesign: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');

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
              <TableImportButton
                buttonTitle="导入(杆型+模块)"
                modalTitle="导入(杆型+模块)"
                importUrl="/PoleType/SaveImport"
              />
            </div>
          </div>
        </div>
        <div className={styles.overHeadTable}>
          <OverHeadDesignTab libId={resourceLibId} />
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default OverheadDesign;
