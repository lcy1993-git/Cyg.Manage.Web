import React, { useState } from 'react';
import { history } from 'umi';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import { Input, Button, Modal, Form, Switch, message, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EyeOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { isArray } from 'lodash';
import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import AddDictionaryForm from './components/add-edit-form';
import {
  setRateTableStatus,
  deleteRateTable,
  addRateTable,
  editRateTable
} from '@/services/technology-economic/common-rate';
import styles from './index.less';
import moment from 'moment';

const { Search } = Input;

type DataSource = {
  id: string;
  [key: string]: string;
}


const ProjectList: React.FC = () => {

  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<DataSource[] | object>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [modalType, setModalType] = useState<string>("");
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const buttonJurisdictionArray = useGetButtonJurisdictionArray();

  const [form] = Form.useForm();

  const columns = [
    {
      dataIndex: 'number',
      key: 'number',
      title: '序号',
      width: 160,
    },
    {
      dataIndex: 'sourceFile',
      key: 'sourceFile',
      title: '费率表类型显示名称',
      width: 300,
    },
    {
      dataIndex: 'isDemolitionMajor',
      key: 'isDemolitionMajor',
      title: '是否拆除',
      width: 60,
      render(v: boolean) {
        console.log(v);
        
        return <span>{ v ? "是" : "否" }</span>
      }
    },
    {
      dataIndex: 'publishDate',
      key: 'publishDate',
      title: '发布时间',
      width: 130,
      render(v: string) {
        return moment(v).format('YYYY-MM-DD')
      }
    },
    {
      dataIndex: 'publishOrg',
      key: 'publishOrg',
      title: '发布机构',
      width: 150
    },
    {
      dataIndex: 'year',
      key: 'year',
      title: '费率年度',
      width: 100
    },
    {
      dataIndex: 'industryType',
      key: 'industryType',
      title: '行业类别',
      width: 150,
    },
    {
      dataIndex: 'majorTypeText',
      key: 'majorTypeText',
      title: '适用专业',
      width: 150,
    },
    {
      dataIndex: 'enabled',
      key: 'enabled',
      title: '状态',
      width: 70,
      render(value: boolean, record: DataSource) {
        return (
          <Switch
            defaultChecked={value}
            onClick={(checked) => {
              setRateTableStatus(record.id, checked);
            }}
          />
        );
      }
    },
    {
      dataIndex: 'remark',
      index: 'remark',
      title: '备注',
      width: 220
    },
  ];


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
    form.resetFields();
    setModalType('add');
    setFormVisible(true);
  };

  // const sureAddAuthorization = () => {
  //   form.validateFields().then(async (values: AddRateTable) => {
  //     await addRateTable({...values});
  //     refresh();
  //     setFormVisible(false);
  //     form.resetFields();
  //   });
  // };

  // 编辑
  const editEvent = () => {

    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
    } else {
      console.log(tableSelectRows[0]);
      const publishDate = moment(tableSelectRows[0].publishDate);
      setModalType('edit');
      setFormVisible(true);
      form.setFieldsValue({ ...tableSelectRows[0], publishDate })
    }

  };

  // 查看详情
  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const id = tableSelectRows[0].id;
    await deleteRateTable(id);
    refresh();
    message.success('删除成功');
  };

  const gotoMoreInfo = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行查看');
      return;
    }
    history.push(`/technology-economic/common-rate-infomation?id=${tableSelectRows[0].id}&isDemolition=${tableSelectRows[0].isDemolitionMajor ? 1 : ""}`)
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>

        {
          !buttonJurisdictionArray?.includes('commonrate-add') &&
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        }
        {
          !buttonJurisdictionArray?.includes('commonrate-edit') &&
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        }
        {
          !buttonJurisdictionArray?.includes('commonrate-del') &&
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
          !buttonJurisdictionArray?.includes('commonrate-info') &&
          <Button className="mr7" onClick={() => gotoMoreInfo()}>
            <EyeOutlined />
            费率详情
          </Button>
        }

      </div>
    );
  };

  const tableSelectEvent = (data: DataSource[] | object) => {
    setTableSelectRow(data);
  };

  const onModalOkClick = async () => {
    const { id } = tableSelectRows[0];
    const values = await form.validateFields();
    
    if (modalType === 'add') {
      await addRateTable({ ...values, }).then(() => {
        message.success('添加成功')
        refresh();
        setFormVisible(false);
        form.resetFields();
      });

    } else if (modalType === 'edit') {
      console.log(values);
      
      await editRateTable({ ...values, id }).then(() => {
        message.success('编辑成功')
        refresh();
        setFormVisible(false);
        form.resetFields();
      });
    }
  }

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns as (ColumnsType<object>)}
        url="/RateTable/QueryRateFilePager"
        tableTitle="定额计价(安装乙供设备计入设备购置费)-常用费率"
        getSelectData={tableSelectEvent}
        requestSource='tecEco1'
        type="radio"
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title={`${modalType === 'add' ? '添加' : '编辑'}-常用费率`}
        width="880px"
        visible={formVisible}
        okText="确认"
        onOk={onModalOkClick}
        onCancel={()=>setFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Form form={form} preserve={false}>
          <AddDictionaryForm />
        </Form>
      </Modal>
    </PageCommonWrap>
  );
};

export default ProjectList;