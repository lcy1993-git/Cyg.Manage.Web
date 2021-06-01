import { List } from 'antd';
import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { useRequest, useInterval, useSize } from 'ahooks';
import { request } from 'umi';
import ProjectItem from './components/project-Item';
import {
  AreaInfo,
  fetchProjectOperationLog,
  projectOperationLogParams,
  RefreshDataType,
} from '@/services/index';
import moment from 'moment';
export interface ProjectInfoRefreshListProps {
  currentAreaInfo: AreaInfo;
}

const map = new Map<number, string>([
  [0, '删除'],
  [1, '创建'],
  [2, '安排'],
]);

const ProjectInfoRefreshList: FC<ProjectInfoRefreshListProps> = ({ currentAreaInfo }) => {
  const [listData, setListData] = useState<RefreshDataType[]>([]);
  const [scrollInterval, setScrollInterval] = useState<number>(5000);
  // const [fetchInterval, setFetchInterval] = useState<number>(10000);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const count =1;
  // Math.floor(size.height ? size.height / 35 : 10);
  const params: projectOperationLogParams = {
    limit: count,
    areaCode: currentAreaInfo?.areaId,
    areaType: currentAreaInfo?.areaLevel ?? '1',
  };

  useEffect(() => {
    setListData([]);
  }, [currentAreaInfo]);

  /**
   * count表示是可视条数是多少
   *
   */

  const { data, error, loading, run } = useRequest(() => fetchProjectOperationLog(params), {
    // manual: true,
    pollingInterval: 5000,
    onSuccess: () => {
      const newListData = _.unionBy(listData, data, (v: RefreshDataType) => v.content);
      setListData(newListData);
    },
  });

  const scroll = () => {
    if (listData.length >= count) {
      const shift = listData.shift();
      shift ? setListData([...listData, shift]) : null;
    }
  };
  // useInterval(run, fetchInterval);
  //  useTimeout(() => {
  //   setState(state + 1);
  // }, 3000);
  useInterval(scroll, scrollInterval);

  return (
    <div className={styles.refreshBarn} ref={ref}>
      <List
        dataSource={listData}
        renderItem={(item: RefreshDataType) => (
          <ProjectItem
            name={item.projectName}
            id={item.projectId}
            content={item.content}
            date={moment(item.date).format('YYYY-MM-DD')}
          />
        )}
      />
    </div>
  );
};

export default ProjectInfoRefreshList;
