import EmptyTip from '@/components/empty-tip';
import { getProjectOverdue } from '@/services/project-management/project-statistics-v2';
import { useRequest } from 'ahooks';
// import uuid from 'node-uuid';
import React from 'react';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';
import OverdueProjectItem from './overdue-project-item';
import { useProjectAllAreaStatisticsStore } from '@/pages/project-management/project-all-area-statistics/store';

const OverdueProjectComponent: React.FC = () => {
  const { companyInfo, projectShareCompanyId } = useProjectAllAreaStatisticsStore();

  const { data, loading } = useRequest(
    () =>
      getProjectOverdue({
        projectShareCompanyId: companyInfo.companyId!,
        companyId: projectShareCompanyId,
        limit: 9999,
      }),
    {
      ready: !!companyInfo.companyId,
      refreshDeps: [projectShareCompanyId, companyInfo],
    },
  );

  return (
    <div className={styles.overdueComponent}>
      <ScrollView>
        <div style={{ paddingRight: '20px' }}>
          {data &&
            data.length > 0 &&
            !loading &&
            data.map((item: any) => {
              return (
                <OverdueProjectItem
                  key={item.id}
                  status={item.statusText}
                  name={item.projectName}
                />
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

export default OverdueProjectComponent;
