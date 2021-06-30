import React, { FC, useEffect, useRef, useState } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { useRequest, useSize, useInViewport } from 'ahooks';

import ProjectItem from './components/project-Item';
import {
  AreaInfo,
  projectOperationLogParams,
  RefreshDataType,
} from '@/services/index';
import moment from 'moment';
import EmptyTip from '@/components/empty-tip';
import { fetchProjectOperationLog } from '@/services/project-management/project-all-area-statistics';
export interface ProjectInfoRefreshListProps {
  currentAreaInfo?: AreaInfo;
}

const ProjectInfoRefreshList: FC<ProjectInfoRefreshListProps> = ({ currentAreaInfo }) => {
  const [listData, setListData] = useState<RefreshDataType[]>([]);
  const [refreshData, setrefreshData] = useState<RefreshDataType[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const inViewPort = useInViewport(ref);

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
        // 如果小于可视的条数的话就直接显示并且不滚动
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
      {listData.length > 0 && (
        <div ref={scrollRef} className={styles.list}>
          {listData.map((item: RefreshDataType, idx: number) => (
            <ProjectItem
              name={item.projectName}
              key={`${item.date}${idx}`}
              id={item.projectId}
              //content={`${item.operator}${item.operationCategory}`}
              operator={item.operator}
              operationCategory={item.operationCategory}
              date={moment(item.date).format('MM-DD HH:mm')}
            />
          ))}
        </div>
      )}

      {listData.length === 0 && <EmptyTip />}
    </div>
  );
};

export default ProjectInfoRefreshList;
