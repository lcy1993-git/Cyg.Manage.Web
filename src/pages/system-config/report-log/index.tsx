import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, DatePicker, Popconfirm, Form } from 'antd';
import React, { useRef, useState } from 'react';
// import ManageUserForm from './components/form';
import { isArray } from 'lodash';
import { getFileLogDetail, deleteReportLog } from '@/services/system-config/report-log';
import { useRequest } from 'ahooks';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import LogDetailTab from '../log-manage/components/tabs';
import moment, { Moment } from 'moment';
import UrlSelect from '@/components/url-select';

const { Search } = Input;
// const testJson = {
//   Accept: 'application/json',
//   Authorization:
//     'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEzMDI5MjI3NzYwNTk4NjMwNDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiNTk4NjMwNDEiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDb21wYW55IiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9jb21wYW55IjoiMTMwMjkyMjAwNzQyODQ4OTIxNiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvaXNzdXBlcmFkbWluIjoiRmFsc2UiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2NsaWVudGlwIjoiMTAuNi45LjIzMSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvZXhwaXJhdGlvbiI6IjIwMjEvMi8zIDE0OjUxOjAwIiwibmJmIjoxNjEyMjQ4NjYwLCJleHAiOjE2MTIzMzUwNjAsImlzcyI6ImN5Z0AyMDE5IiwiYXVkIjoiY3lnQDIwMTkifQ.OBKGGqa0vDYn9MqEn2yb93WWlWc6KyeMFCzESMaanKc',
//   'Content-Length': '596',
//   'Content-Type': 'application/json; charset=utf-8',
//   Expect: '100-continue',
//   Host: '10.6.1.36:8015',
//   'X-Request-Id': '1356510666121211904',
// };

const ManageUser: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);
  const [searchApiKeyWord, setSearchApiKeyWord] = useState<string>('');
  const [detail, setDetail] = useState<object>({});
  const [beginDate, setBeginDate] = useState<Moment | null>();
  const [endDate, setEndDate] = useState<Moment | null>();
  const [applications, setApplications] = useState<string | undefined>();
  const [logDetailVisible, setLogDetailVisible] = useState<boolean>(false);

  const { data, run } = useRequest(getFileLogDetail, {
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
    const LogDetail = await run(checkId);
    setDetail(LogDetail);
    console.log(detail);
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
        title="日志-详情"
        width="980px"
        visible={logDetailVisible}
        onCancel={() => setLogDetailVisible(false)}
        footer={null}
      >
        <pre>{JSON.stringify(detail, null, 2)}</pre>
      </Modal>
    </PageCommonWrap>
  );
};

export default ManageUser;
