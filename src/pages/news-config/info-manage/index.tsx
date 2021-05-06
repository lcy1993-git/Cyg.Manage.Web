import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Switch } from 'antd';
import React, {  useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { isArray } from 'lodash';
import '@/assets/icon/iconfont.css';
// import CompanyFileForm from './components/add-edit-form';
import {
  getNewsItemDetail,
  updateNewsItem,
  deleteNewsItem,
  addNewsItem,
  // pushNewsItem,
} from '@/services/news-config/info-manage';
// import DefaultParams from './components/default-params';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import moment from 'moment';
import TextEditor from './component/text-editor';
// import { getGroupInfo } from '@/services/project-management/all-project';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';

const { Search } = Input;

const InfoManage: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  // const [pushTreeVisible, setPushTreeVisible] = useState<boolean>(false);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // 富文本框内容
  const [content, setContent] = useState<string>('');
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getNewsItemDetail, {
    manual: true,
  });

  // const { data: TreeData = [] } = useRequest(() => getGroupInfo('4'));
  // const mapTreeData = (data: any) => {
  //   return {
  //     title: data.text,
  //     key: data.id,
  //     children: data.children ? data.children.map(mapTreeData) : [],
  //   };
  // };

  // const handleData = useMemo(() => {
  //   return TreeData?.map(mapTreeData);
  // }, [JSON.stringify(TreeData)]);


  const searchComponent = () => {
    return (
      <div className={styles.search}>
        <TableSearch label="标题" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入搜索内容"
          />
        </TableSearch>
        <TableSearch label="状态" width="200px" marginLeft="20px">
          <EnumSelect
            enumList={BelongManageEnum}
            placeholder="-全部-"
            // onChange={(value: any) => searchByStatus(value)}
          />
        </TableSearch>
      </div>
    );
  };

  const sureDeleteData = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行删除');
      return;
    }
    const editData = tableSelectRows[0];
    const editDataId = editData.id;

    await deleteNewsItem(editDataId);
    refresh();
    setTableSelectRow([]);
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

  const updateStatus = async (record: any) => {
    const { id } = record;

    // await updateAuthorizationItemStatus(id);
    // tableFresh();
    message.success('状态修改成功');
  };

  const columns = [
    {
      dataIndex: 'title',
      index: 'title',
      title: '标题',
    },
    {
      title: '状态',
      dataIndex: 'isDisable',
      index: 'isDisable',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = !record.isDisable;
        return (
          <>
            {buttonJurisdictionArray?.includes('start-forbid') && (
              <>
                <Switch checked={isChecked} onChange={() => updateStatus(record)} />
                {isChecked ? <span className="ml7">启用</span> : <span className="ml7">禁用</span>}
              </>
            )}
            {!buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked ? <span>启用</span> : <span>禁用</span>)}
          </>
        );
      },
    },
    {
      dataIndex: 'users',
      index: 'users',
      title: '对象',
    },
    {
      dataIndex: 'createByUser',
      index: 'createByUser',
      title: '创建人',
      width: 140,
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 220,
      render: (text: any, record: any) => {
        return moment(record.createdOn).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      dataIndex: 'updateOn',
      index: 'updateOn',
      title: '更新时间',
      width: 220,
      render: (text: any, record: any) => {
        return moment(record.createdOn).format('YYYY-MM-DD HH:mm');
      },
    },
  ];

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddNews = () => {
    addForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          title: '',
          content: content,
        },
        values,
      );

      await addNewsItem(submitInfo);
      refresh();
      message.success('添加成功');
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

    const checkContentData = await run(editDataId);

    setEditFormVisible(true);
    editForm.setFieldsValue(checkContentData);
    setContent(checkContentData.content);
  };

  const sureEditNewsItem = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const submitInfo = Object.assign(
        {
          id: editData.id,
          title: editData.title,
          content: content,
        },
        values,
      );
      await updateNewsItem(submitInfo);
      refresh();
      message.success('更新成功');
      setEditFormVisible(false);
    });
  };

  // const surePushNewsItem = async () => {
  //   const newsId = tableSelectRows[0].id;
  //   await pushNewsItem(newsId, selectedIds);
  //   message.success('推送成功');
  //   setPushTreeVisible(false);
  //   refresh();
  // };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('add-info') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('edit-info') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}
        {buttonJurisdictionArray?.includes('check-info') && (
          <Button className="mr7" onClick={() => checkEvent()}>
            <EditOutlined />
            查看
          </Button>
        )}

        {buttonJurisdictionArray?.includes('delete-info') && (
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

  const checkEvent = () => {
    console.log();
  };

  // const pushSelectEvent = (checkedValue: string[]) => {
  //   setSelectedIds(checkedValue);
  // };

  // const onExpand = (expandedKeysValue: React.Key[]) => {
  //   setExpandedKeys(expandedKeysValue);
  //   setAutoExpandParent(false);
  // };
  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        needCommonButton={true}
        columns={columns}
        url="/News/GetPagedList"
        tableTitle="资讯管理"
        getSelectData={(data) => setTableSelectRow(data)}
        extractParams={{
          keyWord: searchKeyWord,
        }}
      />
      <Modal
        maskClosable={false}
        title="添加-资讯"
        width="880px"
        visible={addFormVisible}
        okText="保存"
        onOk={() => sureAddNews()}
        onCancel={() => setAddFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <TextEditor onChange={setContent} titleForm={addForm} type="add" />
      </Modal>
      <Modal
        maskClosable={false}
        title="编辑-资讯"
        width="880px"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditNewsItem()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <TextEditor onChange={setContent} titleForm={editForm} htmlContent={content} type="edit" />
      </Modal>
      {/* <Modal
        maskClosable={false}
        title="推送-资讯"
        width="450px"
        visible={pushTreeVisible}
        okText="保存"
        onOk={() => surePushNewsItem()}
        onCancel={() => setPushTreeVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <Tree
          onExpand={onExpand}
          checkable
          treeData={handleData}
          onCheck={(value: any) => pushSelectEvent(value)}
          autoExpandParent={autoExpandParent}
          // selectedKeys={selectedIds}
          expandedKeys={expandedKeys}
        />
      </Modal> */}
    </PageCommonWrap>
  );
};

export default InfoManage;
