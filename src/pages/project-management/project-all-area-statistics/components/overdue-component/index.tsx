import React from 'react';
import styles from './index.less';
import OverdueItem from './overdue-item';
import ScrollView from 'react-custom-scrollbars';
import { useRequest } from 'ahooks';
import { getOverdues } from '@/services/project-management/project-all-area-statistics';
import EmptyTip from '@/components/empty-tip';
import uuid from 'node-uuid';

const OverdueComponent: React.FC = () => {
  const { data = [] } = useRequest(() => getOverdues({ limit: 100 }));
  return (
    <div className={styles.overdueComponent}>
      <ScrollView>
        <div style={{ paddingRight: '20px' }}>
          {data && data.length > 0 ? (
            data.map((item: any) => {
              return <OverdueItem key={uuid.v1()} overdueNumber={item.value}>{item.companyName}</OverdueItem>;
            })
          ) : (
            <EmptyTip description="当前暂无即将逾期或已逾期项目" />
          )}
        </div>
      </ScrollView>
    </div>
  );
};

export default OverdueComponent;
