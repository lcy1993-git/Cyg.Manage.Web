import React, { useEffect, useState } from 'react';
import MapBase from '../map-base';
import Layer from 'ol/layer/Layer';
import Vector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import LayerGroup from 'ol/layer/Group';
import GeoJSON from 'ol/format/GeoJSON';
import { initLayers, initOtherLayers, initView, initOtherLayersState } from '../../utils';
import styles from './index.less';
import { loadLayer } from '@/services/visualization-results/visualization-results';
import { pointStyle, line_style, cable_channel_styles, mark_style, fzx_styles } from '../../utils/pointStyle';

const MapContainer = (props: any) => {
  const { mapData } = props;

  // 图层
  const [layers, setLayers] = useState<Layer[]>(initLayers(mapData));
  const [layerGroups, setLayerGroups] = useState<LayerGroup[]>(initOtherLayers());

  // 视图
  const [view, setView] = useState(initView);



  return (
    <div className={styles.mapContainerBox}>
      <MapBase
        layers={layers}
        setLayers={setLayers}
        setLayerGroups={setLayerGroups}
        layerGroups={layerGroups}
        controls={[]}
        view={view}
        setView={setView}
      />
    </div>
  )
}
export default MapContainer;