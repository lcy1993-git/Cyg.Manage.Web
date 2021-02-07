import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { EyeOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, DatePicker } from 'antd';
import React, { useRef, useState } from 'react';
import { isArray } from 'lodash';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import LogDetailTab from '../log-manage/tabs';
import moment, { Moment } from 'moment';
import UrlSelect from '@/components/url-select';

const { Search } = Input;

const LogManage: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);
  const [searchApiKeyWord, setSearchApiKeyWord] = useState<string>('');
  const [searchContentKeyWord, setSearchContentKeyWord] = useState<string>('');

  const [beginDate, setBeginDate] = useState<Moment | null>();
  const [endDate, setEndDate] = useState<Moment | null>();
  const [applications, setApplications] = useState<string | undefined>();
  const [level, setLevel] = useState<string | undefined>();
  const [logDetailVisible, setLogDetailVisible] = useState<boolean>(false);

  const rightButton = () => {
    return (
      <div>
        <Button type="primary" onClick={() => checkDetailEvent()}>
          <EyeOutlined />
          详情
        </Button>
      </div>
    );
  };

  const searchEvent = () => {
    search();
  };

  const checkDetailEvent = () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据查看详情');
      return;
    }
    setLogDetailVisible(true);
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
  const handleLevelSelect = (value: any) => {
    setLevel(value);
  };

  const leftSearchElement = () => {
    return (
      <div className={styles.searchGroup}>
        <TableSearch label="搜索" width="208px">
          <Search
            value={searchApiKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchApiKeyWord(e.target.value)}
            placeholder="跟踪编号/Api地址"
            enterButton
          />
        </TableSearch>
        <TableSearch label="" width="228px">
          <Search
            value={searchContentKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchContentKeyWord(e.target.value)}
            placeholder="(请求、响应、异常)内容"
            enterButton
          />
        </TableSearch>
        <TableSearch label="筛选" width="800px" marginLeft="15px">
          <div className={styles.filter}>
            <UrlSelect
              titleKey="text"
              valueKey="value"
              className={styles.appWidth}
              url="/Log/GetApplications"
              placeholder="应用"
              value={applications}
              onChange={handleAppSelect}
            />
            <UrlSelect
              titleKey="text"
              valueKey="value"
              className={styles.levelWidth}
              url="/Log/GetLevels"
              placeholder="级别"
              value={level}
              onChange={handleLevelSelect}
            />
            <DatePicker
              value={beginDate}
              showTime={{ format: 'HH:mm' }}
              onChange={handleBeginDate}
              format="YYYY-MM-DD HH:mm"
              // onOk={chooseBeginDate}
              placeholder="开始日期"
            />
            <DatePicker
              value={endDate}
              showTime={{ format: 'HH:mm' }}
              onChange={handleEndDate}
              format="YYYY-MM-DD HH:mm"
              placeholder="结束日期"
              // onOk={chooseEndDate}
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
    setSearchContentKeyWord('');
    setBeginDate(null);
    setEndDate(null);
    setApplications(undefined);
    setLevel(undefined);
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
      title: '跟踪编号',
      dataIndex: 'traceId',
      index: 'traceId',
      width: 240,
    },
    {
      title: '日志级别',
      dataIndex: 'logLevel',
      index: 'logLevel',
      width: 120,
    },
    {
      title: 'Api',
      dataIndex: 'reqUrl',
      index: 'reqUrl',
      width: 280,
    },
    {
      title: '内容',
      dataIndex: 'resContent',
      index: 'resContent',
    },
    {
      title: '执行日期',
      dataIndex: 'executeDate',
      index: 'executeDate',
      width: 180,
      render: (text: any, record: any) => {
        return moment(record.executeDate).format('YYYY-MM-DD');
      },
    },
    {
      title: '耗时(秒)',
      dataIndex: 'timeCost',
      index: 'timeCost',
      width: 100,
      render: (text: any, record: any) => {
        return record.timeCost.toFixed(2);
      },
    },
  ];

  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        extractParams={{
          keyWord: searchApiKeyWord,
          logLevel: level,
          application: applications,
          message: searchContentKeyWord,
          beginTime: beginDate,
          endTime: endDate,
        }}
        buttonRightContentSlot={rightButton}
        buttonLeftContentSlot={leftSearchElement}
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="日志管理"
        url="/Log/GetPagedList"
        columns={columns}
      />
      <Modal
        title="日志-详情"
        width="900px"
        visible={logDetailVisible}
        onCancel={() => setLogDetailVisible(false)}
        footer={null}
      >
        <LogDetailTab />
      </Modal>
    </PageCommonWrap>
  );
};

export default LogManage;
