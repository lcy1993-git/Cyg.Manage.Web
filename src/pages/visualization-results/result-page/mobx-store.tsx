import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-tree';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { makeAutoObservable } from 'mobx';
import moment from 'moment';
import { createContext, useContext } from 'react';
export interface VisualizationResultsStateType {
  filterCondition: EngineerProjetListFilterParams; //filter条件
  checkedProjectIdList: ProjectList[]; //选中的project id数组
  checkedProjectDateList?: string[]; //选中的project 日期数组
  materialModalShow?: boolean;
  projectDetailModalShow?: boolean;
  propertySidePopupShow?: boolean;
  visibleLeftSidebar: boolean; // 左侧边栏伸缩状态
  sideRightActiveId: string; // 右侧边栏的回调ID
  normalClickDate?: string; //普通timeline的点击日期
  observeClickDate?: string; // 勘察轨迹timeline点击的日期
  positionMap: boolean; //地图定位
  observeTrack: boolean; //勘察轨迹
  confessionTrack: boolean; //交底轨迹
  onPositionClickState: boolean; // 当点击地图定位时候
  observeTrackTimeline?: string[]; //勘察轨迹tiemline
}

const initState = {
  filterCondition: {},
  propertySidePopupShow: false,
  projectDetailModalShow: false,
  materialModalShow: false,
  visibleLeftSidebar: true,
  sideRightActiveId: '',
  positionMap: false,
  observeTrack: false,
  confessionTrack: false,
  onPositionClickState: false,
  checkedProjectIdList: [],
};

function Store(vState: VisualizationResultsStateType) {
  return makeAutoObservable({
    vState,
    setFilterCondition(filterCondition: EngineerProjetListFilterParams) {
      this.vState.filterCondition = filterCondition;
    },
    togglePropertySidePopup() {
      this.vState.propertySidePopupShow = !this.vState.propertySidePopupShow;
    },
    setVisibleLeftSidebar() {
      this.vState.visibleLeftSidebar = !this.vState.visibleLeftSidebar;
    },
    setOnPositionClickState() {
      this.vState.onPositionClickState = this.vState.onPositionClickState;
    },
    setProjectIdList(checkedProjectIdList: ProjectList[]) {
      this.vState.checkedProjectDateList = [
        ...new Set(checkedProjectIdList?.map((v: ProjectList) => v.time)),
      ]
        .filter((v) => v !== '')
        .map((v) => moment(v).valueOf())
        .sort((a, b) => a - b)
        .map((v) => moment(v).format('YYYY/MM/DD'));
      this.vState.checkedProjectIdList = checkedProjectIdList;
    },
    //设置timeline点击的日期
    setClickDate(clickDate: string, type: string) {
      switch (type) {
        case 'normal':
          this.vState.normalClickDate = clickDate;
          break;
        case 'observe':
          this.vState.observeClickDate = clickDate;
          break;
        default:
          break;
      }
    },

    togglePositionMap() {
      this.vState.positionMap = !this.vState.positionMap;
    },

    toggleObserveTrack(flag?: boolean) {
      if (flag === undefined) {
        this.vState.observeTrack = !this.vState.observeTrack;
      } else {
        this.vState.observeTrack = flag;
      }
    },
    toggleConfessionTrack(flag?: boolean) {
      if (flag === undefined) {
        this.vState.confessionTrack = !this.vState.confessionTrack;
      } else {
        this.vState.confessionTrack = flag;
      }
    },
    setObeserveTrackTimeline(observeTrackTimeline: string[]) {
      this.vState.observeTrackTimeline = observeTrackTimeline;
    },
  });
}

const store = Store(initState);
const StateContext = createContext(store);
function useContainer() {
  return useContext(StateContext);
}
const Provider: React.FC = ({ children }) => {
  return <StateContext.Provider value={store}>{children}</StateContext.Provider>;
};

export { useContainer, Provider };
