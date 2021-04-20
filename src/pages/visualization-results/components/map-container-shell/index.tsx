import React from 'react';
import MapContainer from '../map-container';
import { useRequest } from 'ahooks';
import { getMapList, initIpLocation } from '@/services/visualization-results/visualization-results';

const UrlMapContainerBox = (props: any) => {
  const {data: mapData} = useRequest(() => getMapList({"sourceType": 0,"layerType": 0,"enableStatus": 1,"availableStatus": 0}));
  console.log(1)
  console.log(initIpLocation())
  return (
    <>
      {mapData && mapData.code=== 200 && <MapContainer mapData={mapData} {...props}></MapContainer>}
    </>
  )
}

export default UrlMapContainerBox;