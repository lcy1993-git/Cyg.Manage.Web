import EmptyTip from '@/components/empty-tip';
import { getCompanyOverdue } from '@/services/project-management/project-statistics-v2';
import { useRequest } from 'ahooks';
import uuid from 'node-uuid';
import React from 'react';
import ScrollView from 'react-custom-scrollbars';
import { useProjectAllAreaStatisticsStore } from '../../store';
import styles from './index.less';
import OverdueItem from './overdue-item';

const OverdueComponent: React.FC = () => {
  const { projectShareCompanyId } = useProjectAllAreaStatisticsStore();
  const { data, loading } = useRequest(
    getCompanyOverdue({ companyId: projectShareCompanyId, limit: 9999 }),
  );

  return (
    <div className={styles.overdueComponent}>
      <ScrollView>
        <div style={{ paddingRight: '20px' }}>
          {data &&
            !loading &&
            data.length > 0 &&
            data.map((item: any) => {
              return (
                <OverdueItem key={uuid.v1()} overdueNumber={item.value}>
                  {item.key}
                </OverdueItem>
              );
            })}
          {(!data || data.length === 0) && !loading && (
            <EmptyTip description="当前暂无即将逾期或已逾期项目" />
          )}
        </div>
      </ScrollView>
    </div>
  );
};

export default OverdueComponent;
