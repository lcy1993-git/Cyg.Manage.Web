import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message, Spin, Popconfirm } from 'antd';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import {
  getCableChannelDetail,
  deleteCableChannelItem,
  updateCableChannelItem,
  addCableChannelItem,
} from '@/services/resource-config/cable-channel';
import { isArray } from 'lodash';
import CableChannelForm from './components/add-edit-form';
import CableChannelDetail from './components/detail-table';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';

const { Search } = Input;

interface CableDesignParams {
  libId: string;
}

const CableChannel: React.FC<CableDesignParams> = (props) => {
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

  const { data, run, loading } = useRequest(getCableChannelDetail, {
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

  const searchByLib = (value: any) => {
    setResourceLibId(value);
    search();
  };

  useEffect(() => {
    searchByLib(libId);
  }, [libId]);

  const columns = [
    {
      dataIndex: 'channelId',
      index: 'channelId',
      title: '编号',
      width: 180,
    },
    {
      dataIndex: 'channelName',
      index: 'channelName',
      title: '名称',
      width: 480,
    },
    {
      dataIndex: 'shortName',
      index: 'shortName',
      title: '简称',
      width: 320,
    },
    {
      dataIndex: 'typicalCode',
      index: 'typicalCode',
      title: '典设编码',
      width: 220,
    },
    {
      dataIndex: 'channelCode',
      index: 'channelCode',
      title: '规格简号',
      width: 320,
    },
    {
      dataIndex: 'unit',
      index: 'unit',
      title: '单位',
      width: 180,
    },
    {
      dataIndex: 'reservedWidth',
      index: 'reservedWidth',
      title: '预留宽度(mm)',
      width: 180,
    },

    {
      dataIndex: 'digDepth',
      index: 'digDepth',
      title: '挖深',
      width: 180,
    },
    {
      dataIndex: 'layingMode',
      index: 'layingMode',
      title: '敷设方式',
      width: 240,
    },
    {
      dataIndex: 'cableNumber',
      index: 'cableNumber',
      title: '电缆数量',
      width: 240,
    },
    {
      dataIndex: 'pavement',
      index: 'pavement',
      title: '路面环境',
      width: 240,
    },
    {
      dataIndex: 'protectionMode',
      index: 'protectionMode',
      title: '保护方式',
      width: 240,
    },
    {
      dataIndex: 'ductMaterialId',
      index: 'ductMaterialId',
      title: '电缆管材质编号',
      width: 320,
    },
    {
      dataIndex: 'arrangement',
      index: 'arrangement',
      title: '排列方式',
      width: 180,
    },
    {
      dataIndex: 'bracketNumber',
      index: 'bracketNumber',
      title: '支架层数',
      width: 180,
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
      width: 220,
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
          libId: libId,
          channelId: '',
          channelName: '',
          shortName: '',
          typicalCode: '',
          channelCode: '',
          unit: '',
          reserveWidth: 0,
          digDepth: 0,
          layingMode: '',
          cableNumber: 0,
          pavement: '',
          protectionMode: '',
          ductMaterialId: '',
          arrangement: '',
          bracketNumber: 0,
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: '',
        },
        value,
      );
      await addCableChannelItem(submitInfo);
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

  const sureEditMaterial = () => {
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
          channelName: editData.channelName,
          shortName: editData.shortName,
          typicalCode: editData.typicalCode,
          channelCode: editData.channelCode,
          unit: editData.unit,
          reserveWidth: editData.reserveWidth,
          digDepth: editData.digDepth,
          layingMode: editData.layingMode,
          cableNumber: editData.cableNumber,
          pavement: editData.pavement,
          protectionMode: editData.protectionMode,
          ductMaterialId: editData.ductMaterialId,
          arrangement: editData.arrangement,
          bracketNumber: editData.bracketNumber,
          forProject: editData.forProject,
          forDesign: editData.forDesign,
          remark: editData.remark,
          chartIds: editData.chartIds,
        },
        values,
      );
      await updateCableChannelItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('cable-channel-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-channel-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('cable-channel-delete') && (
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

        {buttonJurisdictionArray?.includes('cable-channel-detail') && (
          <Button className={styles.importBtn} onClick={() => openDetail()}>
            电缆通道明细
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

    await deleteCableChannelItem({ libId, ids });
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
        buttonRightContentSlot={tableElement}
        buttonLeftContentSlot={searchComponent}
        needCommonButton={true}
        columns={columns}
        requestSource="resource"
        url="/CableChannel"
        getSelectData={(data) => setTableSelectRow(data)}
        type="checkbox"
        extractParams={{
          libId: libId,
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-电缆通道"
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
          <CableChannelForm resourceLibId={resourceLibId} type="add" />
        </Form>
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-电缆通道"
        width="680px"
        visible={editFormVisible}
        okText="确认"
        onOk={() => sureEditMaterial()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        bodyStyle={{ height: '680px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Form form={editForm} preserve={false}>
          <Spin spinning={loading}>
            <CableChannelForm resourceLibId={resourceLibId} />
          </Spin>
        </Form>
      </Modal>

      <Modal
        maskClosable={false}
        footer=""
        title="电缆通道明细"
        width="92%"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        okText="确认"
        cancelText="取消"
        bodyStyle={{ height: '650px', overflowY: 'auto' }}
        destroyOnClose
      >
        <Spin spinning={loading}>
          <CableChannelDetail
            libId={libId}
            cableChannelId={tableSelectRows.map((item) => {
              return item.id;
            })}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default CableChannel;
