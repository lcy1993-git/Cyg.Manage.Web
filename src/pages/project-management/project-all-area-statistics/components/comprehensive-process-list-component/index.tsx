import React from 'react';
import ProcessListItem from '../process-list-item';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getComprehensiveProcessList } from '@/services/project-management/project-all-area-statistics';
import uuid from 'node-uuid';
import EmptyTip from '@/components/empty-tip';

const ComprehensiveProcessListComponent: React.FC = () => {
  const { data: comprehensiveData = [] } = useRequest(() => getComprehensiveProcessList());
  const listElement = comprehensiveData?.map((item: any, index: number) => {
    return <ProcessListItem key={uuid.v1()} num={index + 1} rate={item.value} name={item.key} />;
  });
  return (
    <div className={styles.comprehensiveProcessListContent}>
      <ScrollView>
        {comprehensiveData && comprehensiveData.length > 0 && (
          <div style={{ paddingRight: '14px', paddingTop: '20px' }}>{listElement}</div>
        )}
        {
          (!comprehensiveData || (comprehensiveData && comprehensiveData.length === 0)) &&
          <EmptyTip className={'pt20'} />
        }
      </ScrollView>
    </div>
  );
};

export default ComprehensiveProcessListComponent;
