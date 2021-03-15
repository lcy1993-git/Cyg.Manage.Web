import React, { useRef, useState } from 'react';
import { Button, Modal, Form, message } from 'antd';
import TreeTable from '@/components/tree-table/index';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import PageCommonWrap from '@/components/page-common-wrap';
import {
  updateCompanyManageItem,
  addCompanyManageItem,
  getCompanyManageDetail,
  getTreeSelectData,
} from '@/services/jurisdiction-config/company-manage';
import { isArray } from 'lodash';
import CompanyManageForm from './components/form';

const CompanyManage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data: selectTreeData = [], run: getSelectTreeData } = useRequest(getTreeSelectData, {
    manual: true,
  });

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
      width: 320,
    },
    {
      title: '公司用户库存',
      dataIndex: 'userStock',
      index: 'userStock',
      width: 180,
    },
    {
      title: '详细地址',
      dataIndex: 'address',
      index: 'address',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
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
    await getSelectTreeData();
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
      console.log(submitInfo);

      await addCompanyManageItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      message.success('添加成功');
      addForm.resetFields();
      tableFresh();
    });
  };

  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const CompanyManageData = await run(editDataId);
    await getSelectTreeData();
    editForm.setFieldsValue({
      ...CompanyManageData,
      userStock: null,
    });
  };

  const sureEditCompanyManage = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请先选择一条数据进行编辑');
      return;
    }
    const editData = data!;

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
        tableTitle="公司管理"
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
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CompanyManageForm type="add" treeData={selectTreeData} />
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
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <CompanyManageForm treeData={selectTreeData} />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyManage;
