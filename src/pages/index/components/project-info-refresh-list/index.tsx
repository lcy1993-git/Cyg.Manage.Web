import { List } from 'antd';
import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { useRequest, useInterval, useSize, useInViewport } from 'ahooks';

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
  const [scrollInterval, setScrollInterval] = useState<number>(2000);
  const [isDiff, setDiff] = useState<boolean>(false);
  const [inVisibleQueue, setInVisibleQueue] = useState<RefreshDataType[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const inViewPort = useInViewport(ref);

  /**
   * count表示是可视条数是多少
   *
   */
  const visableCount = Math.floor(size.height ? size.height / 35 : 4);

  const allCount = 30;
  const invisibleCount = allCount - visableCount;
  const params: projectOperationLogParams = {
    limit: allCount,
    areaCode: currentAreaInfo?.areaId,
    areaType: currentAreaInfo?.areaLevel ?? '1',
  };

  useEffect(() => {
    setListData([]);
    setInVisibleQueue([]);
  }, [currentAreaInfo]);

  const { data, run, cancel } = useRequest(() => fetchProjectOperationLog(params), {
    pollingInterval: 3000,
    onSuccess: () => {
      //合并两个数据，重复的会自动合并成一个
      // 最近的日期是从第一个开始的，所以要把最新放在最下面，使用reverse

      // 有数据，并且原本没有数据
      if (data && listData.length === 0) {
        // 可视的队列
        data?.reverse();
        const visible = data.slice(0, visableCount) ?? [];
        // 不可视队列
        const invisible = data?.slice(visableCount) ?? [];
        setListData([...visible]);
        setInVisibleQueue([...invisible]);
        // 有数据原本有数据，做比较加入invivsble队列
      } else if (data && listData.length !== 0) {
        setDiff(true);

        // 先把可视和不可视合并，再和新的数据对比
        const all = _.union(listData, inVisibleQueue);

        // 根据时间来比较是否是同一个操作
        const diff = _.differenceBy(data, all, (v) => v.date);

        // 如果有不同的数据，那么才发生更新
        if (diff.length > 0) {
          // 最新的实在前面，所以diff在前面

          const union = _.union(inVisibleQueue, diff);
          console.log(union);
          //如不没有就是直接替代
          setInVisibleQueue([...union]);
        }
        setDiff(false);
        // 没数据原本也没有数据，显示空
      } else if (!data && listData.length !== 0) {
      } else {
        //没数据，原本有数据，保持原本的循环队列，不做任何操作
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

  const scroll = () => {
    // 如果等于或者超出可是条数，就开始滚动，使用循环队列的方式来实现视觉效果
    // 把第一个元素出队，然后入队，第二个就会变成第一个，第一个变成最后一个造成视觉上上移效果
    if (listData.length >= visableCount && !isDiff) {
      if (inVisibleQueue.length) {
        const shift = listData.shift();
        const invisibleShift = inVisibleQueue.shift();

        // 这里invisible出队就放入visible的队尾，然后visvible出队的加入invisible队尾
        if (invisibleShift) {
          listData.push(invisibleShift);
          shift && inVisibleQueue.push(shift);
        }
        setListData([...listData]);
      } else {
        const shift = listData.shift();
        shift && listData.push(shift);
        setListData([...listData]);
      }
      setListData([...listData]);
    } else {
      const invisibleShift = inVisibleQueue.shift();

      // 这里invisible出队就放入visible的队尾，然后visvible出队的加入invisible队尾
      if (invisibleShift) {
        listData.push(invisibleShift);
      }
      setListData([...listData]);
    }
  };

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
            date={moment(item.date).format('YYYY-MM-DD hh:mm:ss')}
          />
        )}
      />
    </div>
  );
};

export default ProjectInfoRefreshList;
