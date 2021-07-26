import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EditOutlined, PlusOutlined, ReloadOutlined, SwapOutlined } from '@ant-design/icons';
import { Button, Modal, Form, message, Input, Switch, Spin } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import CompanyUserForm from './components/add-edit-form';
import { isArray } from 'lodash';
import {
  getCompanyUserDetail,
  addCompanyUserItem,
  updateCompanyUserItem,
  updateItemStatus,
  resetItemPwd,
  batchAddCompanyUserItem,
  getCurrentCompanyInfo,
} from '@/services/personnel-config/company-user';
import { getTreeSelectData } from '@/services/operation-config/company-group';
import { useRequest } from 'ahooks';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import ResetPasswordForm from './components/reset-form';
import moment from 'moment';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import BatchAddCompanyUser from './components/batch-add-form';
import TableStatus from '@/components/table-status';
import uuid from 'node-uuid';
import CyTag from '@/components/cy-tag';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import CommonTitle from '@/components/common-title';
import AccreditStatistic from './components/accredit-statistic';
import { history } from 'umi';
import { useLayoutStore } from '@/layouts/context';

const { Search } = Input;

const mapColor = {
  无: 'gray',
  管理端: 'greenOne',
  勘察端: 'greenTwo',
  评审端: 'greenThree',
  技经端: 'greenFour',
  设计端: 'greenFive',
};

const CompanyUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<object | object[]>([]);

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [status, setStatus] = useState<number>(0);

  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [batchAddFormVisible, setBatchAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [resetFormVisible, setResetFormVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [batchAddForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { data, run, loading } = useRequest(getCompanyUserDetail, {
    manual: true,
  });

  const { data: selectTreeData = [], run: getSelectTreeData } = useRequest(getTreeSelectData, {
    manual: true,
  });

  const { data: accreditData, run: getAccreditData } = useRequest(() => getCurrentCompanyInfo());

  const handleData = useMemo(() => {
    if (accreditData) {
      return accreditData.skus.map((item: any) => {
        return item.value;
      });
    }
    return;
  }, [accreditData]);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const { setWorkHandoverFlag: setWorkHandoverFlag, workHandoverFlag } = useLayoutStore();

  const rightButton = () => {
    return (
      <div>
        {buttonJurisdictionArray?.includes('company-user-batch-add') && (
          <Button type="primary" className="mr7" onClick={() => batchAddEvent()}>
            <PlusOutlined />
            批量添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-user-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-user-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-user-reset-password') && (
          <Button className="mr7" onClick={() => resetEvent()}>
            <ReloadOutlined />
            重置密码
          </Button>
        )}
        {buttonJurisdictionArray?.includes('company-user-work-handover') && (
          <Button
            onClick={() => {
              !workHandoverFlag
                ? handoverEvent()
                : message.error('当前已打开“工作交接”界面，请关闭后重试');
            }}
          >
            <SwapOutlined />
            工作交接
          </Button>
        )}
      </div>
    );
  };

  //工作交接跳转
  const handoverEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择需要工作交接的用户');
      return;
    }
    const userId = tableSelectRows[0].id;
    const name = tableSelectRows[0].name;
    const userName = tableSelectRows[0].userName;
    history.push({
      pathname: `/personnel-config/work-handover?id=${userId}&&name=${name}&&userName=${userName}`,
    });
  };

  //数据修改刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
      getAccreditData();
    }
  };

  const resetEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.warning('请选择需要重置密码的用户');
      return;
    }
    setResetFormVisible(true);
  };

  //重置密码
  const resetPwd = async () => {
    editForm.validateFields().then(async (values) => {
      const editData = tableSelectRows[0];
      const editDataId = editData.id;
      const newPassword = Object.assign({ id: editDataId, pwd: values.pwd });

      await resetItemPwd(newPassword);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setResetFormVisible(false);
    });
  };

  const addEvent = async () => {
    await getSelectTreeData();
    setAddFormVisible(true);
  };

  const sureAddCompanyUserItem = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          pwd: '',
          groupIds: [],
          email: '',
          nickName: '',
          name: '',
        },
        value,
      );
      await addCompanyUserItem(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const batchAddEvent = async () => {
    await getSelectTreeData();
    setBatchAddFormVisible(true);
  };

  const sureBatchAddCompanyUser = () => {
    batchAddForm.validateFields().then(async (values) => {
      await batchAddCompanyUserItem({ ...values });
      message.success('批量增加成功');
      refresh();
      setBatchAddFormVisible(false);
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

    const ManageUserData = await run(editDataId);

    console.log(ManageUserData);

    editForm.setFieldsValue({
      ...ManageUserData,
      groupIds: (ManageUserData.comapnyGroups ?? []).map((item: any) => item.value),
      userStatus: String(ManageUserData.userStatus),
      clientCategorys: (ManageUserData.authorizeClientList ?? [])
        .map((item: any) => item.value)
        .filter((item: any) => item > 1),
    });
  };

  const sureEditCompanyUser = () => {
    const editData = data!;
    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          email: editData.email,
          nickName: editData.nickName,
        },
        values,
      );
      await updateCompanyUserItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  //数据改变状态
  const updateStatus = async (record: any) => {
    await updateItemStatus(record);
    refresh();
    message.success('状态修改成功');
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'userName',
      index: 'userName',
      width: '7%',
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      index: 'nickName',
      width: '7%',
    },
    {
      title: '真实姓名',
      dataIndex: 'name',
      index: 'name',
      width: '6%',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      index: 'phone',
      width: '8%',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      index: 'email',
      width: '10%',
    },
    {
      title: '部组',
      dataIndex: 'comapnyGroups',
      index: 'comapnyGroups',
      width: '10%',
      render: (text: any, record: any) => {
        const { comapnyGroups } = record;
        return (comapnyGroups ?? []).map((item: any) => {
          return (
            <CyTag key={uuid.v1()} className="mr7">
              {item.text}
            </CyTag>
          );
        });
      },
    },
    {
      title: '状态',
      dataIndex: 'userStatus',
      index: 'userStatus',
      width: '8%',
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('company-user-start-using') &&
              (record.userStatus === 1 ? (
                <>
                  <Switch key={status} defaultChecked onChange={() => updateStatus(record.id)} />
                  <span className="formSwitchOpenTip">启用</span>
                </>
              ) : (
                <>
                  <Switch
                    checked={false}
                    onChange={() => {
                      updateStatus(record.id);
                    }}
                  />
                  <span className="formSwitchCloseTip">禁用</span>
                </>
              ))}
            {!buttonJurisdictionArray?.includes('company-user-start-using') &&
              (record.userStatus === 1 ? <span>启用</span> : <span>禁用</span>)}
          </>
        );
      },
    },
    {
      title: '授权端口',
      dataIndex: 'authorizeClient',
      index: 'authorizeClient',
      render: (text: any, record: any) => {
        const { authorizeClientTexts } = record;

        const element = (authorizeClientTexts ?? []).map((item: string) => {
          return (
            <TableStatus
              className="mr7"
              color={record.userStatus === 1 ? mapColor[item] ?? 'gray' : 'gray'}
              key={uuid.v1()}
            >
              {item}
            </TableStatus>
          );
        });
        return <>{element}</>;
      },
    },
    {
      title: '最后登录IP',
      dataIndex: 'lastLoginIp',
      index: 'lastLoginIp',
      width: '8%',
    },
    {
      title: '最后登录日期',
      dataIndex: 'lastLoginDate',
      index: 'lastLoginDate',
      width: '7.66%',
      render: (text: any, record: any) => {
        return record.lastLoginDate ? moment(record.lastLoginDate).format('YYYY-MM-DD') : null;
      },
    },
  ];

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const searchByStatus = (value: any) => {
    setStatus(value);
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        userStatus: value,
      });
    }
  };

  const leftSearch = () => {
    return (
      <div className={styles.search}>
        <TableSearch label="用户信息" width="248px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="请输入用户信息"
            enterButton
          />
        </TableSearch>
        <TableSearch label="状态" width="200px" marginLeft="20px">
          <EnumSelect
            enumList={BelongManageEnum}
            onChange={(value: any) => searchByStatus(value)}
            placeholder="-全部-"
          />
        </TableSearch>
      </div>
    );
  };

  const addModalCloseEvent = () => {
    setAddFormVisible(false);
    addForm.resetFields();
  };

  const batchAddCloseEvent = () => {
    setBatchAddFormVisible(false);
    batchAddForm.resetFields();
  };

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.companyUser}>
        <div className={styles.accreditNumber}>
          <div className="flex1">
            <div className={styles.accreditTitle}>
              <CommonTitle noPadding={true}>授权数</CommonTitle>
            </div>
            <div className="flex">
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="勘察端" icon="prospect" accreditData={handleData?.[1]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="设计端" icon="design" accreditData={handleData?.[2]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="技经端" icon="skillBy" accreditData={handleData?.[4]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="评审端" icon="review" accreditData={handleData?.[3]} />
              </div>
              <div className={styles.accreditStatisticItem}>
                <AccreditStatistic label="管理端" icon="manage" accreditData={handleData?.[0]} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.userTable}>
          <GeneralTable
            ref={tableRef}
            buttonRightContentSlot={rightButton}
            buttonLeftContentSlot={leftSearch}
            getSelectData={(data) => setTableSelectRows(data)}
            tableTitle="公司用户"
            url="/CompanyUser/GetPagedList"
            columns={columns}
            extractParams={{
              keyWord: searchKeyWord,
              userStatus: status,
            }}
          />
        </div>
      </div>

      <Modal
        maskClosable={false}
        title="添加-公司用户"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddCompanyUserItem()}
        onCancel={() => addModalCloseEvent()}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CompanyUserForm treeData={selectTreeData} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="批量添加-公司用户"
        width="680px"
        visible={batchAddFormVisible}
        okText="确认"
        onOk={() => sureBatchAddCompanyUser()}
        onCancel={() => batchAddCloseEvent()}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={batchAddForm} preserve={false}>
          <BatchAddCompanyUser treeData={selectTreeData} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-公司用户"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCompanyUser()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CompanyUserForm treeData={selectTreeData} />
          </Spin>
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="重置密码"
        width="680px"
        visible={resetFormVisible}
        okText="确认"
        onOk={() => resetPwd()}
        onCancel={() => setResetFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <ResetPasswordForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyUser;
