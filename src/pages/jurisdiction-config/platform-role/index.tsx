import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Modal, Form, message } from 'antd';
import React, { useRef, useState } from 'react';
import RoleManageForm from './components/form';
import { isArray } from 'lodash';
import {
  updateRoleManageItem,
  addRoleManageItem,
  getRoleManageDetail,
} from '@/services/jurisdiction-config/role-manage';
import { useRequest } from 'ahooks';
import TableStatus from '@/components/table-status';

const PlatformRole: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { data, run } = useRequest(getRoleManageDetail, {
    manual: true,
  });

  const rightButton = () => {
    return (
      <div>
        <Button type="primary" className="mr7" onClick={() => addEvent()}>
          <PlusOutlined />
          添加
        </Button>
        <Button onClick={() => editEvent()}>
          <EditOutlined />
          编辑
        </Button>
      </div>
    );
  };

  //数据修改刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  //
  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddRoleManageItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          roleName: '',
          roleType: '',
          remark: '',
        },
        value,
      );
      await addRoleManageItem(submitInfo);
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

    const RoleManageData = await run(editDataId);
    editForm.setFieldsValue(RoleManageData);

    setEditFormVisible(true);
  };

  const sureEditRoleManage = () => {
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
          roleName: editData.roleName,
          remark: editData.remark,
        },
        values,
      );
      await updateRoleManageItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      index: 'roleName',
      width: 240,
    },
    {
      title: '角色类型',
      dataIndex: 'roleTypeText',
      index: 'roleTypeText',
      width: 180,
      render: (text: any, record: any) => {
        return (
          <TableStatus className="mr7" color="greenOne">
            {record.roleTypeText}
          </TableStatus>
        );
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
    },
  ];

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="角色管理"
        url="/Role/GetPagedList"
        columns={columns}
      />
      <Modal
        title="添加角色"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddRoleManageItem()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <RoleManageForm type="add" />
        </Form>
      </Modal>
      <Modal
        title="编辑-角色"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditRoleManage()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <RoleManageForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default PlatformRole;
