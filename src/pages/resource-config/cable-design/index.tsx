import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
// import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Popconfirm } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import CommonTitle from '@/components/common-title';
import TableImportButton from '@/components/table-import-button';
import UrlSelect from '@/components/url-select';
import CableDesignTab from './components/cableDesign-tab';

const { Search } = Input;

const CableDesign: React.FC = () => {
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

  //   const tableElement = () => {
  //     return (
  //       <div className={styles.buttonArea}>
  //         <Button type="primary" className="mr7" onClick={() => addEvent()}>
  //           <PlusOutlined />
  //           添加
  //         </Button>
  //         <Button className="mr7" onClick={() => editEvent()}>
  //           <EditOutlined />
  //           编辑
  //         </Button>
  //         <Popconfirm
  //           title="您确定要删除该条数据?"
  //           onConfirm={sureDeleteData}
  //           okText="确认"
  //           cancelText="取消"
  //         >
  //           <Button className="mr7">
  //             <DeleteOutlined />
  //             删除
  //           </Button>
  //         </Popconfirm>
  //         <TableImportButton
  //           buttonTitle="导入电气设备"
  //           modalTitle="导入电气设备"
  //           className={styles.importBtn}
  //           importUrl="/ElectricalEquipment/Import"
  //         />
  //         <Button className={styles.importBtn} onClick={() => openDetail()}>
  //           组件明细
  //         </Button>
  //         <Button className={styles.importBtn} onClick={() => openAttribute()}>
  //           组件属性
  //         </Button>
  //       </div>
  //     );
  //   };

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
                buttonTitle="导入(电缆井+电缆通道)"
                modalTitle="导入(电缆井+电缆通道)"
                className={styles.importBtn}
                importUrl="/CableWell/SaveImport"
              />
            </div>
          </div>
        </div>
        <div className={styles.cableTable}>
          <CableDesignTab libId={resourceLibId} />
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default CableDesign;
