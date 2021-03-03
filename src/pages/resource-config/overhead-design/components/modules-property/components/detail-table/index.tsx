import GeneralTable from '@/components/general-table';
import TableSearch from '@/components/table-search';
import { Input, Button, message, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import styles from './index.less';
import { isArray } from 'lodash';
import {
  updateModulesDetailItem,
  addModuleDetailItem,
  deleteModulesDetailItem,
  getModuleDetailItem,
} from '@/services/resource-config/modules-property';
import { useRequest } from 'ahooks';

interface ModuleDetailParams {
  libId: string;
  moduleIds?: string[];
}

const { Search } = Input;

const ModuleDetailTable: React.FC<ModuleDetailParams> = (props) => {
  const { libId, moduleIds } = props;

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [resourceLibId, setResourceLibId] = useState<string>('');
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [ids, setIds] = useState<string[]>([]);

  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run, loading } = useRequest(getModuleDetailItem, {
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

  //选择资源库传libId
  const searchByLib = (value: any) => {
    // console.log(value);
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
      dataIndex: 'moduleId',
      index: 'moduleId',
      title: '模块编号',
      width: 180,
    },
    {
      dataIndex: 'moduleName',
      index: 'moduleName',
      title: '模块名称',
      width: 500,
    },

    {
      dataIndex: 'part',
      index: 'part',
      title: '所属部件',
      width: 180,
    },
    {
      dataIndex: 'itemId',
      index: 'itemId',
      title: '物料/组件编码',
      width: 220,
    },
    {
      dataIndex: 'itemName',
      index: 'itemName',
      title: '物料组件/名称',
      width: 180,
    },
    {
      dataIndex: 'itemNumber',
      index: 'itemNumber',
      title: '数量',
      width: 150,
    },
    {
      dataIndex: 'isComponent',
      index: 'isComponent',
      title: '是否组件',
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

  const sureAddModuleDetail = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          libId: libId,
          moduleId: '',
          moduleName: '',
          shortName: '',
          typicalCode: '',
          poleTypeCode: '',
          unit: '',
          moduleType: '',
          forProject: '',
          forDesign: '',
          remark: '',
          chartIds: [],
        },
        value,
      );
      await addModuleDetailItem(submitInfo);
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

  const sureEditModuleProperty = () => {
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          libId: libId,
          moduleName: editData.moduleName,
          part: editData.part,
          componentId: editData.componentId,
          materialId: editData.materialId,
          itemNumber: editData.itemNumber,
          isComponent: editData.isComponent,
        },
        values,
      );
      await updateModulesDetailItem(submitInfo);
      refresh();
      message.success('更新成功');
      editForm.resetFields();
      setEditFormVisible(false);
    });
  };

  const sureDeleteData = async () => {
    if (
      (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) ||
      tableSelectRows.length > 1
    ) {
      message.error('请选择一条数据删除');
      return;
    }
    tableSelectRows.map((item) => {
      ids.push(item.id);
    });

    await deleteModulesDetailItem({ libId, ids });
    refresh();
    message.success('删除成功');
  };

  const tableRightSlot = (
    <>
      <Button type="primary" className="mr7" onClick={() => addEvent()}>
        <PlusOutlined />
        添加
      </Button>
      <Button className="mr7" onClick={() => editEvent()}>
        <EditOutlined />
        编辑
      </Button>
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
    </>
  );

  return (
    <div>
      <GeneralTable
        buttonLeftContentSlot={() => searchComponent()}
        buttonRightContentSlot={() => tableRightSlot}
        ref={tableRef}
        url="/ModulesDetails/GetPageList"
        columns={columns}
        type="radio"
        requestSource="resource"
        extractParams={{ libId: libId, moduleIds: moduleIds }}
      />
    </div>
  );
};

export default ModuleDetailTable;
