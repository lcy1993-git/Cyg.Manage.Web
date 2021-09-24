import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Modal, Form, Popconfirm, message, Switch } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { isArray } from 'lodash';
import '@/assets/icon/iconfont.css';
import {
  getNewsItemDetail,
  updateNewsItem,
  deleteNewsItem,
  addNewsItem,
  updateNewsState,
} from '@/services/news-config/info-manage';
// import DefaultParams from './components/default-params';
import { useGetButtonJurisdictionArray } from '@/utils/hooks';
import moment from 'moment';
import TextEditor from './component/text-editor';
import EnumSelect from '@/components/enum-select';
import { BelongManageEnum } from '@/services/personnel-config/manage-user';
import CyTag from '@/components/cy-tag';
import CheckInfoModal from './check-info-modal';
import { getUsersIds } from './utils';

const { Search } = Input;

const InfoManage: React.FC = () => {
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRows] = useState<any[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const [addFormVisible, setAddFormVisible] = useState<boolean>(false);
  const [editFormVisible, setEditFormVisible] = useState<boolean>(false);
  const [status, setStatus] = useState<number>(0);

  const [checkInfoVisible, setCheckInfoVisible] = useState<boolean>(false);
  const [currentCheckNewsId, setCurrentCheckNewsId] = useState<string>('');

  // const currentCheckNewsId = useMemo(() => {
  //   if (tableSelectRows && tableSelectRows.length > 0) {
  //     return tableSelectRows[0].id;
  //   }
  //   return '';
  // }, [tableSelectRows]);

  // const [pushTreeVisible, setPushTreeVisible] = useState<boolean>(false);
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  // 富文本框内容
  const [content, setContent] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');
  const [addPersonArray, setAddPersonArray] = useState([]);
  const [editPersonArray, setEditPersonArray] = useState([]);
  const [editPersonUserIds, setEditPersonUserIds] = useState<any[]>([]);

  // const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const editFormRef = useRef<HTMLDivElement>(null);

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
        <TableSearch width="230px">
          <Search
            value={searchKeyWord}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            onSearch={() => search()}
            enterButton
            placeholder="请输入标题/内容"
          />
        </TableSearch>
        <TableSearch label="状态" width="200px" marginLeft="20px">
          <EnumSelect
            enumList={BelongManageEnum}
            placeholder="-全部-"
            onChange={(value: any) => searchByStatus(value)}
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

  const updateStatus = async (id: string, status: boolean) => {
    await updateNewsState(id, status);
    search();
    message.success('状态修改成功');
  };

  const columns = [
    {
      dataIndex: 'title',
      index: 'title',
      title: '标题',
      width: 240,
      render: (text: any, record: any) => {
        return (
          <>
            {buttonJurisdictionArray?.includes('check-info') && (
              <span onClick={() => checkEvent(record.id)} className={styles.checkNewsInfo}>
                {record.title}
              </span>
            )}
            {!buttonJurisdictionArray?.includes('check-info') && <span>{record.title}</span>}
          </>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'isEnable',
      index: 'isEnable',
      width: 120,
      render: (text: any, record: any) => {
        const isChecked = !record.isEnable;
        return (
          <>
            {buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked ? (
                <span
                  style={{ cursor: 'pointer' }}
                  className="colorPrimary"
                  onClick={() => updateStatus(record.id, isChecked)}
                >
                  启用
                </span>
              ) : (
                <span
                  onClick={() => updateStatus(record.id, isChecked)}
                  style={{ cursor: 'pointer' }}
                  className="colorRed"
                >
                  禁用
                </span>
              ))}
            {!buttonJurisdictionArray?.includes('start-forbid') &&
              (isChecked ? (
                <span style={{ cursor: 'pointer' }} className="colorPrimary">
                  启用
                </span>
              ) : (
                <span style={{ cursor: 'pointer' }} className="colorRed">
                  禁用
                </span>
              ))}
          </>
        );
        // const isChecked = !record.isEnable;
        // return (
        //   <>
        //     {buttonJurisdictionArray?.includes('start-forbid') &&
        //       (record.isEnable === true ? (
        //         <>
        //           <Switch
        //             key={status}
        //             defaultChecked
        //             onChange={() => updateStatus(record.id, isChecked)}
        //           />
        //           <span className="formSwitchOpenTip">启用</span>
        //         </>
        //       ) : (
        //         <>
        //           <Switch onChange={() => updateStatus(record.id, isChecked)} />
        //           <span className="formSwitchCloseTip">禁用</span>
        //         </>
        //       ))}
        //     {!buttonJurisdictionArray?.includes('start-forbid') &&
        //       (record.isEnable === true ? <span>启用</span> : <span>禁用</span>)}
        //   </>
        // );
      },
    },

    {
      dataIndex: 'users',
      index: 'users',
      title: '对象',
      render: (text: any, record: any) => {
        return record?.users?.map((item: any) => {
          return (
            <CyTag key={item.value} className="mr7">
              {item.text}
            </CyTag>
          );
        });
      },
    },
    {
      dataIndex: 'createdByUser',
      index: 'createdByUser',
      title: '创建人',
      width: 260,
    },
    {
      dataIndex: 'createdOn',
      index: 'createdOn',
      title: '创建时间',
      width: 160,
      render: (text: any, record: any) => {
        return moment(record.createdOn).format('YYYY-MM-DD HH:mm');
      },
    },
    {
      dataIndex: 'updateOn',
      index: 'updateOn',
      title: '更新时间',
      width: 160,
      render: (text: any, record: any) => {
        return moment(record.modifiedOn).format('YYYY-MM-DD HH:mm');
      },
    },
  ];

  //按宣贯状态查找
  const searchByStatus = (value: any) => {
    setStatus(value);
    if (tableRef && tableRef.current) {
      // @ts-ignore
      tableRef.current.searchByParams({
        state: value,
      });
    }
  };

  //添加
  const addEvent = () => {
    setAddFormVisible(true);
  };

  const sureAddNews = () => {
    addForm.validateFields().then(async (values) => {
      const { userIds } = values;
      const handleIds = addPersonArray.filter((item: any) => userIds?.includes(item.value));
      const finallyIds = getUsersIds(handleIds);

      const submitInfo = {
        title: '',
        content: content,
        isEnable: true,
        clientCategorys: '',
        ...values,
        userIds: finallyIds,
      };

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

    const userIds = checkContentData.users?.map((item) => item.value);

    const clientCategorys = checkContentData.clientCategorys.map((item) => item.value);
    setEditFormVisible(true);
    setEditContent(checkContentData.content);
    setEditPersonUserIds(userIds);
    editForm.setFieldsValue({
      title: checkContentData.title,
      isEnable: checkContentData.isEnable,
      clientCategorys,
    });
  };

  const sureEditNewsItem = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据进行编辑');
      return;
    }
    const editData = data!;

    editForm.validateFields().then(async (values) => {
      const { userIds } = values;

      const handleIds = editPersonArray.filter((item: any) => userIds?.includes(item.value));
      const finallyIds = getUsersIds(handleIds);

      const submitInfo = {
        id: editData.id,
        title: editData.title,
        content: content,
        ...values,
        userIds: finallyIds,
      };

      await updateNewsItem(submitInfo);
      refresh();
      message.success('更新成功');
      setEditFormVisible(false);
    });
  };

  const checkEvent = (id: string) => {
    setCurrentCheckNewsId(id);
    setCheckInfoVisible(true);
  };

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

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonLeftContentSlot={searchComponent}
        buttonRightContentSlot={tableElement}
        columns={columns}
        url="/Article/GetPagedList"
        tableTitle="宣贯"
        getSelectData={(data) => setTableSelectRows(data)}
        extractParams={{
          state: status,
          keyWord: searchKeyWord,
        }}
      />
      {addFormVisible && (
        <Modal
          maskClosable={false}
          title="添加-宣贯"
          width="880px"
          visible={addFormVisible}
          okText="保存"
          onOk={() => sureAddNews()}
          onCancel={() => {
            setAddFormVisible(false);
            addForm.resetFields();
          }}
          cancelText="取消"
          destroyOnClose
        >
          <TextEditor
            getPersonArray={(array) => setAddPersonArray(array)}
            onChange={setContent}
            titleForm={addForm}
            type="add"
          />
        </Modal>
      )}

      <Modal
        maskClosable={false}
        title="编辑-宣贯"
        width="880px"
        visible={editFormVisible}
        okText="保存"
        onOk={() => sureEditNewsItem()}
        onCancel={() => setEditFormVisible(false)}
        cancelText="取消"
        destroyOnClose
      >
        <TextEditor
          htmlContent={editContent}
          getPersonArray={(array) => setEditPersonArray(array)}
          type="edit"
          onChange={setContent}
          titleForm={editForm}
          personDefaultValue={editPersonUserIds}
        />
      </Modal>
      {checkInfoVisible && (
        <CheckInfoModal
          visible={checkInfoVisible}
          onChange={setCheckInfoVisible}
          newsId={currentCheckNewsId}
        />
      )}
    </PageCommonWrap>
  );
};

export default InfoManage;
