import React, { FC, useState } from 'react'
import { useRequest } from 'ahooks'
import ScrollListQuee from '@/components/scroll-list-quee'
import ProjectItem from './components/project-Item'
import {
  AreaInfo,
  fetchProjectOperationLog,
  projectOperationLogParams,
  RefreshDataType,
} from '@/services/index'
import moment from 'moment'
export interface ProjectInfoRefreshListProps {
  currentAreaInfo?: AreaInfo
}

const ddd = []
for (let i = 0; i < 30; i++) {
  ddd.push(i)
}

const ProjectInfoRefreshList: FC<ProjectInfoRefreshListProps> = ({ currentAreaInfo }) => {
  const [listData, setListData] = useState<RefreshDataType[]>([])
  // const [refreshData, setrefreshData] = useState<RefreshDataType[]>([]);

  /**
   * count表示是可视条数是多少
   *
   */

  const allCount = 30

  const params: projectOperationLogParams = {
    limit: allCount,
    areaCode: currentAreaInfo?.areaId,
    areaType: currentAreaInfo?.areaLevel ?? '1',
  }

  // useEffect(() => {
  //   setListData([]);
  //   setrefreshData([]);
  // }, [currentAreaInfo]);

  const { data, cancel } = useRequest(() => fetchProjectOperationLog(params), {
    pollingInterval: 3000,
    refreshDeps: [JSON.stringify(currentAreaInfo)],
    onSuccess: () => {
      // 最近的日期是从第一个开始的，所以要把最新放在最下面，使用reverse
      setListData(data)
    },
    onError: () => {
      cancel()
    },
  })

  // useMount(() => {
  //   run();
  // })

  // useEffect(() => {
  //   if (inViewPort) {
  //     run();
  //   } else {
  //     cancel();
  //   }
  // }, [inViewPort]);
  // const scrollRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (scrollRef.current) {
  //     const realLength = listData.length / 2;
  //     if (realLength < visebleCount) {
  //       scrollRef.current.style.animation = 'none';
  //     } else {
  //       scrollRef.current.style.animation = `mymove ${1.2 * realLength}s infinite linear`;
  //     }
  //   }
  // }, [JSON.stringify(listData)]);

  return (
    <ScrollListQuee height={40} data={listData ?? []}>
      {(data1) => {
        return data1.map((item, idx) => {
          return (
            <ProjectItem
              name={item.projectName}
              key={`${item.date}${idx}`}
              id={item.projectId}
              //content={`${item.operator}${item.operationCategory}`}
              operator={item.operator}
              operationCategory={item.operationCategory}
              date={moment(item.date).format('MM-DD HH:mm')}
            />
          )
        })
      }}
    </ScrollListQuee>
  )
}

export default ProjectInfoRefreshList
