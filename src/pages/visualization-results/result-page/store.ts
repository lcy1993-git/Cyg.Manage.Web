import React, { useState, useReducer } from 'react';
import { createContainer } from 'unstated-next';
import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';

interface ProjectList {
  id: string;
  time: string;   // '2021-04-19'
  status?: string
}

export interface VisualizationResultsStateType {
  filterCondition?: EngineerProjetListFilterParams; //filter条件
  checkedProjectIdList?: ProjectList[]; //选中的project id数组
  checkedProjectDateList?: string[]; //选中的project 日期数组
  materialModalShow?: boolean;
  projectDetailModalShow?: boolean;
  propertySidePopupShow?: boolean;
  isSatelliteMap?: boolean;  // 是否为卫星图层 false为街道图层
  currentPosition?: [number, number]; // 当前经度纬度
  scaleSize: number;  // 比例尺寸
}

function useVisualizationState(
  initialState: VisualizationResultsStateType = {
    filterCondition: { kvLevel: -1 },
    propertySidePopupShow: false,
    projectDetailModalShow: false,
    materialModalShow: false,
    isSatelliteMap: true,
    currentPosition: [0, 0],
    scaleSize: 0
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

  // // 卫星图截到图切换
  // const setIsSatelliteMap = (isSatelliteMap: boolean) =>{
  //   setVState({...vState, isSatelliteMap})
  // }

  // // 改变比例尺寸
  // const setScaleSize = (scaleSize: number) =>{
  //   setVState({...vState, scaleSize})
  // }

  // // 改变当前定位
  // const setCurrentPosition = (currentPosition: [number, number]) => {
  //   setVState({...vState, currentPosition})
  // }

  // return { vState, setFilterCondition, togglePropertySidePopup, setIsSatelliteMap, setScaleSize, setCurrentPosition };
  return { vState, setFilterCondition, togglePropertySidePopup };
}

let store = createContainer(useVisualizationState);
const { Provider, useContainer } = store;


export { useContainer, Provider };
