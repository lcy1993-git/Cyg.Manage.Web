import React, { useState } from 'react';
import ViewCtrol from '../view-ctrol';
import BaseMap from '../base-map';
import { initLayers, initOtherLayers, initView } from './utils';

import styles from './index.less';

const MapContainerBox: React.FC<any> = (props) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState(initLayers(mapData));
  const [otherlayers, setOtherLayers] = useState<any>(initOtherLayers());
  
  // 视图
  const [view, setView] = useState(initView);

  return (
    <div className={styles.mapContainerBox}>
      <ViewCtrol
        {...props}
      />
      <BaseMap
        layers={layers ?? []}
        controls={[]}
        view={view}
      />
    </div>
  )
}

export default MapContainerBox;