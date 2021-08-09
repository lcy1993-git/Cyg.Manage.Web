import EmptyTip from '@/components/empty-tip';
import { getProjectProcessList } from '@/services/project-management/project-all-area-statistics';
import { useRequest } from 'ahooks';
import uuid from 'node-uuid';
import React from 'react';
import ScrollView from 'react-custom-scrollbars';
import ProcessListItem from '../process-list-item';
import styles from './index.less';

const ProjectProcessListComponent: React.FC = () => {
  const { data: projectData = [], loading } = useRequest(() => getProjectProcessList());

  const listElement = projectData?.map((item: any, index: number) => {
    return <ProcessListItem key={uuid.v1()} num={index + 1} rate={item.value} name={item.key} />;
  });
  return (
    <div className={styles.projectProcessListContent}>
      <ScrollView>
        {projectData && projectData.length > 0 && !loading && (
          <div style={{ paddingRight: '14px', paddingTop: '20px' }}>{listElement}</div>
        )}
        {(!projectData || (projectData && projectData.length === 0)) && !loading && (
          <EmptyTip className={'pt20'} />
        )}
      </ScrollView>
    </div>
  );
};

export default ProjectProcessListComponent;
