import ScrollListQuee from '@/components/scroll-list-quee'
import type { RefreshDataType } from '@/services/index'
import { useRequest } from 'ahooks'
import moment from 'moment'
import { useState } from 'react'
import ProjectItem from './components/project-Item'
import { useProjectAllAreaStatisticsStore } from '@/pages/project-management/project-all-area-statistics/store'
import { getProjectOperateLogs } from '@/services/project-management/project-statistics-v2'

const ProjectInfoRefreshList = () => {
  const [listData, setListData] = useState<RefreshDataType[]>([])

  const { companyInfo, projectShareCompanyId } = useProjectAllAreaStatisticsStore()
  // const [refreshData, setrefreshData] = useState<RefreshDataType[]>([]);
  // const ref = useRef<HTMLDivElement>(null);
  // const size = useSize(ref);
  // const inViewPort = useInViewport(ref);

  /**
   * count表示是可视条数是多少
   *
   */
  // const visebleCount = Math.floor(size.height ? size.height / 35 : 4);

  // useEffect(() => {
  //   setListData([]);
  //   // setrefreshData([]);
  // }, [currentAreaInfo]);

  const { data, cancel } = useRequest<RefreshDataType[]>(
    () =>
      getProjectOperateLogs({
        projectShareCompanyId: companyInfo.companyId!,
        companyId: projectShareCompanyId,
        limit: 9999,
      }),
    {
      ready: !!projectShareCompanyId,
      pollingInterval: 60000,
      refreshDeps: [],
      onSuccess: () => {
        // 最近的日期是从第一个开始的，所以要把最新放在最下面，使用reverse
        // if (data && refreshData.length === 0) {
        //   // 如果小于可视的条数的话就直接显示并且不滚动
        //   setrefreshData(data);
        //   if (data.length < visebleCount) {
        //     setListData([...data]);
        //   } else {
        //     setListData([...data, ...data]);
        //   }
        // } else if (data && refreshData.length !== 0) {
        //   const diff = _.differenceBy(data, refreshData, (item) => item.date);
        //   if (data.length < visebleCount) {
        //     setListData([...data]);
        //   } else if (diff.length) {
        //     setrefreshData(data);
        //     setListData([...data, ...data]);
        //   }
        // }
        if (data && Array.isArray(data)) {
          if (data.length >= 30) {
            setListData([...data.slice(-30)])
          } else {
            setListData([...data])
          }
        }
      },
      onError: () => {
        cancel()
      },
    }
  )

  // useEffect(() => {
  //   run();
  //   // if (inViewPort) {

  //   // } else {
  //   //   cancel();
  //   // }
  // }, [currentAreaInfo]);
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

  return listData.length > 0 ? (
    <ScrollListQuee data={listData} height={30}>
      {(dataSource: RefreshDataType[]) => {
        return dataSource.map((item: RefreshDataType, idx: number) => (
          <ProjectItem
            name={item.projectName}
            // eslint-disable-next-line react/no-array-index-key
            key={`${item.date}${idx}`}
            id={item.projectId}
            // content={`${item.operator}${item.operationCategory}`}
            operator={item.operator}
            operationCategory={item.operationCategory}
            date={moment(item.date).format('MM-DD HH:mm')}
          />
        ))
      }}
    </ScrollListQuee>
  ) : null
}

export default ProjectInfoRefreshList
