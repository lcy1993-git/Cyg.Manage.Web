import { List } from 'antd';
import React, { FC, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { useRequest, useInterval } from 'ahooks';
import { request } from 'umi';
import ProjectItem from './components/project-Item';

export interface ProjectInfoRefreshListProps {
  height: number;
}
export interface RefreshDataType {
  status: number;
  project: { name: string; id: string };
  operator: string;
}

const map = new Map<number, string>([
  [0, '删除'],
  [1, '创建'],
  [2, '安排'],
]);

const ProjectInfoRefreshList: FC<ProjectInfoRefreshListProps> = ({ height }) => {
  const [listData, setListData] = useState<RefreshDataType[]>([]);
  const [scrollInterval, setScrollInterval] = useState<number>(5000);
  const [fetchInterval, setFetchInterval] = useState<number>(3000);
  const { data, error, loading, run } = useRequest(() => request('/api/refreshData'), {
    // manual: true,
    onSuccess: () => {
      const newListData = _.unionBy(listData, data, (v: RefreshDataType) => v.project.name);
      setListData(newListData);
    },
  });

  const scroll = () => {
    if (listData.length >= 10) {
      const shift = listData.shift();
      shift ? setListData([...listData, shift]) : null;
    }
  };
  useInterval(run, fetchInterval);
  useInterval(scroll, scrollInterval);

  return (
    <div className={styles.refreshBarn} style={{ height }}>
      <List
        dataSource={listData}
        renderItem={(item: RefreshDataType) => (
          <ProjectItem
            name={item.project.name}
            id={item.project.id}
            operator={item.operator}
            operation={map.get(item.status) ?? ''}
          />
        )}
      />
    </div>
  );
};

export default ProjectInfoRefreshListProps;
