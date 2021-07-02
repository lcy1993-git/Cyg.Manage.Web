import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getCableWellDetail,
  updateCableWellItem,
  deleteCableWellItem,
  addCableWellItem,
} from '@/services/resource-config/cable-well';
import { isArray } from 'lodash';

import CableWellForm from './components/add-edit-form';
import CableWellDetail from './components/detail-table/index';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

interface CableDesignParams {
  libId: string;
}

const CableWell: React.FC<CableDesignParams> = (props) => {
  const { libId } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [ids, setIds] = useState<string[]>([]);
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [detailVisible, setDetailVisible] = useState<boolean>(false);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getCableWellDetail, {
    manual: true,
  });

  const searchComponent = () => {
    return (
      <div className={styles.searchArea}>
        <TableSearch label="电缆井" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入电缆井信息"
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
      dataIndex: 'cableWellId',
      index: 'cableWellId',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'cableWellName',
      index: 'cableWellName',
      title: '名称',
      width: 420,
    },
    {
      dataIndex: 'shortName',
      index: 'shortName',
      title: '简称',
      width: 200,
    },
    {
      dataIndex: 'typicalCode',
      index: 'typicalCode',
      title: '典设编码',
      width: 220,
    },
    {
      dataIndex: 'type',
      index: 'type',
      title: '类型',
      width: 140,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 140,
    },
    {
      dataIndex: 'width',
      index: 'width',
      title: '宽度(mm)',
      width: 180,
    },

    {
      dataIndex: 'depth',
      index: 'depth',
      title: '井深',
      width: 180,
    },
    {
      dataIndex: 'feature',
      index: 'feature',
      title: '特征',
      width: 180,
    },
    {
      dataIndex: 'pavement',
      index: 'pavement',
      title: '路面环境',
      width: 200,
    },
    {
      dataIndex: 'size',
      index: 'size',
      title: '尺寸',
      width: 180,
    },
    {
      dataIndex: 'coverMode',
      index: 'coverMode',
      title: '盖板模式',
      width: 200,
    },
    {
      dataIndex: 'grooveStructure',
      index: 'grooveStructure',
      title: '沟体结构',
      width: 200,
    },
    {
      dataIndex: 'forProject',
      index: 'forProject',
      title: '所属工程',
      width: 240,
    },
    {
      dataIndex: 'forDesign',
      index: 'forDesign',
      title: '所属设计',
      width: 240,
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

  const sureAddMaterial = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: resourceLibId,
          cableWellId: '',
          cableWellName: '',
          shortName: '',
          typicalCode: '',
          type: '',
          unit: '',
          width: 0,
          depth: 0,
          isConfined: 0,
          isSwitchingPipe: 0,
          feature: '',
          pavement: '',
          size: '',
          coverMode: '',
          grooveStructure: '',
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: [],
        },
        value,
      );
      await addCableWellItem(submitInfo);
      refresh();
      message.success('添加成功');
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

  const sureEditCableWell = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          id: editData.id,
          cableWellName: editData.cableWellName,
          shortName: editData.shortName,
          typicalCode: editData.typicalCode,
          type: editData.type,
          unit: editData.unit,
          width: editData.width,
          depth: editData.depth,
          isConfined: editData.isConfined,
          isSwitchingPipe: editData.isSwitchingPipe,
          feature: editData.feature,
          pavement: editData.pavement,
          size: editData.size,
          coverMode: editData.coverMode,
          grooveStructure: editData.grooveStructure,
          forProject: editData.forProject,
          forDesign: editData.forDesign,
          remark: editData.remark,
          chartIds: editData.chartIds,
        },
        values,
      );
      await updateCableWellItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('cable-well-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-well-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-well-delete') && (
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

        {buttonJurisdictionArray?.includes('cable-well-detail') && (
          <Button className={styles.importBtn} onClick={() => openDetail()}>
            电缆井明细
          </Button>
        )}
      </div>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    tableSelectRows.map((item) => {
      ids.push(item.id);
    });

    await deleteCableWellItem({ libId, ids });
    refresh();
    message.success('删除成功');
  };

  //展示组件明细
  const openDetail = () => {
    if (!resourceLibId) {
      message.warning('请先选择资源库');
      return;
    }
    setDetailVisible(true);
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
        url="/CableWell/GetPageList"
        getSelectData={(data) => setTableSelectRow(data)}
        type="checkbox"
        extractParams={{
          resourceLibId: libId,
          keyWord: searchKeyWord,
        }}
      />

      <Modal
        maskClosable={false}
        title="添加-电缆井"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddMaterial()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <CableWellForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-电缆井"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditCableWell()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CableWellForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        footer=""
        title="电缆井明细"
        width="92%"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <CableWellDetail
            libId={libId}
            cableWellId={tableSelectRows.map((item) => {
              return item.id;
            })}
          ></CableWellDetail>
        </Spin>
      </Modal>
    </>
  );
};

export default CableWell;
