import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-tree'
import { ProjectList } from '@/services/visualization-results/visualization-results'
import { makeAutoObservable } from 'mobx'
import moment from 'moment'
import { createContext, useContext } from 'react'

interface RangeDate {
  startDate: undefined | string
  endDate: undefined | string
}

export interface VisualizationResultsStateType {
  filterCondition: EngineerProjetListFilterParams //filter条件
  checkedProjectIdList: ProjectList[] //选中的project id数组
  checkedProjectDateList?: string[] //选中的project 日期数组
  materialModalShow?: boolean
  projectDetailModalShow?: boolean
  propertySidePopupShow?: boolean
  visibleLeftSidebar: boolean // 左侧边栏伸缩状态
  sideRightActiveId: string // 右侧边栏的回调ID
  normalClickDate?: string //普通timeline的点击日期
  observeClickDate?: string // 勘察轨迹timeline点击的日期
  positionMap: boolean //地图定位
  observeTrack: boolean //勘察轨迹
  mediaSign: boolean //多媒体标记
  confessionTrack: boolean //交底轨迹
  onPositionClickState: boolean // 当点击地图定位时候
  observeTrackTimeline?: string[] //勘察轨迹tiemline
  isFilter?: boolean //为了判断是不是通过filter来是刷新tree
  // startDate: string | undefined, // 开始日期
  // endDate: string | undefined, // 终止日期
  rangeDate: RangeDate
  mediaListVisibel: boolean // 查看多媒体文件
  mediaListData: any[] // 多媒体数据
  map: any
}

const initState = {
  filterCondition: { haveAnnotate: 0 },
  propertySidePopupShow: false,
  projectDetailModalShow: false,
  materialModalShow: false,
  visibleLeftSidebar: true,
  sideRightActiveId: '',
  positionMap: false,
  observeTrack: false,
  mediaSign: false,
  confessionTrack: false,
  onPositionClickState: false,
  checkedProjectIdList: [],
  isFilter: false,
  rangeDate: {
    startDate: undefined,
    endDate: undefined,
  },
  mediaListVisibel: false,
  mediaListData: [],
  map: null,
}

function Store(vState: VisualizationResultsStateType) {
  return makeAutoObservable({
    vState,
    setFilterCondition(filterCondition: EngineerProjetListFilterParams) {
      this.vState.filterCondition = filterCondition
      this.setIsFilter(true)
    },
    togglePropertySidePopup() {
      this.vState.propertySidePopupShow = !this.vState.propertySidePopupShow
    },
    setVisibleLeftSidebar() {
      this.vState.visibleLeftSidebar = !this.vState.visibleLeftSidebar
    },
    setOnPositionClickState() {
      this.vState.onPositionClickState = this.vState.onPositionClickState
    },
    setMediaListVisibel(flag: boolean) {
      this.vState.mediaListVisibel = flag
    },
    setMediaListData(data: any[]) {
      this.vState.mediaListData = data
    },
    setProjectIdList(checkedProjectIdList: ProjectList[]) {
      this.vState.checkedProjectDateList = [
        ...new Set(checkedProjectIdList?.map((v: ProjectList) => v.time)),
      ]
        .filter((v) => v !== '')
        .map((v) => moment(v).valueOf())
        .sort((a, b) => a - b)
        .map((v) => moment(v).format('YYYY/MM/DD'))
      this.vState.checkedProjectIdList = checkedProjectIdList
    },
    //设置timeline点击的日期
    setClickDate(clickDate: string, type: string) {
      this.vState.normalClickDate = clickDate
    },
    // 设置开始日期
    // setStartDate(time: string | undefined) {
    //   this.vState.startDate = time;
    // },
    // 设置结束日期
    // setEndDate(time: string | undefined) {
    //   this.vState.endDate = time;
    // },
    setIsFilter(isFilter: boolean) {
      this.vState.isFilter = isFilter
    },

    togglePositionMap() {
      this.vState.positionMap = !this.vState.positionMap
    },

    toggleObserveTrack(flag: boolean) {
      this.vState.observeTrack = flag
    },
    toggleMediaSign(flag: boolean) {
      this.vState.mediaSign = flag
    },
    // 设置日期范围
    setDateRange(d: RangeDate) {
      this.vState.rangeDate = d
    },
    clear() {
      this.vState = initState
    },
    setMapRef(mapRef: any) {
      this.vState.map = mapRef
    },
  })
}

const store = Store(initState)
const StateContext = createContext(store)
function useContainer() {
  return useContext(StateContext)
}
const Provider: React.FC = ({ children }) => {
  return <StateContext.Provider value={store}>{children}</StateContext.Provider>
}

export { useContainer, Provider }
