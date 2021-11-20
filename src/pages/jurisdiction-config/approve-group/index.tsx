import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input, Modal, Form, message, Spin } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import '@/assets/icon/iconfont.css';
import { useRequest } from 'ahooks';
import {
  getApproveGroupById,
  deleteApproveGroup,
  createApproveGroup,
  modifyApproveGroup,
  updateApproveState,
} from '@/services/jurisdiction-config/approve-group';
import { isArray } from 'lodash';
import styles from './index.less';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import ModalConfirm from '@/components/modal-confirm';
import ApproveGroupForm from './components/add-edit-form';

const { Search } = Input;

const ApproveGroup: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const [groupId, setGroupId] = useState<string>('');
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray();
  const { data, run, loading } = useRequest(getApproveGroupById, {
    manual: true,
  });

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'status',
      index: 'status',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = record.status;
        return (
          <>
            {buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked === 2 ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                  onClick={async () => {
                    await updateApproveState({ id: record.id, isEnable: true });
                    tableFresh();
                  }}
                >
                  禁用
                </span>
              ) : (
                <span
                  onClick={async () => {
                    await updateApproveState({ id: record.id, isEnable: false });
                    tableFresh();
                  }}
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                >
                  启用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked === 2 ? (
                <span style={{ cursor: 'pointer' }} className="colorRed">
                  禁用
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }} className="colorPrimary">
                  启用
                </span>
              ))}
          </>
        );
      },
    },
    {
      title: '审批责任人',
      dataIndex: 'userName',
      index: 'userName',
      width: 180,
    },
    {
      title: '成员',
      dataIndex: 'users',
      index: 'users',
      render: (text: any, record: any) => {
        const roles = record.users?.map((item: any) => {
          return (
            <CyTag className="mr7" key={uuid.v1()}>
              {item.text}
            </CyTag>
          );
        });

        return roles;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      index: 'remark',
      width: '30%',
    },
  ];

  const searchElement = () => {
    return (
      <div>
        <TableSearch width="248px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入模板名称"
            enterButton
          />
        </TableSearch>
      </div>
    );
  };

  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search();
    }
  };

  const sureDeleteData = async () => {
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteApproveGroup(editDataId);
    tableFresh();

    message.success('删除成功');
    setTableSelectRows([]);
  };

  //添加
  const addEvent = async () => {
    setAddFormVisible(true);
  };

  const sureAddApproveGroup = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          remark: '',
        },
        value,
      );

      await createApproveGroup(submitInfo);
      tableFresh();
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
    setGroupId(editDataId);
    const ApproveGroupData = await run(editDataId);

    editForm.setFieldsValue(ApproveGroupData);
    setEditFormVisible(true);
  };

  const sureEditApproveGroup = () => {
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
          status: editData.status,
          remark: editData.remark,
        },
        values,
      );

      await modifyApproveGroup(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const buttonElement = () => {
    return (
      <div>
        {buttonJurisdictionArray?.includes('role-permissions-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('role-permissions-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('role-permissions-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={buttonElement}
        getSelectData={(data) => setTableSelectRows(data)}
        url="/ProjectApproveGroup/GetPagedList"
        columns={columns}
        tableTitle="立项审批管理"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-模板"
        width="40%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddApproveGroup()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={loading}>
          <Form form={addForm} preserve={false}>
            <ApproveGroupForm />
          </Form>
        </Spin>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-模板"
        width="60%"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditApproveGroup()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Form form={editForm} preserve={false}>
          <ApproveGroupForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default ApproveGroup;
