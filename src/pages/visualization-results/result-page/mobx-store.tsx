import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';
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
  clickDate?: string; //timeline点击的日期
  positionMap: boolean; //地图定位
  observeTrack: boolean; //勘察轨迹
  confessionTrack: boolean; //交底轨迹
  onPositionClickState: boolean; // 当点击地图定位时候
  observeTrackTimeline?: string[];
}

const initState = {
  filterCondition: { kvLevel: -1 },
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
        .filter((v: string) => v !== '')
        .map((v: string) => moment(v).valueOf())
        .sort((a: number, b: number) => a - b)
        .map((v: number) => moment(v).format('YYYY/MM/DD'));
      this.vState.checkedProjectIdList = checkedProjectIdList;
    },
    //设置timeline点击的日期
    setClickDate(clickDate: string) {
      this.vState.clickDate = clickDate;
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
