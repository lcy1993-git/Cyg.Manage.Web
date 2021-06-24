import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import React, { useState } from 'react';
import AllStatistics from './components/all-statistics';
import SingleStatistics from './components/single-statistics';
import { Button, Input } from 'antd';
import styles from './index.less';
import EngineerTable from './components/engineer-table';
import { useRef } from 'react';
import { useLayoutStore } from '@/layouts/context';
import { useEffect } from 'react';

const { Search } = Input;

const AllProject: React.FC = () => {
  const [keyWord, setKeyWord] = useState<string>('');
  // 从列表返回的数据中获取
  const [searchParams, setSearchParams] = useState({
    category: [],
    pCategory: [],
    stage: [],
    constructType: [],
    nature: [],
    kvLevel: [],
    status: [],
    statisticalCategory: "-1",
    sourceType: [],
    identityType: [],
    logicRelation: 2,
    designUser: '',
    surveyUser: '',
    areaType: '-1',
    areaId: '',
  });

  const {
    setAllProjectSearchProjectId,
    setAllProjectSearchPerson,
    allProjectSearchPerson,
    allProjectSearchProjectName,
  } = useLayoutStore();

  const tableRef = useRef<HTMLDivElement>(null);

  // TODO 搜索、以及弹窗部分都还没做
  const [statisticsData, setStatisticsData] = useState({
    total: 0,
    awaitProcess: 0,
    inProgress: 0,
    delegation: 0,
    beShared: 0,
  });

  const publicSearch = () => {};

  const handleStatisticsData = (statisticsDataItem?: number) => {
    if (statisticsDataItem) {
      if (statisticsDataItem < 10) {
        return `0${statisticsDataItem}`;
      }
      return statisticsDataItem;
    }
    return '0';
  };

  const statisticsClickEvent = (statisticsType: string) => {};

  const searchByParams = (params: any) => {
    if (tableRef && tableRef.current) {
      //@ts-ignore
      tableRef.current.searchByParams(params);
    }
  };

  useEffect(() => {
    if (allProjectSearchProjectName) {
      searchByParams({
        keyWord,
        ...searchParams
      });
    }
    if (allProjectSearchPerson) {
      searchByParams({
        keyWord,
        ...searchParams
      });
    }
    if(!allProjectSearchPerson && !allProjectSearchPerson) {
      searchByParams({
        keyWord,
        ...searchParams
      });
    }
  }, [allProjectSearchPerson, allProjectSearchProjectName]);

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.allProjectPage}>
        <div className={styles.allProjectStatistics}>
          <div className="flex1">
            <div onClick={() => statisticsClickEvent('-1')}>
              <AllStatistics>{handleStatisticsData(statisticsData?.total)}</AllStatistics>
            </div>
          </div>
          <div className={styles.projectManagementStatisticItem}>
            <div onClick={() => statisticsClickEvent('1')}>
              <SingleStatistics label="待处理" icon="awaitProcess">
                {handleStatisticsData(statisticsData?.awaitProcess)}
              </SingleStatistics>
            </div>
          </div>
          <div className={styles.projectManagementStatisticItem}>
            <div onClick={() => statisticsClickEvent('2')}>
              <SingleStatistics label="进行中" icon="inProgress">
                {handleStatisticsData(statisticsData?.inProgress)}
              </SingleStatistics>
            </div>
          </div>
          <div className={styles.projectManagementStatisticItem}>
            <div onClick={() => statisticsClickEvent('3')}>
              <SingleStatistics label="委托" icon="delegation">
                {handleStatisticsData(statisticsData?.delegation)}
              </SingleStatistics>
            </div>
          </div>
          <div className={styles.projectManagementStatisticItem}>
            <div onClick={() => statisticsClickEvent('4')}>
              <SingleStatistics label="被共享" icon="beShared">
                {handleStatisticsData(statisticsData?.beShared)}
              </SingleStatistics>
            </div>
          </div>
        </div>
        <div className={styles.allProjectTableContent}>
          <CommonTitle>全部项目</CommonTitle>
          <div className={styles.allProjectSearch}>
            <div className={styles.allProjectSearchContent}>
              <TableSearch className="mr22" label="项目名称" width="300px">
                <Search
                  placeholder="请输入项目名称"
                  enterButton
                  value={keyWord}
                  onChange={(e) => setKeyWord(e.target.value)}
                  onSearch={() => publicSearch()}
                />
              </TableSearch>
              <Button>筛选</Button>
            </div>
            <div className={styles.allProjectFunctionButtonContent}>{/* TODO 按钮区域 */}</div>
          </div>
          <div className={styles.engineerTableContent}>
            <EngineerTable ref={tableRef} extractParams={{keyWord, ...searchParams}} />
          </div>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default AllProject;
