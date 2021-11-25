import { View } from 'ol';
import * as proj from 'ol/proj';
import { ViewRef } from './../typings/index';

/**
 * 挂载View
 * @param viewRef
 */
export function initView (viewRef: ViewRef) {
  viewRef.view = new View({
    center: proj.transform([104.08537388, 30.58850819], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5,
    maxZoom: 25,
    minZoom: 1,
    projection: 'EPSG:3857',
  })
}

