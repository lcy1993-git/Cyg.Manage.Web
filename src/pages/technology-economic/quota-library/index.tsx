import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EyeOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Switch, message, Popconfirm } from 'antd';
import React, { useState } from 'react';
import DictionaryForm from './components/add-edit-form';
import { getCatalogueList } from '@/services/technology-economics/quota-library';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import styles from './index.less';
import moment from 'moment';
import { isArray } from 'lodash';

const { Search } = Input;

interface RouteListItem {
  name: string;
  id: string;
}

const columns = [
  {
    dataIndex: 'name',
    index: 'name',
    title: '名称',
    width: 300,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '使用材机库',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '定额类别',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '发布时间',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '发布机构',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '价格年度',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '行业类别',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '适用专业',
    width: 160,
  },
  {
    dataIndex: 'categoryText',
    index: 'categoryText',
    title: '状态',
    width: 160,
    render(){
      return (
        <Switch/>
      );
    }
  },
  {
    dataIndex: 'remark',
    index: 'remark',
    title: '备注',
    width: 400
  },
];

const QuotaLibrary: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [selectIds, setSelectIds] = useState<string[]>([]);

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

  const searchByParams = (params: object) => {
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams(params);
    }
  };

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddAuthorization = () => {
    addForm.validateFields().then(async (values) => {
      
      console.log(values);
      
      // await createQuotaLibrary({releaseDate: new Date().getTime(), ...values});
      // refresh();
      // setAddFormVisible(false);
      // addForm.resetFields();
    });
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }

    // await deleteCableChannelItem({ libId, ids });
    refresh();
    message.success('删除成功');
  };

  const importLineStreeSagEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择要操作的行');
      return;
    }
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {
          !buttonJurisdictionArray?.includes('quotaLib-add') &&
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        }
        {
          !buttonJurisdictionArray?.includes('quotaLib-del') &&
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
        }
        {
          !buttonJurisdictionArray?.includes('quotaLib-info') &&
          <Button className="mr7" onClick={() => importLineStreeSagEvent()}>
            <EyeOutlined />
            查看详情
          </Button>
        }

      </div>
    );
  };

  const tableSelectEvent = (data: any) => {
    setTableSelectRow(data);
    setSelectIds(data.map((item: any) => item.id));
  };

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        url="/QuotaLibraryManager/GetPageList"
        tableTitle="定额库管理"
        getSelectData={tableSelectEvent}
        requestSource='tecEco'
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
          <DictionaryForm type='add' />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default QuotaLibrary;
