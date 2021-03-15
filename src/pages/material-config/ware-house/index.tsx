import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import {
  EditOutlined,
  PlusOutlined,
  PoweroffOutlined,
  DeleteOutlined,
  EyeOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Popconfirm } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getWareHouseDetail,
  addWareHouseItem,
  updateWareHouseItem,
  deleteWareHouseItem,
  restartWareHouse,
} from '@/services/material-config/ware-house';
import { isArray } from 'lodash';
import WareHouseForm from './components/add-edit-form';
import WareHouseDetail from './components/detail-table';
import ImportWareHouse from './components/import-form';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

const WareHouse: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [currentSelectedId, setCurrentSelectedId] = useState<string>('');
  // const [selectedData, setSelectedData] = useState<object>({});
  const [checkDetailVisible, setCheckDetailVisible] = useState<boolean>(false);
  const [importFormVisible, setImportFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getWareHouseDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="关键词" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="关键词"
            allowClear
          />
        </TableSearch>
      </div>
    );
  };

  // 列表刷新
  const refresh = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.refresh();
    }
  };

  // 列表搜索
  const search = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.search();
    }
  };

  const columns = [
    {
      dataIndex: 'id',
      index: 'id',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'name',
      index: 'name',
      title: '名称',
      width: 150,
    },
    {
      dataIndex: 'provinceName',
      index: 'provinceName',
      title: '所在区域',
      width: 180,
    },
    {
      dataIndex: 'tableName',
      index: 'tableName',
      title: '利库表名',
      width: 280,
    },
    {
      dataIndex: 'version',
      index: 'version',
      title: '版本',
      width: 140,
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 200,
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddResourceLib = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          companyId: '',
          province: '',
          name: '',
          version: '',
          remark: '',
        },
        value,
      );
      await addWareHouseItem(submitInfo);
      refresh();
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

    setEditFormVisible(true);
    const ResourceLibData = await run(editDataId);

    editForm.setFieldsValue(ResourceLibData);
  };

  const sureEditResourceLib = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          province: editData.province,
          name: editData.name,
          version: editData.version,
          remark: editData.remark,
        },
        values,
      );
      await updateWareHouseItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  //重启资源服务
  const restartLib = async () => {
    await restartWareHouse();
    message.success('操作成功');
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteWareHouseItem(editDataId);
    refresh();
    message.success('删除成功');
  };

  //查看详情
  const checkDetail = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据查看');
      return;
    }
    const DetailId = tableSelectRows[0].id;
    setCurrentSelectedId(DetailId);
    setCheckDetailVisible(true);
  };

  const importWareHouseEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    setImportFormVisible(true);
  };

  const uploadFinishEvent = () => {
    refresh();
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('ware-house-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            创建
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-delete') && (
          <Popconfirm
            title="您确定要删除该条数据?"
            onConfirm={sureDeleteData}
            okText="确认"
            cancelText="取消"
          >
            <Button className="mr7">
              <DeleteOutlined />
              删除
            </Button>
          </Popconfirm>
        )}

        {buttonJurisdictionArray?.includes('ware-house-import') && (
          <Button className="mr7" onClick={() => importWareHouseEvent()}>
            <ImportOutlined />
            导入
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-check') && (
          <Button className="mr7" onClick={() => checkDetail()}>
            <EyeOutlined />
            查看物料
          </Button>
        )}

        {buttonJurisdictionArray?.includes('ware-house-restart') && (
          <Button className="mr7" onClick={() => restartLib()}>
            <PoweroffOutlined />
            重启服务
          </Button>
        )}
      </div>
    );
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/WareHouse/GetPageList"
        tableTitle="利库管理"
        getSelectData={(data) => setTableSelectRow(data)}
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        title="创建-利库"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddResourceLib()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <WareHouseForm />
        </Form>
      </Modal>
      <Modal
        title="编辑-利库"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditResourceLib()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <WareHouseForm />
          </Spin>
        </Form>
      </Modal>
      <Modal
        footer=""
        destroyOnClose
        title="查看利库物料详情"
        width="1500px"
        visible={checkDetailVisible}
        okText="确认"
        onCancel={() => setCheckDetailVisible(false)}
        cancelText="取消"
      >
        <Spin spinning={loading}>
          <WareHouseDetail overviewId={currentSelectedId} />
        </Spin>
      </Modal>
      <ImportWareHouse
        province={tableSelectRows[0]?.province}
        provinceName={tableSelectRows[0]?.provinceName}
        overviewId={tableSelectRows[0]?.id}
        requestSource="resource"
        visible={importFormVisible}
        changeFinishEvent={() => uploadFinishEvent()}
        onChange={setImportFormVisible}
      />
    </PageCommonWrap>
  );
};

export default WareHouse;
