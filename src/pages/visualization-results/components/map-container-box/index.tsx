import React, { useState } from 'react';
import ViewCtrol from '../view-ctrol';
import BaseMap from '../base-map';
import { initLayers, initOtherLayers, initView } from './utils';

import styles from './index.less';
import Layer from 'ol/layer/Layer';
import LayerGroup from 'ol/layer/Group';

const MapContainerBox = (props: any) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData));
  const [otherlayers, setOtherLayers] = useState<LayerGroup[]>(initOtherLayers());
  
  // 视图
  const [view, setView] = useState(initView);

  return (
    <div className={styles.mapContainerBox}>
      <ViewCtrol
        {...props}
      />
      <BaseMap
        layers={layers ?? []}
        otherlayers={otherlayers}
        controls={[]}
        view={view}
      />
    </div>
  )
}

export default MapContainerBox;