import React, { useState } from 'react';
import { useRequest } from 'ahooks';
import { getMapList } from '@/services/visualization-results/visualization-results';

import { initLayers, initOtherLayers, initView, initOtherLayersState } from '../../utils';
import ViewCtrol from '../view-ctrol';
import BaseMap from '../base-map';
import styles from './index.less';
import Layer from 'ol/layer/Layer';
import LayerGroup from 'ol/layer/Group';

const MapContainerBox = (props: any) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData));
  const [otherLayers, setOtherLayers] = useState<LayerGroup[]>(initOtherLayers());

  const [layersState, setLayersState] = useState(0);
  const [otherlayersState, setOtherLayerState]  = useState(initOtherLayersState);

  // 视图
  const [view, setView] = useState(initView);

  const onTest = function () {
    console.log(layers)
  }

  return (
    <div className={styles.mapContainerBox}>
            <button onClick={onTest}>
        图层测试DEMO
      </button>
      <ViewCtrol

        {...props}
      />
      <BaseMap
        layers={layers ?? []}
        otherLayers={otherLayers}
        controls={[]}
        view={view}
      />
    </div>
  )
}

const UrlMapContainerBox = (props: any) => {
  const {data: mapData} = useRequest(() => getMapList({"sourceType": 0,"layerType": 0,"enableStatus": 1,"availableStatus": 0}));
  return (
    <>
      {mapData && mapData.code=== 200 && <MapContainerBox mapData={mapData} {...props}></MapContainerBox>}
    </>
  )
}

export default UrlMapContainerBox;