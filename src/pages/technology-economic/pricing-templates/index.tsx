import React, { useState } from 'react';
import { history } from 'umi';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { Input, Button, Modal, Form, Switch, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { isArray } from 'lodash';

import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import DictionaryForm from './components/add-edit-form';

import {
  createMaterialMachineLibrary,
  deleteMaterialMachineLibrary,
  setMaterialMachineLibraryStatus,
} from '@/services/technology-economic';
import styles from './index.less';

type DataSource = {
  id: string;
  [key: string]: string;
};

const { Search } = Input;

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    title: '编号',
    width: 300,
  },
  {
    dataIndex: 'quotaLibrarys',
    key: 'quotaLibrarys',
    title: '模板类型',
  },
  {
    dataIndex: 'publishDate',
    key: 'publishDate',
    title: '发布时间',
  },
  {
    dataIndex: 'publishOrg',
    key: 'publishOrg',
    title: '版本',
  },
  {
    dataIndex: 'year',
    key: 'year',
    title: '备注',
  },
  {
    dataIndex: 'enabled',
    key: 'enabled',
    title: '状态',
    render(value: boolean, record: DataSource) {
      return (
        <Switch
          defaultChecked={value}
          onClick={(checked) => {
            setMaterialMachineLibraryStatus(record.id, checked);
          }}
        />
      );
    },
  },
];

const PricingTemplates: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<DataSource[] | Object>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();

  const searchComponent = () => {
    return (
      <TableSearch label="关键词" width="203px">
        <Search
          value={searchKeyWord}
          onChange={(e) => setSearchKeyWord(e.target.value)}
          onSearch={() => tableSearchEvent()}
          enterButton
          placeholder="键名"
        />
      </TableSearch>
    );
  };

  const tableSearchEvent = () => {
    search();
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

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      await createMaterialMachineLibrary(values);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const id = tableSelectRows[0].id;
    await deleteMaterialMachineLibrary(id);
    refresh();
    message.success('删除成功');
  };

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
    const id = tableSelectRows[0].id;
    history.push(`/technology-economic/material-infomation?id=${id}`);
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {!buttonJurisdictionArray?.includes('quotaLib-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {!buttonJurisdictionArray?.includes('quotaLib-del') && (
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
        {!buttonJurisdictionArray?.includes('quotaLib-info') && (
          <Button className="mr7" onClick={() => gotoMoreInfo()}>
            <EyeOutlined />
            查看详情
          </Button>
        )}
      </div>
    );
  };

  const tableSelectEvent = (data: DataSource[] | Object) => {
    setTableSelectRows(data);
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as ColumnsType<DataSource | object>}
        url="/MaterialMachineLibrary/QueryMaterialMachineLibraryPager"
        tableTitle="材机库管理"
        getSelectData={tableSelectEvent}
        requestSource="tecEco"
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-定额库"
        width="880px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddAuthorization()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <DictionaryForm type="add" />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default PricingTemplates;
