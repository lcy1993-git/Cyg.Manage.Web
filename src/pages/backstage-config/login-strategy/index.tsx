import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { PlusOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, message } from 'antd';
import React, { useState } from 'react';
import { createLoginStrategy, deleteLoginStrategy } from '@/services/system-config/login-strategy';
import { isArray } from 'lodash';
import EnumSelect from '@/components/enum-select';

import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import ModalConfirm from '@/components/modal-confirm';
import AddLoginStrategyForm from './components/add-form';
import moment from 'moment';

const { Search } = Input;

enum LoginEnum {
  '全部',
  '授权账号',
  '授权IP ',
}

const LoginStrategy: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [addForm] = Form.useForm();

  const searchComponent = () => {
    return (
      <div className="flex" style={{ width: '450px' }}>
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入名称/IP"
          />
        </TableSearch>
        <TableSearch marginLeft="20px" label="类型" width="260px">
          <EnumSelect
            placeholder="-全部-"
            enumList={LoginEnum}
            style={{ width: '120px' }}
            onChange={(value: any) => searchByType(value)}
          />
        </TableSearch>
      </div>
    );
  };

  //选择省份onChange事件
  const searchByType = (value: any) => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        authorizeType: value,
      });
    }
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteLoginStrategy(editDataId);
    refresh();
    setTableSelectRows([]);
    message.success('删除成功');
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
      dataIndex: 'key',
      index: 'key',
      title: '授权账号/授权IP',
      width: 240,
    },
    {
      dataIndex: 'authorizeType',
      index: 'authorizeType',
      title: '类型',
      width: 150,
      render: (text: any, record: any) => {
        return record.authorizeTypeText;
      },
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 200,
      render: (text: any) => moment(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      dataIndex: 'createdByUserName',
      index: 'createdByUserName',
      title: '创建用户',
      width: 180,
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

  const sureAddLoginStrategy = () => {
    addForm.validateFields().then(async (value) => {
      const submitInfo = Object.assign(
        {
          key: '',
          authorizeType: 1,
          remark: '',
        },
        value,
      );
      await createLoginStrategy(submitInfo);
      refresh();
      setAddFormVisible(false);
      addForm.resetFields();
    });
  };

  const tableElement = () => {
    return (
      <div>
        {buttonJurisdictionArray?.includes('add-login-user') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}
        {buttonJurisdictionArray?.includes('delete-login-user') && (
          <ModalConfirm changeEvent={sureDeleteData} selectData={tableSelectRows} />
        )}
      </div>
    );
  };

  //   const titleSlotElement = () => {
  //     return <div className={styles.routeComponent}></div>;
  //   };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        // titleSlot={titleSlotElement}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        url="/LoginAuthorize/GetPagedList"
        tableTitle="登录授权策略"
        getSelectData={(data) => setTableSelectRows(data)}
        type="checkbox"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-策略"
        width="680px"
        visible={addFormVisible}
        okText="确认"
        onOk={() => sureAddLoginStrategy()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={addForm} preserve={false}>
          <AddLoginStrategyForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default LoginStrategy;
