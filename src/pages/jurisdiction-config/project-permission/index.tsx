import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { Button, Input, Modal, Form, message, Spin, Tooltip } from 'antd';
import React, { useState } from 'react';
import { EditOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import '@/assets/icon/iconfont.css';
import { useRequest, useBoolean } from 'ahooks';
import {
  addEditProPermissionItem,
  getProPermissionItem,
  updateProPermissionStatus,
  deleteProPermissionItem,
} from '@/services/jurisdiction-config/project-permission';
import { isArray } from 'lodash';
import styles from './index.less';
import CyTag from '@/components/cy-tag';
import uuid from 'node-uuid';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import ProjectPermissionForm from './components/add-edit-form';
import CategoryTable from './components/category-table';
import UserPermissionAccredit from './components/user-authorization';
import ModalConfirm from '@/components/modal-confirm';

const { Search } = Input;

const ProjectPermission: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [currentId, setCurrentId] = useState<string>('');
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [permissionItem, setPermissionItem] = useState<any[]>([]);
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [
    permissionFormVisible,
    { setFalse: authorizationFormHide, setTrue: authorizationFormShow },
  ] = useBoolean(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const { data, run, loading } = useRequest(getProPermissionItem, {
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
      dataIndex: 'isDisable',
      index: 'isDisable',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = !record.isDisable;
        return (
          <>
            {buttonJurisdictionArray?.includes('project-permissions-start-using') && (
              <>
                {/* <Switch
                  checked={isChecked}
                  onChange={async () => {
                    await updateProPermissionStatus({ id: record.id, isDisable: isChecked });
                    tableFresh();
                    message.success('状态修改成功');
                  }}
                /> */}
                {isChecked ? (
                  <span
                    style={{ cursor: 'pointer' }}
                    className="colorPrimary"
                    onClick={async () => {
                      await updateProPermissionStatus({ id: record.id, isDisable: isChecked });
                      tableFresh();
                      message.success('状态修改成功');
                    }}
                  >
                    启用
                  </span>
                ) : (
                  <span
                    style={{ cursor: 'pointer' }}
                    className="colorRed"
                    onClick={async () => {
                      await updateProPermissionStatus({ id: record.id, isDisable: isChecked });
                      tableFresh();
                      message.success('状态修改成功');
                    }}
                  >
                    禁用
                  </span>
                )}
              </>
            )}
            {!buttonJurisdictionArray?.includes('project-permissions-start-using') &&
              (isChecked ? <span>启用</span> : <span>禁用</span>)}
          </>
        );
      },
    },
    {
      title: '授权人员',
      dataIndex: 'users',
      index: 'users',
      render: (text: any, record: any) => {
        return record.users
          ? record.users.map((item: any) => {
              return (
                <CyTag className="mr7" key={uuid.v1()}>
                  {item.text}
                </CyTag>
              );
            })
          : null;
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
      <div className={styles.search}>
        <TableSearch width="278px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入权限组名称"
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
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteProPermissionItem(editDataId);
    tableFresh();
    message.success('删除成功');
    setTableSelectRows([]);
  };

  //授权
  const authorizationEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择项目权限组模板');
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
  };

  const sureAddProjectPermissions = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          name: '',
          remark: '',
          items: permissionItem,
        },
        value,
      );

      await addEditProPermissionItem(submitInfo);
      tableFresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const titleElement = () => {
    return (
      <Tooltip
        title="创建项目权限组模板并且授权给对应的管理端用户后，该用户可以查看对应权限范围内的所有项目。"
        placement="right"
      >
        <QuestionCircleOutlined style={{ paddingLeft: 10 }} />
      </Tooltip>
    );
  };

  //编辑
  const editEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    const PermissionData = await run(editDataId);

    setPermissionItem(PermissionData?.items);

    editForm.setFieldsValue(PermissionData);
    setEditFormVisible(true);
  };

  const sureEditProPermissions = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const editItemData = permissionItem.map((item) => {
        return {
          category: item.category,
          objectId: item.objectId,
          projectTypes: item.projectTypes.map((item: any) => item.value ?? item),
        };
      });

      const submitInfo = Object.assign(
        {
          id: editData.id,
          name: editData.name,
          remark: editData.remark,
          items: editItemData,
        },
        values,
      );
      await addEditProPermissionItem(submitInfo);
      tableFresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const buttonElement = () => {
    return (
      <div>
        {buttonJurisdictionArray?.includes('project-permissions-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('project-permissions-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('project-permissions-delete') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
        {/* {buttonJurisdictionArray?.includes('role-permissions-allocation-function') && (
          <Button className="mr7" onClick={() => distributeEvent()}>
            <ApartmentOutlined />
            分配功能模块
          </Button>
        )} */}
        {buttonJurisdictionArray?.includes('project-permissions-authorization') && (
          <Button className="mr7" onClick={() => authorizationEvent()}>
            <i className="iconfont iconshouquan" />
            授权
          </Button>
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
        url="/ProjectAuthorityGroup/GetPagedList"
        columns={columns}
        titleSlot={titleElement}
        tableTitle="项目权限组"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-项目权限组"
        width="60%"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddProjectPermissions()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <ProjectPermissionForm />
          <CategoryTable getItems={setPermissionItem} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-项目权限组"
        width="60%"
        visible={editFormVisible}
        centered
        okText="确认"
        onOk={() => sureEditProPermissions()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <ProjectPermissionForm />
          <CategoryTable getItems={setPermissionItem} editItems={permissionItem} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        footer=""
        title="授权"
        width="90%"
        visible={permissionFormVisible}
        okText="确认"
        onCancel={() => cancelAuthorization()}
        cancelText="取消"
        destroyOnClose
      >
        <Spin spinning={loading}>
          <UserPermissionAccredit
            onChange={tableFresh}
            extractParams={{
              groupId: currentId,
            }}
          />
        </Spin>
      </Modal>
    </PageCommonWrap>
  );
};

export default ProjectPermission;
