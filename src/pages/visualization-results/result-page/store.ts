import React, { useState, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';

import { ProjectList } from '@/services/visualization-results/visualization-results';
import moment from 'moment';

export interface VisualizationResultsStateType {
  filterCondition: EngineerProjetListFilterParams; //filter条件
  checkedProjectIdList?: ProjectList[]; //选中的project id数组
  checkedProjectDateList?: string[]; //选中的project 日期数组
  materialModalShow?: boolean;
  projectDetailModalShow?: boolean;
  propertySidePopupShow?: boolean;
  visibleLeftSidebar: boolean; // 左侧边栏伸缩状态
  sideRightActiveId: string; // 右侧边栏的回调ID
  clickDate?: string; //timeline点击的日期
  positionMap: boolean; //地图定位
  observeTrack: boolean; //勘察轨迹
  ConfessionTrack: boolean; //交底轨迹
  onPositionClickState: boolean; // 当点击地图定位时候
}

function useVisualizationState(
  initialState: VisualizationResultsStateType = {
    filterCondition: { kvLevel: -1 },
    propertySidePopupShow: false,
    projectDetailModalShow: false,
    materialModalShow: false,
    visibleLeftSidebar: true,
    sideRightActiveId: '',
    positionMap: false,
    observeTrack: false,
    ConfessionTrack: false,
    onPositionClickState: false
  },
) {
  let [vState, setVState] = useState(initialState);

  //设置筛选条件
  const setFilterCondition = (filterCondition: EngineerProjetListFilterParams) => {
    setVState({ ...vState, filterCondition });
  };
  //属性侧边弹窗触发
  const togglePropertySidePopup = () => {
    setVState({ ...vState, propertySidePopupShow: !vState.propertySidePopupShow });
  };

  // 左侧菜单栏伸缩事件
  const setVisibleLeftSidebar = () => {
    setVState({ ...vState, visibleLeftSidebar: !vState.visibleLeftSidebar });
  };

  // 设置右侧边栏ID
  const setOnPositionClickState = (id: string) => {
    setVState({ ...vState, onPositionClickState: !vState.onPositionClickState });
  };

  const setProjectIdList = (checkedProjectIdList: ProjectList[]) => {
    const checkedProjectDateList = [
      ...new Set(checkedProjectIdList?.map((v: ProjectList) => v.time)),
    ]
      .filter((v: string) => v !== '')
      .map((v: string) => moment(v).valueOf())
      .sort((a: number, b: number) => a - b)
      .map((v: number, idx: number) => {
        return moment(v).format('YYYY/MM/DD');
      });
    setVState({ ...vState, checkedProjectIdList, checkedProjectDateList });
  };

  //设置timeline点击的日期
  const setClickDate = (clickDate: string) => {
    console.log(clickDate);

    setVState({ ...vState, clickDate });
  };

  const togglePositionMap = () => {
    setVState({ ...vState, positionMap: !vState.positionMap });
  };

  const toggleObserveTrack = () => {
    setVState({ ...vState, observeTrack: !vState.observeTrack });
  };
  const toggleConfessionTrack = () => {
    setVState({ ...vState, ConfessionTrack: !vState.ConfessionTrack });
  };
  return {
    vState,
    setFilterCondition,
    togglePropertySidePopup,
    setVisibleLeftSidebar,
    setOnPositionClickState,
    setProjectIdList,
    setClickDate,
    togglePositionMap,
    toggleObserveTrack,
    toggleConfessionTrack,
  };
}

let store = createContainer(useVisualizationState);
const { Provider, useContainer } = store;

export { useContainer, Provider };
