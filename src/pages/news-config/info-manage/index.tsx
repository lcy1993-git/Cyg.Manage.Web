import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  PushpinOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Tree } from 'antd';
import React, { useMemo, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { isArray } from 'lodash';
import '@/assets/icon/iconfont.css';
// import CompanyFileForm from './components/add-edit-form';
import {
  getNewsItemDetail,
  updateNewsItem,
  deleteNewsItem,
  undoNewsItem,
  addNewsItem,
  pushNewsItem,
} from '@/services/news-config/info-manage';
// import DefaultParams from './components/default-params';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import moment from 'moment';
import TextEditor from './component/text-editor';
import { getGroupInfo } from '@/services/project-management/all-project';

const { Search } = Input;

const InfoManage: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [pushTreeVisible, setPushTreeVisible] = useState<boolean>(false);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // 富文本框内容
  const [content, setContent] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const buttonJurisdictionArray = useGetButtonJurisdictionArray();
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const { data, run } = useRequest(getNewsItemDetail, {
    manual: true,
  });

  const { data: TreeData = [] } = useRequest(() => getGroupInfo('4'));
  const mapTreeData = (data: any) => {
    return {
      title: data.text,
      key: data.id,
      children: data.children ? data.children.map(mapTreeData) : [],
    };
  };

  const handleData = useMemo(() => {
    return TreeData?.map(mapTreeData);
  }, [JSON.stringify(TreeData)]);

  const parentIds = handleData.map((item) => {
    return item.key;
  });
  console.log(parentIds);

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(parentIds);
  console.log(expandedKeys);

  const searchComponent = () => {
    return (
      <div>
        <TableSearch label="标题" width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入搜索内容"
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

  const columns = [
    {
      dataIndex: 'title',
      index: 'title',
      title: '标题',
    },
    {
      dataIndex: 'createByUser',
      index: 'createByUser',
      title: '创建用户',
      width: 220,
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建日期',
      width: 220,
      render: (text: any, record: any) => {
        return moment(record.createdOn).format('YYYY-MM-DD HH:mm:ss');
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

  //撤回
  const withdrawEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行撤回');
      return;
    }
    await undoNewsItem(tableSelectRows[0].id);
    message.success('操作成功');
    refresh();
  };

  const pushEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条资讯推送');
      return;
    }
    setPushTreeVisible(true);
  };

  const surePushNewsItem = async () => {
    const newsId = tableSelectRows[0].id;
    await pushNewsItem(newsId, selectedIds);
    message.success('推送成功');
    setPushTreeVisible(false);
    refresh();
  };

  const tableElement = () => {
    return (
      <div className={styles.buttonArea}>
        {buttonJurisdictionArray?.includes('company-file-add') && (
          <Button type="primary" className="mr7" onClick={() => addEvent()}>
            <PlusOutlined />
            添加
          </Button>
        )}

        {buttonJurisdictionArray?.includes('company-file-edit') && (
          <Button className="mr7" onClick={() => editEvent()}>
            <EditOutlined />
            编辑
          </Button>
        )}

        {buttonJurisdictionArray?.includes('company-file-edit') && (
          <Button className="mr7" onClick={() => pushEvent()}>
            <PushpinOutlined />
            推送
          </Button>
        )}

        {buttonJurisdictionArray?.includes('company-file-delete') && (
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
        {buttonJurisdictionArray?.includes('company-file-defaultOptions') && (
          <Button className={styles.iconParams} onClick={() => withdrawEvent()}>
            <UndoOutlined />
            撤回
          </Button>
        )}
      </div>
    );
  };

  const pushSelectEvent = (checkedValue: string[]) => {
    setSelectedIds(checkedValue);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };
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
        title="添加-资讯"
        width="820px"
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
        title="编辑-资讯"
        width="820px"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditNewsItem()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <TextEditor onChange={setContent} titleForm={editForm} htmlContent={content} type="edit" />
      </Modal>
      <Modal
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
      </Modal>
    </PageCommonWrap>
  );
};

export default InfoManage;
