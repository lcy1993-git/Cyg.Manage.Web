import PageCommonWrap from '@/components/page-common-wrap';
import React, { useRef, useState } from 'react';
import { Button, Modal, Form, Popconfirm, message, Spin } from 'antd';
import TreeTable from '@/components/tree-table/index';
import {
  addCompanyGroupItem,
  deleteCompanyGroupItem,
  getTreeSelectData,
  updateCompanyGroupItem,
  getCompanyGroupDetail,
} from '@/services/operation-config/company-group';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import CompanyGroupForm from './components/add-edit-form';

import { isArray } from 'lodash';
import { useRequest } from 'ahooks';
import CyTag from '@/components/cy-tag';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const CompanyGroup: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);

  const [tableSelectRows, setTableSelectRows] = useState<object | object[]>([]);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading: editDataLoading } = useRequest(getCompanyGroupDetail, {
    manual: true,
  });

  const { data: selectTreeData = [], run: getSelectTreeData } = useRequest(getTreeSelectData, {
    manual: true,
  });

  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const functionTableColumns = [
    {
      title: '部组',
      dataIndex: 'name',
      index: 'name',
      width: 220,
    },
    {
      title: '部组管理员',
      dataIndex: 'adminUserId',
      index: 'adminUserId',
      render: (text: any, record: any) => {
        return record.adminUserId ? record.adminUserName : record.adminUserId;
      },
      width: 240,
    },
    {
      title: '部组成员',
      dataIndex: 'users',
      index: 'users',
      render: (text: any, record: any) => {
        return record.users.map((item: any) => {
          return (
            <CyTag key={item.value} className="mr7">
              {item.text}
            </CyTag>
          );
        });
      },
    },
  ];

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteCompanyGroupItem(editDataId);
    tableFresh();
    message.success('删除成功');
    setTableSelectRows([]);
  };

  const addEvent = async () => {
    await getSelectTreeData();
    setAddFormVisible(true);
  };

  const sureAddCompanyGroup = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          parentId: '',
          adminUserId: '',
          userIds: '',
        },
        value,
      );
      await addCompanyGroupItem(submitInfo);
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

    await getSelectTreeData();
    setEditFormVisible(true);
    const CompanyGroupData = await run(editDataId);

    editForm.setFieldsValue({
      ...CompanyGroupData,
      userIds: (CompanyGroupData.users ?? []).map((item: any) => item.value),
    });
  };

  const sureEditCompanyGroup = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          parentId: editData.parentId,
          userIds: editData.userIds,
        },
        values,
      );
      await updateCompanyGroupItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      setEditFormVisible(false);
    });
  };

  const functionModuleButton = () => {
    return (
      <>
        {buttonJurisdictionArray?.includes('group-manage-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('group-manage-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('group-manage-delete') && (
          <Popconfirm
            title="您确定要删除该条数据?"
            onConfirm={sureDeleteData}
            okText="确认"
            cancelText="取消"
          >
            <Button className="mr33">
              <DeleteOutlined />
              删除
            </Button>
          </Popconfirm>
        )}
      </>
    );
  };

  return (
    <PageCommonWrap>
      <TreeTable
        ref={tableRef}
        isFold={false}
        noSearch={true}
        showButtonContent={false}
        tableTitle="部组管理"
        rightButtonSlot={functionModuleButton}
        getSelectData={(data) => setTableSelectRows(data)}
        columns={functionTableColumns}
        url="/CompanyGroup/GetTreeList"
      />
      <Modal
        maskClosable={false}
        title="添加-部组"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyGroup()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CompanyGroupForm treeData={selectTreeData} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-部组"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyGroup()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={editDataLoading}>
            <CompanyGroupForm treeData={selectTreeData} id={tableSelectRows[0]?.id} type="edit" />
          </Spin>
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyGroup;
