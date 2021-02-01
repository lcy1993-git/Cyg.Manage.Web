import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input, Modal, Form, Spin, Popconfirm, message } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, PlusOutlined, DeleteOutlined, ApartmentOutlined } from '@ant-design/icons';
import '@/assets/icon/iconfont.css';
import { useRequest } from 'ahooks';
import {
  getAuthorizationDetail,
  updateAuthorizationItem,
  updateAuthorizationItemStatus,
  delectAuthorizationItem,
  addAuthorizationItem,
} from '@/services/jurisdiction-config/platform-authorization';
import { isArray } from 'lodash';
import AuthorizationForm from './components/form';

const { Search } = Input;

const PlatformAuthorization: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading: editDataLoading } = useRequest(getAuthorizationDetail, {
    manual: true,
  });

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      index: 'isDisable',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
    },
  ];

  const searchElement = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onSearch={() => search({ keyWord: searchKeyWord })}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          placeholder="模板名称"
          enterButton
        />
      </TableSearch>
    );
  };

  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const search = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search(params);
    }
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await delectFunctionItem(editDataId);
    tableFresh();
    message.success('删除成功');
  };

  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          isDisable: false,
          remark: '',
        },
        value,
      );
      await addAuthorizationItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const sureEditAuthorization = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          authCode: editData.authCode,
          category: editData.category,
          icon: editData.icon,
          id: editData.id,
          isDisable: editData.isDisable,
          name: editData.name,
          parentId: editData.parentId,
          sort: editData.sort,
          url: editData.url,
        },
        values,
      );
      await updateFunctionModuleItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  // const deleteTip = () => {
  //   if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
  //     message.error('请选择一条数据进行删除');
  //     return;
  //   }
  // };
  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const AuthorizationData = await run(editDataId);

    editForm.setFieldsValue({ AuthorizationData });
  };

  const buttonElement = () => {
    return (
      <div>
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
          // disabled
        >
          <Button className="mr7">
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
        <Button className="mr7">
          <ApartmentOutlined />
          分配功能模块
        </Button>
        <Button className="mr7">
          <i className="iconfont iconshouquan" />
          授权
        </Button>
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={buttonElement}
        getSelectData={(data) => setTableSelectRow(data)}
        url="/AuthTemplate/GetPagedList"
        columns={columns}
        tableTitle="授权管理"
      />
      <Modal
        title="添加-模板"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <AuthorizationForm />
        </Form>
      </Modal>
      <Modal
        title="编辑-模板"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditAuthorization()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <Spin spinning={editDataLoading}>
            <AuthorizationForm />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default PlatformAuthorization;
