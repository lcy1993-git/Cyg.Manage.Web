import React from 'react';
import ProcessListItem from '../process-list-item';
import ScrollView from 'react-custom-scrollbars';
import styles from './index.less';

const ProjectProcessListComponent: React.FC = () => {
  return (
    <div className={styles.projectProcessListContent}>
      <ScrollView>
        <div style={{ paddingRight: '14px', paddingTop: '20px' }}>
          <ProcessListItem num={1} rate={50} name="长园勘察设计有限公司123213213123123123" />
          <ProcessListItem num={2} rate={50} name="长园勘察设计有限公司1231231231231232" />
          <ProcessListItem num={3} rate={50} name="长园勘察设计有限公司123213123123123123" />
          <ProcessListItem num={4} rate={50} name="长园勘察设计有限公司123123123123123123123" />
          <ProcessListItem num={5} rate={50} name="长园勘察设计有限公司123123123123123123123" />
          <ProcessListItem num={6} rate={50} name="长园勘察设计有限公司123123123123123" />
          <ProcessListItem num={7} rate={50} name="长园勘察设计有限公司123123123" />
          <ProcessListItem num={8} rate={50} name="长园勘察设计有限公司" />
        </div>
      </ScrollView>
    </div>
  );
};

export default ProjectProcessListComponent;
