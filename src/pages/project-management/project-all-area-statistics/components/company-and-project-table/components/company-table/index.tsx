import { useRequest } from 'ahooks';
import { getStatisticsListByCompany } from '@/services/project-management/project-statistics-v2';
import { useSize } from 'ahooks';
import uuid from 'node-uuid';
import React, { useMemo, useRef } from 'react';
import ShowChangeComponent from '../show-change-component';

import styles from './index.less';
import RateComponent from '../../../rate-component';
import moment from 'moment';
import { isNumber } from 'lodash';
import { useProjectAllAreaStatisticsStore } from '@/pages/project-management/project-all-area-statistics/store';
import { Tooltip, Table } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons/lib/icons';

interface CompanyTableParams {
  companyId: string;
}

const CompanyTable: React.FC<CompanyTableParams> = (props) => {
  const { companyId } = props;

  const { data: dataSource = [], loading } = useRequest(
    () => getStatisticsListByCompany({ companyId: companyId }),
    { refreshDeps: [companyId] },
  );
  const {
    setCompanyInfo,
    setDataType,
    setProjectShareCompanyId,
  } = useProjectAllAreaStatisticsStore();
  const companyNameClickEvent = (id: string, name: string) => {
    setDataType('project');
    setCompanyInfo({
      companyId: id,
      companyName: name,
    });
    setProjectShareCompanyId(companyId);
  };

  const tableColumns = [
    {
      title: '公司名称',
      dataIndex: 'name',
      index: 'name',
      width: 160,
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <span className="canClick" onClick={() => companyNameClickEvent(record.id, record.name)}>
            {record.name}
          </span>
        );
      },
    },
    {
      title: '待安排(较昨日变化)',
      dataIndex: 'waitArrange',
      index: 'waitArrange',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel1.todayQty - record.statusQtyModel1.yesterdayQty}
          >
            {record.statusQtyModel1.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '未勘察(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel2.todayQty - record.statusQtyModel2.yesterdayQty}
          >
            {record.statusQtyModel2.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '勘察中(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel3.todayQty - record.statusQtyModel3.yesterdayQty}
          >
            {record.statusQtyModel3.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '已勘察(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel4.todayQty - record.statusQtyModel4.yesterdayQty}
          >
            {record.statusQtyModel4.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '设计中(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel5.todayQty - record.statusQtyModel5.yesterdayQty}
          >
            {record.statusQtyModel5.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '已设计(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel6.todayQty - record.statusQtyModel6.yesterdayQty}
          >
            {record.statusQtyModel6.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: '合计(较昨日变化)',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      render: (text: string, record: any) => {
        return (
          <ShowChangeComponent
            changeNumber={record.statusQtyModel7.todayQty - record.statusQtyModel7.yesterdayQty}
          >
            {record.statusQtyModel7.todayQty}
          </ShowChangeComponent>
        );
      },
    },
    {
      title: () => {
        return (
          <div>
            综合进度 &nbsp;
            <Tooltip title="综合进度代表该公司所有项目进度平均值">
              <QuestionCircleOutlined />
            </Tooltip>
          </div>
        );
      },
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      width: 160,
      render: (text: string, record: any) => {
        return <>{record.progressRate && <RateComponent rate={record.progressRate} />}</>;
      },
    },
    {
      title: '最近操作时间',
      dataIndex: 'companyName',
      index: 'companyName',
      ellipsis: true,
      width: 100,
      render: (text: string, record: any) => {
        return (
          <>
            {record.lastOperationTime && (
              <span>{moment(record.lastOperationTime).format('YYYY-MM-DD')}</span>
            )}
          </>
        );
      },
    },
  ];
  const contentRef = useRef<HTMLDivElement>(null);
  const contentSize = useSize(contentRef);

  const currentPageSize = useMemo(() => {
    if (!contentSize.height) return 0;
    return Math.floor(contentSize.height / 38) - 2;
  }, [contentSize.height]);

  // 拿到数据，如果不满当前高度，就设置很多空数据进去。让总计到最后
  const handleTheShowData = (data: any[]) => {
    // 需要补充空数据
    if (data && data.length > 0 && data.length < currentPageSize) {
      let handleDataSource = [...data];

      if (handleDataSource.length < currentPageSize) {
        const copyObject = { ...handleDataSource[0] };
        const emptyObject = { empty: true };
        Object.keys(copyObject).forEach((item) => {
          emptyObject[item] = '';
        });
        const emptyObjectArray = new Array(currentPageSize - handleDataSource.length).fill(
          emptyObject,
        );

        handleDataSource = [...data, ...emptyObjectArray];
      }

      const afterHanldeItems = handleDataSource.map((item) => {
        return {
          ...item,
          key: uuid.v1(),
        };
      });
      return afterHanldeItems;
    }
    return dataSource;
  };

  // const sortData= (data: any[]) => {
  //   return data.sort((a, b) =>  false)
  // }

  const finallyShowData = useMemo(() => {
    return {
      data: handleTheShowData(dataSource),
      isOverflow: dataSource && dataSource.length > currentPageSize,
      contentHeight: currentPageSize * 38,
    };
  }, [JSON.stringify(dataSource), currentPageSize]);

  console.log(finallyShowData, '0001');
  return (
    <div className={styles.companyTable} ref={contentRef}>
      <Table
        bordered={true}
        columns={tableColumns}
        pagination={false}
        loading={loading}
        dataSource={finallyShowData.data}
        scroll={finallyShowData.isOverflow ? { y: finallyShowData.contentHeight } : undefined}
        summary={() => {
          if (finallyShowData.data && finallyShowData.data.length > 0) {
            const oneCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel1.todayQty))
              .map((item) => item.statusQtyModel1.todayQty)
              .reduce((sum, item) => sum + item);
            const twoCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel2.todayQty))
              .map((item) => item.statusQtyModel2.todayQty)
              .reduce((sum, item) => sum + item);
            const threeCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel3.todayQty))
              .map((item) => item.statusQtyModel3.todayQty)
              .reduce((sum, item) => sum + item);
            const fourCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel4.todayQty))
              .map((item) => item.statusQtyModel4.todayQty)
              .reduce((sum, item) => sum + item);
            const fiveCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel5.todayQty))
              .map((item) => item.statusQtyModel5.todayQty)
              .reduce((sum, item) => sum + item);
            const sixCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel6.todayQty))
              .map((item) => item.statusQtyModel6.todayQty)
              .reduce((sum, item) => sum + item);
            const sevenCellTotalData = finallyShowData.data
              .filter((item) => isNumber(item.statusQtyModel7.todayQty))
              .map((item) => item.statusQtyModel7.todayQty)
              .reduce((sum, item) => sum + item);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>合计：</Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>{oneCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>{twoCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>{threeCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={4}>{fourCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={5}>{fiveCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={6}>{sixCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={7}>{sevenCellTotalData}</Table.Summary.Cell>
                  <Table.Summary.Cell index={8}>-</Table.Summary.Cell>
                  <Table.Summary.Cell index={9}>-</Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }
          return undefined;
        }}
      />
    </div>
  );
};

export default CompanyTable;
