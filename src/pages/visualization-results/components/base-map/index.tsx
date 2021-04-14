import React, { FC, useRef, useState } from 'react';
import Map from 'ol/Map'
import { useMount } from 'ahooks';

import styles from './index.less';

const BaseMap: FC<any> = (props: any) => {

  const [map, setMap] = useState<any>(null);

  const mapElement = useRef(null)
  const { layers, otherLayers, view} = props;

  useMount(() => {
    const initialMap = new Map({
      target: mapElement.current!,
      layers: [...layers],
      view,
      controls: []
    })
    // save map and vector layer references to state
    setMap(initialMap);
  });

  return (
    <div ref={mapElement} className={styles.mapBox}></div>
  );
}

export default BaseMap;