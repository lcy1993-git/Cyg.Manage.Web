import React, { useState } from 'react';
import MapBase from '../map-base';
import Layer from 'ol/layer/Layer';
import LayerGroup from 'ol/layer/Group';
import { initLayers, initOtherLayers, initView, initOtherLayersState } from '../../utils';
import styles from './index.less';

const MapContainer = (props: any) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData));
  const [otherLayers, setOtherLayers] = useState<LayerGroup[]>(initOtherLayers());

  const [layersState, setLayersState] = useState(0);
  const [otherlayersState, setOtherLayerState]  = useState(initOtherLayersState);

  // 视图
  const [view, setView] = useState(initView);


  // 事件
  const onTest = function () {
    console.log(layers)
  }

  return (
    <div className={styles.mapContainerBox}>
      <button onClick={onTest}>
        图层测试DEMO
      </button>
      <MapBase
        layers={layers}
        otherLayers={otherLayers}
        controls={[]}
        view={view}
      />
    </div>
  )
}

export default MapContainer;