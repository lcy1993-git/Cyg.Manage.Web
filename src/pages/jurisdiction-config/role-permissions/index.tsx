import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input, Modal, Form, message, Spin } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import '@/assets/icon/iconfont.css';
import { useRequest, useBoolean } from 'ahooks';
import {
  getAuthorizationDetail,
  updateAuthorizationItem,
  updateAuthorizationItemStatus,
  deleteAuthorizationItem,
  addAuthorizationItem,
  getAuthorizationTreeList,
} from '@/services/jurisdiction-config/role-permissions';
import { isArray } from 'lodash';
import RolePermissionsForm from './components/add-edit-form';
import CheckboxTreeTable from '@/components/checkbox-tree-table';
import styles from './index.less';
import UserAuthorization from './components/user-authorization';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import ModalConfirm from '@/components/modal-confirm';

const { Search } = Input;

const RolePermissions: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [
    authorizationFormVisible,
    { setFalse: authorizationFormHide, setTrue: authorizationFormShow },
  ] = useBoolean(false);

  //@ts-ignore
  const { userType } = JSON.parse(localStorage.getItem('userInfo'));

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const buttonJurisdictionArray: any = useGetButtonJurisdictionArray();

  const { data, run } = useRequest(getAuthorizationDetail, {
    manual: true,
  });

  const {
    data: MoudleTreeData = [],
    run: getModuleTreeData,
    loading,
  } = useRequest(getAuthorizationTreeList, { manual: true });

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      index: 'name',
      width: 220,
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      index: 'isDisable',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = !record.isDisable;
        return (
          <>
            {buttonJurisdictionArray?.includes('role-permissions-start-using') && (
              <>
                {/* <Switch checked={isChecked} onChange={() => updateStatus(record)} /> */}
                {isChecked ? (
                  <span
                    style={{ cursor: 'pointer' }}
                    className="colorPrimary"
                    onClick={() => updateStatus(record)}
                  >
                    启用
                  </span>
                ) : (
                  <span
                    onClick={() => updateStatus(record)}
                    style={{ cursor: 'pointer' }}
                    className="colorRed"
                  >
                    禁用
                  </span>
                )}
              </>
            )}
            {!buttonJurisdictionArray?.includes('role-permissions-start-using') &&
              (isChecked ? <span>启用</span> : <span>禁用</span>)}
          </>
        );
      },
    },
    {
      title: '授权对象',
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

  const updateStatus = async (record: any) => {
    const { id } = record;

    await updateAuthorizationItemStatus(id);
    tableFresh();
    message.success('状态修改成功');
  };

  const searchElement = () => {
    return (
      <div className={styles.search}>
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

    await deleteAuthorizationItem(editDataId);
    tableFresh();

    message.success('删除成功');
    setTableSelectRows([]);
  };

  // const distributeEvent = async () => {
  //   if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
  //     message.error('请选择角色模板');
  //     return;
  //   }
  //   const editData = tableSelectRows[0];
  //   const editDataId = editData.id;

  //   setDistributeFormVisible(true);

  //   await getModuleTreeData(editDataId);
  // };

  // const sureDistribute = () => {
  //   apportionForm.validateFields().then(async (values) => {
  //     const templateId = tableSelectRows[0].id;
  //     const { moduleIds } = values;

  //     await updateAuthorizationModules({ templateId, moduleIds });
  //     setDistributeFormVisible(false);
  //     tableFresh();
  //     message.success('角色功能分配成功');
  //     apportionForm.resetFields();
  //   });
  // };

  //授权
  const authorizationEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择授权角色模板');
      return;
    }
    authorizationFormShow();
    setCurrentId(tableSelectRows[0].id);
  };

  const cancelAuthorization = () => {
    authorizationFormHide();
  };

  //添加
  const addEvent = async () => {
    setAddFormVisible(true);
    await getModuleTreeData();
  };

  const sureAddRolePermissions = () => {
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

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    const AuthorizationData = await run(editDataId);

    editForm.setFieldsValue(AuthorizationData);
    setEditFormVisible(true);
  };

  const sureEditRolePermissions = () => {
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
          isDisable: editData.isDisable,
          remark: editData.remark,
        },
        values,
      );

      await updateAuthorizationItem(submitInfo);
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
          // <Popconfirm
          //   title="您确定要删除该条数据?"
          //   onConfirm={sureDeleteData}
          //   okText="确认"
          //   cancelText="取消"
          //   // disabled
          // >

          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
        {/* {buttonJurisdictionArray?.includes('role-permissions-allocation-function') && (
          <Button className="mr7" onClick={() => distributeEvent()}>
            <ApartmentOutlined />
            分配功能模块
          </Button>
        )} */}
        {buttonJurisdictionArray?.includes('role-permissions-authorization') && (
          <Button className="mr7" onClick={() => authorizationEvent()}>
            <i className="iconfont iconshouquan" />
            授权
          </Button>
        )}
      </div>
    );
  };

  // const tabsRightSlot = (
  //   <div>
  //     <span className="tipInfo mr7">权限优先级：</span>
  //     <span className="tipInfo">用户 &gt; 角色</span>
  //   </div>
  // );

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchElement}
        buttonRightContentSlot={buttonElement}
        getSelectData={(data) => setTableSelectRows(data)}
        url="/AuthTemplate/GetPagedList"
        columns={columns}
        tableTitle="功能权限管理"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-模板"
        width="60%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddRolePermissions()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Spin spinning={loading}>
          <Form form={addForm} preserve={false}>
            <RolePermissionsForm />
            <Form.Item name="moduleIds">
              <CheckboxTreeTable treeData={MoudleTreeData} />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-模板"
        width="60%"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditRolePermissions()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
      >
        <Form form={editForm} preserve={false}>
          <RolePermissionsForm />
          <Form.Item name="moduleIds">
            <CheckboxTreeTable treeData={data?.modules} />
          </Form.Item>
        </Form>
      </Modal>
      {/* <Modal
        maskClosable={false}
        title="分配功能模块"
        width="80%"
        visible={distributeFormVisible}
        okText="确认"
        onOk={() => sureDistribute()}
        onCancel={() => setDistributeFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={apportionForm} preserve={false}></Form>
      </Modal> */}
      <Modal
        maskClosable={false}
        footer=""
        title="授权"
        width="90%"
        visible={authorizationFormVisible}
        okText="确认"
        onCancel={() => cancelAuthorization()}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={loading}>
          <UserAuthorization
            onChange={tableFresh}
            extractParams={{
              templateId: currentId,
            }}
          />
        </Spin>
      </Modal>
    </PageCommonWrap>
  );
};

export default RolePermissions;
