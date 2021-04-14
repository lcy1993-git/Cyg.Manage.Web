import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, DatePicker, Popconfirm, Spin } from 'antd';
import React, { useRef, useState } from 'react';
import { isArray } from 'lodash';
import { getFileLogDetail, deleteReportLog } from '@/services/system-config/report-log';
import { useRequest } from 'ahooks';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import moment, { Moment } from 'moment';
import UrlSelect from '@/components/url-select';
import ReactJson from 'react-json-view';

const { Search } = Input;

const ManageUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);
  const [searchApiKeyWord, setSearchApiKeyWord] = useState<string>('');
  const [beginDate, setBeginDate] = useState<Moment | null>();
  const [endDate, setEndDate] = useState<Moment | null>();
  const [applications, setApplications] = useState<string | undefined>();
  const [logDetailVisible, setLogDetailVisible] = useState<boolean>(false);

  const { data, run, loading } = useRequest(getFileLogDetail, {
    manual: true,
  });

  const rightButton = () => {
    return (
      <div>
        <Button type="primary" className="mr7" onClick={() => checkDetailEvent()}>
          <EyeOutlined />
          详情
        </Button>
        <Popconfirm
          title="您确定要删除该条数据?"
          onConfirm={sureDeleteData}
          okText="确认"
          cancelText="取消"
        >
          <Button>
            <DeleteOutlined />
            删除
          </Button>
        </Popconfirm>
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

    await deleteReportLog(editDataId);
    tableFresh();
    message.success('删除成功');
  };

  const searchEvent = () => {
    search();
  };

  const checkDetailEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据查看详情');
      return;
    }
    setLogDetailVisible(true);
    const checkId = tableSelectRows[0].id;
    await run(checkId);
  };

  //重置后，条件添加onChange事件重新获取value
  const handleBeginDate = (value: any) => {
    setBeginDate(value);
  };
  const handleEndDate = (value: any) => {
    setEndDate(value);
  };

  const handleAppSelect = (value: any) => {
    setApplications(value);
  };

  const leftSearchElement = () => {
    return (
      <div className={styles.searchGroup}>
        <TableSearch label="搜索" width="220px">
          <Search
            value={searchApiKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchApiKeyWord(e.target.value)}
            placeholder="文件名/ip/用户"
            enterButton
            allowClear
          />
        </TableSearch>
        <TableSearch label="筛选" width="800px" marginLeft="15px">
          <div className={styles.filter}>
            <UrlSelect
              titleKey="text"
              valueKey="value"
              className={styles.appWidth}
              url="/FileLog/GetApplications"
              placeholder="应用"
              value={applications}
              onChange={handleAppSelect}
              allowClear
            />
            <DatePicker
              value={beginDate}
              showTime={{ format: 'HH:mm' }}
              onChange={handleBeginDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="开始日期"
            />
            <DatePicker
              value={endDate}
              showTime={{ format: 'HH:mm' }}
              onChange={handleEndDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="结束日期"
            />
            <Button type="primary" className="mr7" onClick={() => searchEvent()}>
              查询
            </Button>
            <Button className="mr7" onClick={() => resetEvent()}>
              重置
            </Button>
          </div>
        </TableSearch>
      </div>
    );
  };

  const search = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.search();
    }
  };
  //数据修改刷新
  const tableFresh = () => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current?.refresh();
    }
  };

  //重置搜索条件
  const resetEvent = () => {
    setSearchApiKeyWord('');
    setBeginDate(null);
    setEndDate(null);
    setApplications(undefined);
    tableFresh();
  };

  const columns = [
    {
      title: '应用程序',
      dataIndex: 'application',
      index: 'application',
      width: 240,
    },
    {
      title: '文件名',
      dataIndex: 'fileName',
      index: 'fileName',
      width: 240,
    },
    {
      title: '用户名',
      dataIndex: 'userIdentity',
      index: 'userIdentity',
      width: 240,
    },
    {
      title: '客户端IP',
      dataIndex: 'clientIp',
      index: 'clientIp',
      width: 140,
    },
    {
      title: '上报日期',
      dataIndex: 'upTime',
      index: 'upTime',
      width: 240,
      render: (text: any, record: any) => {
        return moment(record.upTime).format('YYYY-MM-DD');
      },
    },
  ];

  // console.log(data?.content ? JSON.parse(data?.content) : null);

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        extractParams={{
          keyWord: searchApiKeyWord,
          application: applications,
          beginTime: beginDate,
          endTime: endDate,
        }}
        buttonRightContentSlot={rightButton}
        buttonLeftContentSlot={leftSearchElement}
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="上报日志"
        url="/FileLog/GetPagedList"
        columns={columns}
        type="radio"
      />
      <Modal
        maskClosable={false}
        title="日志-详情"
        width="980px"
        visible={logDetailVisible}
        onCancel={() => setLogDetailVisible(false)}
        footer={null}
        destroyOnClose
        centered
      >
        <Spin spinning={loading}>
          <div
            style={{
              height: '720px',
              wordBreak: 'break-all',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
            }}
          >
            <ReactJson src={data} />
          </div>
        </Spin>
      </Modal>
    </PageCommonWrap>
  );
};

export default ManageUser;
