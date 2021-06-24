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
import GeneralTable from '../components/general-table';
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
    dataIndex: 'professionalAttribute',
    key: 'professionalAttribute',
    title: '专业属性',
  },
  {
    dataIndex: 'company',
    key: 'company',
    title: '单位',
  },
  {
    dataIndex: 'costCode',
    key: 'costCode',
    title: '费用编码',
  },
];

const Construction: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<DataSource[] | Object>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };
  const dataSource = [
    {
      key: '1',
      number: '一',
      name: 'lll',
      projectCode: '123456',
      professionalAttribute: 'hdfh',
      company: 'hfgd',
      costCode: 'hfdhf',
      children: [
        {
          key: '1-1',
          number: '1-1',
          name: 'llldgdsfd',
          projectCode: '1234444456',
          professionalAttribute: 'hsggsddfh',
          company: 'hgreefgd',
          costCode: 'hfgdsgdfdhf',
        },
      ],
    },
    {
      key: '2',
      number: '二',
      name: 'llldgdsfd',
      projectCode: '1234444456',
      professionalAttribute: 'hsggsddfh',
      company: 'hgreefgd',
      costCode: 'hfgdsgdfdhf',
    },
    {
      key: '3',
      number: '三',
      name: 'llldgdsfd',
      projectCode: '1234444456',
      professionalAttribute: 'hsggsddfh',
      company: 'hgreefgd',
      costCode: 'hfgdsgdfdhf',
      children: [
        {
          key: '3-1',
          number: '3-1',
          name: 'llldgdsfd',
          projectCode: '1234444456',
          professionalAttribute: 'hsggsddfh',
          company: 'hgreefgd',
          costCode: 'hfgdsgdfdhf',
        },
      ],
    },
  ];
  // 创建按钮
  const addEvent = () => {
    setAddFormVisible(true);
  };
  // 新增确认按钮
  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      await createMaterialMachineLibrary(values);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };
  // 编辑确认按钮
  const sureEditAuthorization = () => {
    editForm.validateFields().then(async (values) => {
      // TODO 编辑接口
      await createMaterialMachineLibrary(values);
      refresh();
      setEditFormVisible(false);
      editForm.resetFields();
    });
  };
  // 删除
  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const id = tableSelectRows[0].id;
    await deleteMaterialMachineLibrary(id);
    refresh();
    message.success('删除成功');
  };

  // 编辑按钮
  const editEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    // const id = tableSelectRows[0].id;
    // history.push(`/technology-economic/material-infomation?id=${id}`);
    setEditFormVisible(true);
    editForm.setFieldsValue({
      ...tableSelectRows[0],
    });
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        columns={columns as ColumnsType<DataSource | object>}
        url="/MaterialMachineLibrary/QueryMaterialMachineLibraryPager"
        // getSelectData={tableSelectEvent}
        requestSource="tecEco"
        extractParams={{
          keyWord: searchKeyWord,
        }}
        bordered={true}
        defaultExpandAllRows={true}
        expandIconColumnIndex={1}
      />
    </PageCommonWrap>
    // <Table
    //   columns={columns}
    //   dataSource={dataSource}
    //   expandIconColumnIndex={1}
    //   defaultExpandAllRows={true}
    //   bordered={true}
    // />
  );
};

export default Construction;
