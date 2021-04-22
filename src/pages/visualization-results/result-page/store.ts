import React, { useState, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';

import { ProjectList } from '@/services/visualization-results/visualization-results';

export interface VisualizationResultsStateType {
  filterCondition: EngineerProjetListFilterParams; //filter条件
  checkedProjectIdList?: ProjectList[]; //选中的project id数组
  checkedProjectDateList?: Set<string>; //选中的project 日期数组
  materialModalShow?: boolean;
  projectDetailModalShow?: boolean;
  propertySidePopupShow?: boolean;
  visibleLeftSidebar: boolean; // 左侧边栏伸缩状态
  sideRightActiveId: string; // 右侧边栏的回调ID
}

function useVisualizationState(
  initialState: VisualizationResultsStateType = {
    filterCondition: { kvLevel: -1 },
    propertySidePopupShow: false,
    projectDetailModalShow: false,
    materialModalShow: false,
    visibleLeftSidebar: true,
    sideRightActiveId: '',
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
  const setSideRightActiveId = (id: string) => {
    setVState({ ...vState, sideRightActiveId: id });
  };

  const setProjectIdList = (checkedProjectIdList: ProjectList[]) => {
    setVState({ ...vState, checkedProjectIdList });
  };

  return {
    vState,
    setFilterCondition,
    togglePropertySidePopup,
    setVisibleLeftSidebar,
    setSideRightActiveId,
    setProjectIdList,
  };
}

let store = createContainer(useVisualizationState);
const { Provider, useContainer } = store;

export { useContainer, Provider };
