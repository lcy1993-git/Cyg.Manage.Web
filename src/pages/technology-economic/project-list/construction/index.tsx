import React, { useState } from 'react';
import { history } from 'umi';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { Input, Button, Modal, Form, Switch, message, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
  FileSearchOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { isArray } from 'lodash';
import PageCommonWrap from '@/components/page-common-wrap';
// import TableSearch from '@/components/table-search';

import {
  createMaterialMachineLibrary,
  deleteMaterialMachineLibrary,
  setMaterialMachineLibraryStatus,
} from '@/services/technology-economic';
import styles from './index.less';
import TreeTable from '../components/tree-table';
import { getEngineeringTemplateTreeData } from '@/services/technology-economic/project-list';
import { useEffect } from 'react';
import EmptyTip from '@/components/empty-tip';
type DataSource = {
  id: string;
  [key: string]: string;
};

const { Search } = Input;

const columns = [
  {
    dataIndex: 'number',
    key: 'number',
    title: '编号',
    width: 300,
  },
  {
    dataIndex: 'name',
    key: 'name',
    title: '名称',
  },
  {
    dataIndex: 'projectCode',
    key: 'projectCode',
    title: '项目代码',
  },
  {
    dataIndex: 'professionalProperty',
    key: 'professionalProperty',
    title: '专业属性',
  },
  {
    dataIndex: 'unit',
    key: 'unit',
    title: '单位',
  },
  {
    dataIndex: 'costNo',
    key: 'costNo',
    title: '费用编码',
  },
];
type IProps = { dataSource: any };
const Construction: React.FC<IProps> = ({ dataSource }) => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  // const [dataSource, setDataSource] = useState<DataSource[]>([]);

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };
  // const dataSource = [
  //   {
  //     key: '1',
  //     number: '一',
  //     name: 'lll',
  //     projectCode: '123456',
  //     professionalAttribute: 'hdfh',
  //     company: 'hfgd',
  //     costCode: 'hfdhf',
  //     children: [
  //       {
  //         key: '1-1',
  //         number: '1-1',
  //         name: 'llldgdsfd',
  //         projectCode: '1234444456',
  //         professionalAttribute: 'hsggsddfh',
  //         company: 'hgreefgd',
  //         costCode: 'hfgdsgdfdhf',
  //       },
  //     ],
  //   },
  //   {
  //     key: '2',
  //     number: '二',
  //     name: 'llldgdsfd',
  //     projectCode: '1234444456',
  //     professionalAttribute: 'hsggsddfh',
  //     company: 'hgreefgd',
  //     costCode: 'hfgdsgdfdhf',
  //   },
  //   {
  //     key: '3',
  //     number: '三',
  //     name: 'llldgdsfd',
  //     projectCode: '1234444456',
  //     professionalAttribute: 'hsggsddfh',
  //     company: 'hgreefgd',
  //     costCode: 'hfgdsgdfdhf',
  //     children: [
  //       {
  //         key: '3-1',
  //         number: '3-1',
  //         name: 'llldgdsfd',
  //         projectCode: '1234444456',
  //         professionalAttribute: 'hsggsddfh',
  //         company: 'hgreefgd',
  //         costCode: 'hfgdsgdfdhf',
  //       },
  //     ],
  //   },
  // ];

  return (
    // <PageCommonWrap>
    //   <GeneralTable
    //     ref={tableRef}
    //     columns={columns as ColumnsType<DataSource | object>}
    //     url="/EngineeringTemplateCatalog/GetEngineeringTemplateCatalogTree"
    //     // getSelectData={tableSelectEvent}
    //     requestSource="tecEco1"
    //     extractParams={{ engineeringTemplateId: engineeringTemplateId, projectType: projectType }}
    //     bordered={true}
    //     defaultExpandAllRows={true}
    //     expandIconColumnIndex={1}
    //   />
    // </PageCommonWrap>
    <PageCommonWrap>
      {dataSource && dataSource.length ? (
        <TreeTable dataSource={dataSource} columns={columns} needCheck={false} />
      ) : (
        <EmptyTip className="pt20 pb20" />
      )}
      <div style={{ height: '50px' }}></div>
    </PageCommonWrap>
  );
};

export default Construction;
