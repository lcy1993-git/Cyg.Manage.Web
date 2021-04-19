import React, { useState, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';

import { ProjectList } from '@/services/visualization-results/visualization-results';

export interface VisualizationResultsStateType {
  filterCondition?: EngineerProjetListFilterParams; //filter条件
  checkedProjectIdList?: ProjectList[]; //选中的project id数组
  checkedProjectDateList?: string[]; //选中的project 日期数组
  materialModalShow?: boolean;
  projectDetailModalShow?: boolean;
  propertySidePopupShow?: boolean;
}

function useVisualizationState(
  initialState: VisualizationResultsStateType = {
    filterCondition: { kvLevel: -1 },
    propertySidePopupShow: false,
    projectDetailModalShow: false,
    materialModalShow: false,
    checkedProjectIdList: [{id: '1382687501508292609'}]
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

  return { vState, setFilterCondition, togglePropertySidePopup };
}

let store = createContainer(useVisualizationState);
const { Provider, useContainer } = store;

export { useContainer, Provider };
