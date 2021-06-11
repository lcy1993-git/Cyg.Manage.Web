import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { useRequest, useSize, useInViewport, useMount } from 'ahooks';

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
  const [refreshData, setrefreshData] = useState<RefreshDataType[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const inViewPort = useInViewport(ref);

  useMount(() => {
    console.log(refreshData);
  });

  /**
   * count表示是可视条数是多少
   *
   */
  const visebleCount = Math.floor(size.height ? size.height / 35 : 4);

  const allCount = 30;

  const params: projectOperationLogParams = {
    limit: allCount,
    areaCode: currentAreaInfo?.areaId,
    areaType: currentAreaInfo?.areaLevel ?? '1',
  };

  useEffect(() => {
    setListData([]);
    setrefreshData([]);
  }, [currentAreaInfo]);

  const { data, run, cancel } = useRequest(() => fetchProjectOperationLog(params), {
    pollingInterval: 3000,
    refreshDeps: [JSON.stringify(currentAreaInfo)],
    onSuccess: () => {
      // 最近的日期是从第一个开始的，所以要把最新放在最下面，使用reverse

      if (data && refreshData.length === 0) {
        //如果小于可视的条数的话就直接显示并且不滚动
        setrefreshData(data);
        if (data.length < visebleCount) {
          setListData([...data]);
        } else {
          setListData([...data, ...data]);
        }
      } else if (data && refreshData.length !== 0) {
        const diff = _.differenceBy(data, refreshData, (item) => item.date);
        if (data.length < visebleCount) {
          setListData([...data]);
        } else if (diff.length) {
          setrefreshData(data);
          setListData([...data, ...data]);
        }
      } else {
      }
    },
    onError: () => {
      cancel();
    },
  });

  useEffect(() => {
    if (inViewPort) {
      run();
    } else {
      cancel();
    }
  }, [inViewPort]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const realLength = listData.length / 2;
      if (realLength < visebleCount) {
        scrollRef.current.style.animation = 'none';
      } else {
        scrollRef.current.style.animation = `mymove ${1.2 * realLength}s infinite linear`;
      }
    }
  }, [JSON.stringify(listData)]);

  return (
    <div className={styles.refreshBarn} ref={ref}>
      <div ref={scrollRef} className={styles.list}>
        {listData.map((item: RefreshDataType, idx: number) => (
          <ProjectItem
            name={item.projectName}
            key={`${item.date}${idx}`}
            id={item.projectId}
            content={item.content}
            date={moment(item.date).format('YYYY-MM-DD HH:mm:ss')}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectInfoRefreshList;
