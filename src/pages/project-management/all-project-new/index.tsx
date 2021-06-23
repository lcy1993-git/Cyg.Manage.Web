import CommonTitle from '@/components/common-title';
import PageCommonWrap from '@/components/page-common-wrap';
import TableSearch from '@/components/table-search';
import React, { useState } from 'react';
import AllStatistics from './components/all-statistics';
import SingleStatistics from './components/single-statistics';
import { Button, Input } from 'antd';
import styles from './index.less';
import EngineerTable from './components/engineer-table';

const { Search } = Input;

const AllProject: React.FC = () => {
  const [keyWord, setKeyWord] = useState<string>('');
  // 从列表返回的数据中获取

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
            <EngineerTable />
          </div>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default AllProject;
