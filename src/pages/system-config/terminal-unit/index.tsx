import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Spin } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getTerminalUnitDetail,
  addTerminalUnitItem,
  updateTerminalUnitItem,
  deleteTerminalUnitItem,
} from '@/services/system-config/terminal-unit';
import { isArray } from 'lodash';
import TableImportButton from '@/components/table-import-button';
import TableExportButton from '@/components/table-export-button';
import MapFieldForm from './components/add-edit-form';
import moment from 'moment';

const { Search } = Input;

const MapField: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getTerminalUnitDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => tableSearchEvent()}
            enterButton
            placeholder="请输入关键词搜索"
          />
        </TableSearch>
      </div>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteTerminalUnitItem(editDataId);
    refresh();
    message.success('删除成功');
  };

  const tableSearchEvent = () => {
    search({
      keyWord: searchKeyWord,
    });
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = (params: object) => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search(params);
    }
  };

  const columns = [
    {
      dataIndex: 'serialNumber',
      index: 'serialNumber',
      title: '设备号',
      width: 150,
    },
    {
      dataIndex: 'provice',
      index: 'provice',
      title: '省区',
      width: 180,
    },
    {
      dataIndex: 'company',
      index: 'company',
      title: '单位公司',
      width: 240,
    },
    {
      dataIndex: 'orderNumber',
      index: 'orderNumber',
      title: '序号',
      width: 120,
    },
    {
      dataIndex: 'differentialAccount',
      index: 'differentialAccount',
      title: '差分账号',
      width: 200,
    },
    {
      dataIndex: 'differentialPwd',
      index: 'differentialPwd',
      title: '差分密码',
      width: 200,
    },
    {
      dataIndex: 'expiryTime',
      index: 'expiryTime',
      title: '到期时间',
      width: 200,
      render: (text: any, record: any) => {
        return moment(record.expiryTime).format('YYYY-MM-DD HH:mm ');
      },
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      width: 200,
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddTerminalUnit = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          serialNumber: '',
          differentialAccount: '',
          differentialPwd: '',
          expiryTime: '',
          orderNumber: 0,
          provice: '',
          company: '',
          remark: '',
        },
        value,
      );
      await addTerminalUnitItem(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const TerminalUnitData = await run(editDataId);

    TerminalUnitData.expiryTime = moment(TerminalUnitData.expiryTime);
    console.log(TerminalUnitData.expiryTime);

    editForm.setFieldsValue(TerminalUnitData);
  };

  const sureEditTerminalUnit = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          provice: editData.provice,
          orderNumber: editData.orderNumber,
          serialNumber: editData.serialNumber,
          differentialAccount: editData.differentialAccount,
          differentialPwd: editData.differentialPwd,
          expiryTime: editData.expiryTime,
          company: editData.company,
          remark: editData.remark,
        },
        values,
      );
      await updateTerminalUnitItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  tableSelectRows.map((item: any) => {
    ids.push(item.id);
  });

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
        <Popconfirm
          title="您确定要删除该条数据?"
          onConfirm={sureDeleteData}
          okText="确认"
          cancelText="取消"
        >
          <Button className="mr7">
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
        <TableImportButton className={styles.importBtn} importUrl="/TerminalUnit/Import" />
        <TableExportButton selectIds={ids} exportUrl="/TerminalUnit/Export" />
      </div>
    );
  };

  const titleSlotElement = () => {
    return <div className={styles.routeComponent}></div>;
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        titleSlot={titleSlotElement}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        url="/TerminalUnit/GetPagedList"
        tableTitle="终端设备"
        getSelectData={(data) => setTableSelectRow(data)}
      />
      <Modal
        title="添加-映射"
        width="720px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddTerminalUnit()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <Spin spinning={loading}>
            <MapFieldForm />
          </Spin>
        </Form>
      </Modal>
      <Modal
        title="编辑-映射"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditTerminalUnit()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <Spin spinning={loading}>
            <MapFieldForm />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default MapField;
