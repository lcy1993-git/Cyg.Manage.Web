import React from 'react';
import ProcessListItem from '../process-list-item';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';
import { useRequest } from 'ahooks';
import { getProjectProcessList } from '@/services/project-management/project-all-area-statistics';
import uuid from 'node-uuid';
import EmptyTip from '@/components/empty-tip';

const ProjectProcessListComponent: React.FC = () => {
  const { data: projectData = [] } = useRequest(() => getProjectProcessList());

  const listElement = projectData?.map((item: any, index: number) => {
    return <ProcessListItem key={uuid.v1()} num={index + 1} rate={item.value} name={item.key} />;
  });
  return (
    <div className={styles.projectProcessListContent}>
      <ScrollView>
        {projectData && projectData.length > 0 && (
          <div style={{ paddingRight: '14px', paddingTop: '20px' }}>{listElement}</div>
        )}
        {(!projectData || (projectData && projectData.length === 0)) && (
          <EmptyTip className={'pt20'} />
        )}
      </ScrollView>
    </div>
  );
};

export default ProjectProcessListComponent;
