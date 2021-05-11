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
import CompanyManageForm from './components/add-form';
import EditCompanyManageForm from './components/edit-form';
import TableStatus from '@/components/table-status';
import uuid from 'node-uuid';

const mapColor = {
  无: 'gray',
  管理端: 'greenOne',
  勘察端: 'greenTwo',
  评审端: 'greenThree',
  技经端: 'greenFour',
  设计端: 'greenFive',
};

const CompanyManage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);
  const [currentCompanyData, setCurrentCompanyData] = useState<object[]>([]);
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
      title: '授权账户数',
      dataIndex: 'skus',
      index: 'skus',
      render: (text: any, record: any) => {
        const { skus } = record;
        const element = (skus ?? []).map((item: any) => {
          return (
            <TableStatus className="mr7" color={mapColor[item.key.text] ?? 'gray'} key={uuid.v1()}>
              {item.key.text}（{item.value.totalQty}）
            </TableStatus>
          );
        });
        return <>{element}</>;
      },
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
      const userSkuQtys = [
        { key: 4, value: value.prospect },
        { key: 8, value: value.design },
        { key: 32, value: value.skillBy },
        { key: 16, value: value.review },
        { key: 2, value: value.manage },
      ];
      const submitInfo = {
        name: value.name,
        parentId: value.parentId,
        address: value.address,
        userSkuQtys,
        remark: value.remark,
      };

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

    const CompanyManageData = await run(editDataId);
    setCurrentCompanyData(CompanyManageData?.skus);
    setEditFormVisible(true);
    editForm.setFieldsValue({
      ...CompanyManageData,
    });
  };

  const sureEditCompanyManage = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请先选择一条数据进行编辑');
      return;
    }
    const editData = data!;
    console.log(editData);
    

    editForm.validateFields().then(async (value) => {
      const userSkuQtys = [
        { key: 4, value: value.prospect },
        { key: 8, value: value.design },
        { key: 32, value: value.skillBy },
        { key: 16, value: value.review },
        { key: 2, value: value.manage },
      ];
      const submitInfo = {
        id: editData.id,
        name: editData.name,
        address: editData.address,
        remark: editData.remark,
        userSkuQtys,
      };
      console.log(submitInfo);
      

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
        maskClosable={false}
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
          <CompanyManageForm treeData={selectTreeData} />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
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
          <EditCompanyManageForm accreditNumber={currentCompanyData} />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default CompanyManage;
