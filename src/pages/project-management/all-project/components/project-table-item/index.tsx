import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { useBoolean } from 'ahooks';
import moment from 'moment';
import React from 'react';
import styles from './index.less';

import uuid from 'node-uuid';
import { Checkbox } from 'antd';

interface ProjectTableItemProps {
  // TODO 完善信息
  projectInfo: any;
  columns: any[];
}

const ProjectTableItem: React.FC<ProjectTableItemProps> = (props) => {
  const [isFold, { toggle: foldEvent }] = useBoolean(false);
  const { projectInfo = {}, columns = [] } = props;

  const theadElement = columns.map((item) => {
    return <th key={uuid.v1()}>{item.title}</th>;
  });

  const tbodyElement = (projectInfo.projects ?? []).map((item: any) => {
    return (
      <tr key={uuid.v1()}>
        <td>
          <Checkbox value={item.id} />
        </td>
        {columns.map((ite) => {
          return <th key={uuid.v1()}>{ite.render ? ite.render() : item[ite.dataIndex]}</th>;
        })}
      </tr>
    );
  });

  return (
    <div className={styles.projectTableItem}>
      <div className={styles.ProjectTitle}>
        <div className={styles.foldButton}>
          <span onClick={() => foldEvent()}>
            {isFold ? <CaretUpOutlined /> : <CaretDownOutlined />}
          </span>
        </div>
        <div className={styles.projectName}>{projectInfo.name}</div>
        <div className={styles.projectTime}>
          <span>工程日期:</span>
          <span>
            {projectInfo.startTime ? moment(projectInfo.startTime).format('YYYY/MM/DD') : ''}
          </span>
          <span>
            -{projectInfo.startTime ? moment(projectInfo.endTime).format('YYYY/MM/DD') : ''}
          </span>
        </div>
        <div className={styles.createTime}>
          <span>编制日期:</span>
          <span>
            {projectInfo.compileTime ? moment(projectInfo.compileTime).format('YYYY/MM/DD') : ''}
          </span>
        </div>
      </div>
      <div className={styles.engineerTable}>
        <table>
          <thead>
            <tr>
              <th></th>
              {theadElement}
            </tr>
          </thead>
          <tbody>{tbodyElement}</tbody>
        </table>
      </div>
      <div className={styles.noEngineerData}></div>
    </div>
  );
};

export default ProjectTableItem;
