import { getProjectTableList } from '@/services/project-management/all-project';
import { delay } from '@/utils/utils';
import { size } from '@umijs/deps/compiled/lodash';
import { useMount, useRequest } from 'ahooks';
import { Button, Pagination, Spin } from 'antd';
import React, {
  useState,
  useMemo,
  forwardRef,
  memo,
  Ref,
  useImperativeHandle,
  useRef,
  Key,
} from 'react';
import ParentRow from '../virtual-table/ParentRow';
import VirtualTable from '../virtual-table/VirtualTable';
import styles from './index.less';

interface EngineerTableProps {
  // TODO
  searchParams: any;
  // TODO
  columns: any;
  // pagingSlot
  pagingSlot: React.ReactNode;
  // TODO
  parentColumns: any;
}

const ROW_HEIGHT = 40;

const EngineerTable = (props: EngineerTableProps, ref: Ref<any>) => {
  const { columns, parentColumns, pagingSlot } = props;
  const searchParams = {
    category: [],
    stage: [],
    constructType: [],
    nature: [],
    kvLevel: [],
    status: [],
    majorCategory: [],
    pType: [],
    reformAim: [],
    classification: [],
    attribute: [],
    sourceType: [],
    identityType: [],
    areaType: '-1',
    areaId: '',
    dataSourceType: [],
    logicRelation: 2,
    startTime: '',
    endTime: '',
    designUser: '',
    surveyUser: '',
    keyWord: '',
    statisticalCategory: '-1',
  };
  const [pageInfo, setPageInfo] = useState({
    pageSize: 10,
    pageIndex: 1,
  });

  const [tableShowDataSource, setTableShowDataSource] = useState<any[]>([]);

  const { data: tableData, run, loading } = useRequest(getProjectTableList, {
    manual: true,
  });

  const cache = useRef([]);
  const tableRef = useRef<HTMLDivElement>();

  const tableResultData = useMemo(() => {
    if (tableData) {
      const { pagedData, statistics } = tableData;
      const { items, pageIndex: resPageIndex, pageSize: resPageSize, total } = pagedData;

      const afterHandleItems = items.reduce((p: any[], c: any) => {
        // _parent 父级
        // _header 表头
        p.push({ ...c, _parent: true }, { _header: true }, ...c.projects);
        return p;
      }, []);
      if (cache && cache.current) {
        cache.current = afterHandleItems;
      }

      setTableShowDataSource(afterHandleItems);
      return {
        items: afterHandleItems,
        pageIndex: resPageIndex,
        pageSize: resPageSize,
        total,
        dataStartIndex: Math.floor((resPageIndex - 1) * pageInfo.pageSize + 1),
        dataEndIndex: Math.floor((resPageIndex - 1) * pageInfo.pageSize + (items ?? []).length),
        projectLen:
          items
            ?.filter((item: any) => item.projects && item.projects.length > 0)
            .map((item: any) => item.projects)
            .flat().length ?? 0,
      };
    }
    return {
      items: [],
      pageIndex: 1,
      pageSize: 20,
      total: 0,
      dataStartIndex: 0,
      dataEndIndex: 0,
      projectLen: 0,
    };
  }, [JSON.stringify(tableData)]);

  // pageIndex变化
  const currentPageChangeEvent = (page: any, size: any) => {
    // 判断当前page是否改变, 没有改变代表是change页面触发
    if (pageInfo.pageSize === size) {
      setPageInfo({
        pageSize: size,
        pageIndex: page === 0 ? 1 : page,
      });

      run({
        ...searchParams,
        pageIndex: page,
        pageSize: size,
      });

      emptyTableSelect();
    }
  };
  // pageSize变化
  const currentPageSizeChangeEvent = (page: any, size: any) => {
    setPageInfo({
      pageIndex: 1,
      pageSize: size,
    });

    run({
      ...searchParams,
      pageIndex: 1,
      pageSize: size,
    });

    emptyTableSelect();
  };

  const subColumns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      fixed: 'left',
      width: 300,
      render: (value: string) => {
        return (
          <>
            <span>{value}</span>
          </>
        );
      },
    },
    {
      title: '项目分类',
      dataIndex: 'categoryText',
      width: 100,
      fixed: 'left',

      ellipsis: true,
    },
    {
      title: '项目类型',
      dataIndex: 'pTypeText',
      width: 130,
      ellipsis: true,
    },
    {
      title: '电压等级',
      dataIndex: 'kvLevelText',
      width: 80,
      ellipsis: true,
    },
    {
      title: '项目性质',
      dataIndex: ['natureTexts', '0'],
      width: 80,
      ellipsis: true,
    },
    {
      title: '项目起止时间',
      render: (_: any, record: any) => {
        return `${record.startTime} 至 ${record.endTime}`;
      },
      width: 150,
      ellipsis: true,
    },
    {
      title: '专业类别',
      dataIndex: 'majorCategoryText',
      width: 100,
      ellipsis: true,
    },
    {
      title: '建设改造目的',
      dataIndex: 'reformAimText',
      width: 180,
      ellipsis: true,
    },
    {
      title: '所属市公司',
      dataIndex: 'cityCompany',
      width: 100,
      ellipsis: true,
    },
    {
      title: '所属县公司',
      dataIndex: 'countyCompany',
      width: 100,
      ellipsis: true,
    },

    {
      title: '项目身份',
      dataIndex: 'identitys',
      render: (value?: any[]) => {
        if (!Array.isArray(value) || value.length === 0) return null;

        return (
          <>
            {value.map((v) => (
              <span key={v.value}>{v.text}</span>
            ))}
          </>
        );
      },
      width: 150,
    },
    {
      title: '项目状态',
      fixed: 'right',
      dataIndex: ['stateInfo', 'statusText'],
      width: 200,
    },
    {
      title: '操作',
      fixed: 'right',
      render: () => {
        return <Button type="primary">操作</Button>;
      },
      width: 200,
    },
  ];

  useImperativeHandle(ref, () => ({
    // 刷新
    refresh: () => {
      run({
        ...searchParams,
        ...pageInfo,
      });
      emptyTableSelect();
    },
    // 按照目前的参数进行搜索
    search: () => {
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      });
      run({
        ...searchParams,
        ...pageInfo,
        pageIndex: 1,
      });
      emptyTableSelect();
    },
    // 按照传入的参数进行搜索
    searchByParams: (params: object) => {
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      });
      run({
        ...params,
        ...pageInfo,
        pageIndex: 1,
      });
      emptyTableSelect();
    },
    // 延时进行搜索
    delayRefresh: async (ms: number) => {
      await delay(500);
      setPageInfo({
        ...pageInfo,
        pageIndex: 1,
      });
      run({
        ...searchParams,
        ...pageInfo,
        pageIndex: 1,
      });
    },
  }));

  const emptyTableSelect = () => {
    if (tableRef && tableRef.current) {
      // @ts-ignore TODO
      tableRef.current.emptySelectEvent();
    }
  };

  useMount(() => {
    run({
      ...searchParams,
      pageIndex: 1,
      pageSize: 1000,
    });
  });

  return (
    <div className={styles.engineerTable}>
      {loading && (
        <div className={styles.loadingContent}>
          <Spin spinning={loading} tip="数据请求加载中..." />
        </div>
      )}
      <div className={styles.engineerTableContent}>
        <VirtualTable
          style={{ color: '#8C8C8C', borderColor: '#DBDBDB' }}
          className="border"
          data={tableShowDataSource}
          ref={tableRef}
          columns={subColumns as any}
          headerRows={({ _header }) => _header === true}
          customRow={{
            custom: ({ _parent }) => _parent === true,
            row: (props) => (
              <ParentRow
                data={tableShowDataSource}
                cache={cache}
                update={(data) => setTableShowDataSource(data)}
                columns={parentColumns}
                {...props}
              />
            ),
          }}
          rowHeight={ROW_HEIGHT}
          rowSelection={{
            defaultSelectedKeys: [],
            rowKey: ({ id }) => id,
            onChange: (keys) => {
              console.log(keys);
            },
            onSelect: (key: Key, selected: boolean, rowData: Record<string, any>) => {
              console.log(key, selected, rowData);
            },
            onSelectRowsChange: (rows) => {
              console.log(rows);
            },
          }}
        />
      </div>

      <div className={styles.engineerTablePagingContent}>
        <div className={styles.engineerTablePagingLeft}>
          <span>显示第</span>
          <span className={styles.importantTip}>{tableResultData.dataStartIndex}</span>
          <span>到第</span>
          <span className={styles.importantTip}>{tableResultData.dataEndIndex}</span>
          <span>条记录，总共</span>
          <span className={styles.importantTip}>{tableResultData.items.length}</span>
          <span>个工程，</span>
          <span className={styles.importantTip}>{tableResultData.projectLen}</span>个项目
        </div>
        <div className={styles.engineerTablePagingRight}>
          <Pagination
            pageSize={pageInfo.pageSize}
            onChange={currentPageChangeEvent}
            size="small"
            total={tableResultData.total}
            current={pageInfo.pageIndex}
            // hideOnSinglePage={true}
            showSizeChanger
            showQuickJumper
            onShowSizeChange={currentPageSizeChangeEvent}
            style={{ display: 'inline-flex', paddingRight: '25px' }}
          />
        </div>
        {pagingSlot}
      </div>
    </div>
  );
};

export default memo(forwardRef(EngineerTable));
