import GeneralTable from '@/components/general-table';
import PageCommonWrap from '@/components/page-common-wrap';
import { FormOutlined } from '@ant-design/icons';
import { Button, Modal, message, Input, DatePicker, Select } from 'antd';
import React, { useRef, useState } from 'react';
import { isArray } from 'lodash';
import { getFeedbackList } from '@/services/system-config/platform-feedback';
import { useRequest } from 'ahooks';
import TableSearch from '@/components/table-search';
import styles from './index.less';
import FeedBackFormfrom from './components/deal-form';
import moment, { Moment } from 'moment';
import EnumSelect from '@/components/enum-select';
import { Spin } from 'antd';
import { SourceType, Category, Status } from '@/services/system-config/platform-feedback';

const { Search } = Input;
const { Option } = Select;

const PlatFormFeedBack: React.FC = () => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [tableSelectRows, setTableSelectRow] = useState<object | object[]>([]);
  const [searchKeyWord, setSearchKeyWord] = useState<string>('');

  const [beginDate, setBeginDate] = useState<Moment | null>();
  const [endDate, setEndDate] = useState<Moment | null>();
  const [sourceType, setSourceType] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [feedbackStatus, setFeedbackStatus] = useState<string | undefined>();

  const [feedbackDetailVisible, setFeedBackDetailVisible] = useState<boolean>(false);

  const { data: detailData, loading, run: getDetailData } = useRequest(getLogManageDetail, { manual: true })

  const rightButton = () => {
    return (
      <div>
        <Button type="primary" onClick={() => dealEvent()}>
          <FormOutlined />
          处理
        </Button>
      </div>
    );
  };

  const searchEvent = () => { };

  const dealEvent = async () => {
    if (tableSelectRows && isArray(tableSelectRows) && tableSelectRows.length === 0) {
      message.error('请选择一条数据查看详情');
      return;
    }
    setFeedBackDetailVisible(true);

    await getDetailData(tableSelectRows[0].id);

  };

  const leftSearchElement = () => {
    return (
      <div className={styles.searchGroup}>
        <TableSearch label="搜索" width="208px">
          <Search
            value={searchKeyWord}
            onSearch={() => search()}
            onChange={(e) => setSearchKeyWord(e.target.value)}
            placeholder="输入标题搜索"
            enterButton
          />
        </TableSearch>

        <TableSearch label="筛选" width="900px" marginLeft="15px">
          <div className={styles.filter}>
            <EnumSelect
              enumList={SourceType}
              value={sourceType}
              className={styles.enumSelect}
              placeholder="来源"
              onChange={(value: any) => setSourceType(value)}
            />
            <EnumSelect
              enumList={Category}
              value={category}
              className={styles.enumSelect}
              placeholder="类别"
              onChange={(value: any) => setCategory(value)}
            />
            <EnumSelect
              enumList={Status}
              value={feedbackStatus}
              className={styles.enumSelect}
              placeholder="状态"
              onChange={(value: any) => setFeedbackStatus(value)}
            />
            <DatePicker
              value={beginDate}
              showTime={{ format: 'HH:mm' }}
              onChange={(value: any) => setBeginDate(value)}
              format="YYYY-MM-DD HH:mm"
              placeholder="开始日期"
            />
            <DatePicker
              value={endDate}
              showTime={{ format: 'HH:mm' }}
              onChange={(value: any) => setEndDate(value)}
              format="YYYY-MM-DD HH:mm"
              placeholder="结束日期"
            />
            <Button type="primary" className="mr7" onClick={() => search()}>
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
    setSearchKeyWord('');
    setBeginDate(null);
    setEndDate(null);
    setCategory(undefined);
    setFeedbackStatus(undefined);
    setSourceType(undefined);
    tableFresh();
  };

  const columns = [
    {
      title: '来源',
      dataIndex: 'sourceType',
      index: 'sourceType',
      width: 150,
      render: (text: any, record: any) => {
        return record.sourceTypeText;
      },
    },
    {
      title: '类别',
      dataIndex: 'category',
      index: 'category',
      width: 150,
      render: (text: any, record: any) => {
        return record.categoryText;
      },
    },
    {
      title: '标题',
      dataIndex: 'title',
      index: 'title',
      width: 180,
    },
    {
      title: '公司',
      dataIndex: 'companyName',
      index: 'companyName',
      width: 240,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      index: 'phone',
      width: 150,
    },
    {
      title: '反馈用户',
      dataIndex: 'createdBy',
      index: 'createdBy',
      width: 200,
      render: (text: any, record: any) => {
        return record.createdByUserName;
      },
    },
    {
      title: '反馈日期',
      dataIndex: 'createdOn',
      index: 'createdOn',
      width: 200,
      render: (text: any, record: any) => {
        return moment(record.createdOn).format('YYYY-MM-DD hh:mm');
      },
    },
    {
      title: '状态',
      dataIndex: 'processStatus',
      index: 'processStatus',
      width: 180,
      render: (text: any, record: any) => {
        return record.processStatusText;
      },
    },
    {
      title: '处理日期',
      dataIndex: 'lastProcessDate',
      index: 'lastProcessDate',
      width: 200,
      render: (text: any, record: any) => {
        return record.lastProcessDate
          ? moment(record.lastProcessDate).format('YYYY-MM-DD hh:mm')
          : null;
      },
    },
  ];


  return (
    <PageCommonWrap>
      <GeneralTable
        ref={tableRef}
        buttonRightContentSlot={rightButton}
        buttonLeftContentSlot={leftSearchElement}
        getSelectData={(data) => setTableSelectRow(data)}
        tableTitle="反馈列表"
        url="/Feedback/GetPagedList"
        columns={columns}
        extractParams={{
          keyWord: searchKeyWord,
          sourceType: sourceType,
          category: category,
          status: feedbackStatus,
          startDate: beginDate,
          endDate: endDate,
        }}
      />
      <Modal
        title="反馈处理"
        width="900px"
        visible={feedbackDetailVisible}
        onCancel={() => setFeedBackDetailVisible(false)}
        footer={null}
      >
        <Spin spinning={loading}>
          <FeedBackFormfrom detailData={detailData} />
        </Spin>
      </Modal>
    </PageCommonWrap>
  );
};

export default PlatFormFeedBack;
