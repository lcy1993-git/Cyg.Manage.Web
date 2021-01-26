import React, { useRef, useState } from 'react';
import { Button, Modal, Form, Popconfirm, message } from 'antd';
import TreeTable from '@/components/tree-table/index';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import PageCommonWrap from '@/components/page-common-wrap';
import {
  updateCompanyManageItem,
  addCompanyManageItem,
  getCompanyManageDetail,
  delectCompanyItem,
} from '@/services/jurisdiction-config/company-manage/company-manage';
import { isArray } from 'lodash';
import CompanyManageForm from './components/form';

const CompanyManage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getCompanyManageDetail, {
    manual: true,
  });
  //数据修改，局部刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const companyTableColumns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
    },
    {
      title: '新增用户库存',
      dataIndex: 'userStock',
      index: 'userStock',
      width: 240,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      index: 'address',
      width: 540,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
      width: 500,
    },
  ];

  const companyManageButton = () => {
    return (
      <>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button className="mr7" onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      </>
    );
  };

  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddCompanyManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          parentId: '',
          address: '',
          userStock: 0,
          remark: '',
        },
        value,
      );
      await addCompanyManageItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    const CompanyManageData = await run(editDataId);
    editForm.setFieldsValue({
      ...CompanyManageData,
      userStock: null,
    });

    setEditFormVisible(true);
  };

  const sureEditCompanyManage = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请先选择一条数据进行编辑');
      return;
    }
    const editData = data!;
    console.log(data);

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          parentId: editData.parentId,
          address: editData.address,
          remark: editData.remark,
          addUserStock: editData.userStock,
        },
        values,
      );
      await updateCompanyManageItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  return (
    <PageCommonWrap>
      <TreeTable
        ref={tableRef}
        columns={companyTableColumns}
        getSelectData={(data) => setTableSelectRow(data)}
        rightButtonSlot={companyManageButton}
        url="/Company/GetTreeList"
      />
      <Modal
        title="添加-公司"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyManageItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
      >
        <Form form={addForm}>
          <CompanyManageForm />
        </Form>
      </Modal>
      <Modal
        title="编辑-公司"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyManage()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
      >
        <Form form={editForm}>
          <CompanyManageForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyManage;
