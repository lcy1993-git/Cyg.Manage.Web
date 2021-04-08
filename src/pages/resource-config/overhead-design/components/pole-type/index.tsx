import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getPoleTypeDetail,
  updatePoleTypeItem,
  deletePoleTypeItem,
  addPoleTypeItem,
} from '@/services/resource-config/pole-type';
import { isArray } from 'lodash';
import PoleTypeForm from './components/add-edit-form';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

interface CableDesignParams {
  libId: string;
}

const PoleType: React.FC<CableDesignParams> = (props) => {
  const { libId } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getPoleTypeDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="搜索" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="关键词"
          />
        </TableSearch>
      </div>
    );
  };

  //选择资源库传libId
  const searchByLib = (value: any) => {
    setResourceLibId(value);
    search();
  };

  useEffect(() => {
    searchByLib(libId);
  }, [libId]);

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
      dataIndex: 'poleTypeCode',
      index: 'poleTypeCode',
      title: '简号编码',
      width: 180,
    },
    {
      dataIndex: 'poleTypeName',
      index: 'poleTypeName',
      title: '名称',
      width: 280,
    },
    {
      dataIndex: 'category',
      index: 'category',
      title: '类别',
      width: 200,
    },
    {
      dataIndex: 'kvLevel',
      index: 'kvLevel',
      title: '电压等级',
      width: 180,
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 180,
    },
    {
      dataIndex: 'corner',
      index: 'corner',
      title: '转角',
      width: 180,
    },
    {
      dataIndex: 'material',
      index: 'material',
      title: '材质',
      width: 180,
    },
    {
      dataIndex: 'loopNumber',
      index: 'loopNumber',
      title: '回路数',
      width: 180,
    },

    {
      dataIndex: 'isTension',
      index: 'isTension',
      title: '是否耐张',
      width: 180,
      render: (text: any, record: any) => {
        return record.isTension == true ? '是' : '否';
      },
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      width: 180,
    },
  ];

  //添加
  const addEvent = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库！');
      return;
    }
    setAddFormVisible(true);
  };

  const sureAddPoleType = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          poleTypeCode: '',
          poleTypeName: '',
          category: '',
          kvLevel: '',
          type: '',
          corner: '',
          material: '',
          loopNumber: '',
          isTension: false,
          remark: '',
          chartIds: [],
        },
        value,
      );
      await addPoleTypeItem(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  //编辑
  const editEvent = async () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    setEditFormVisible(true);
    const ResourceLibData = await run(resourceLibId, editDataId);

    editForm.setFieldsValue(ResourceLibData);
  };

  const sureEditPoleType = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          id: editData.id,
          poleTypeName: editData.poleTypeName,
          category: editData.category,
          kvLevel: editData.kvLevel,
          type: editData.type,
          corner: editData.corner,
          material: editData.material,
          loopNumber: editData.loopNumber,
          isTension: editData.isTension,
          remark: editData.remark,
          chartIds: editData.chartIds,
        },
        values,
      );
      await updatePoleTypeItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('pole-type-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('pole-type-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('pole-type-delete') && (
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
      </div>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deletePoleTypeItem(resourceLibId, editDataId);
    refresh();
    message.success('删除成功');
  };

  return (
    <>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/PoleType/GetPageList"
        getSelectData={(data) => setTableSelectRow(data)}
        type="radio"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-杆型"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddPoleType()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <PoleTypeForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-杆型"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditPoleType()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <PoleTypeForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>
    </>
  );
};

export default PoleType;
