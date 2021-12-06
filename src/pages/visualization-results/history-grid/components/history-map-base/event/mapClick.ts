import { MapBrowserEvent } from 'ol'
import { Dispatch, SetStateAction } from 'react'
import { HistoryDispatch } from '../../../store'
import type { DragBoxProps, InterActionRef, MapRef, SourceRef } from './../typings/index'

interface Ops {
  interActionRef: InterActionRef
  mapRef: MapRef
  setState: HistoryDispatch
  setDragBoxProps: Dispatch<SetStateAction<DragBoxProps>>
}

export default function mapClick(
  e: MapBrowserEvent<MouseEvent>,
  { mapRef, setState, setDragBoxProps }: Ops
) {
  // var pixel = e.pixel;
  // console.log(pixel);

  // var lonlat = map.getLonLatFromPixel(pixel);
  //   lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326")); //由900913坐标系转为4326
  // 　　　　 alert(lonlat.lon+", "+lonlat.lat);
  // 设置当前坐标
  // setState("currentMousePosition", [...e.pixel] as [number, number])

  setDragBoxProps({
    visible: false,
    position: [0, 0],
    selected: [],
  })

  setState((state) => {
    return {
      ...state,
      UIStatus: {
        ...state.UIStatus,
        currentMousePosition: [...e.pixel] as [number, number],
      },
    }
  })
  // setState({
  //   type: 'changeUIStatus',
  //   payload: {
  //     ...UIStatus,
  //     currentMousePosition: [...e.pixel] as [number, number],
  //   },
  // })

  // 当处于框选状态时，清理所有框选元素
  // if (interActionRef.isDragBox === true) {
  //   interActionRef.select!.boxSelect.getFeatures().clear()
  //   return
  // }
  // 多选状态下ctrl键按下 不进行操作
  // if (e.originalEvent.ctrlKey) return

  // console.log(sourceRef.historyPointSource.getFeatures());
  // console.log(sourceRef.historyLineSource.getFeatures());
  // console.log(sourceRef.designLineSource.getFeatures());
  // console.log(sourceRef.designLineSource.getFeatures());
  // console.log(sourceRef.highLightLineSource.getFeatures());
  // console.log(sourceRef.highLightPointSource.getFeatures());

  // 获取被选中的元素
  const highLightFeature = mapRef.map.getFeaturesAtPixel(e.pixel, {
    layerFilter(f) {
      return f.get('name') === 'highLightPointLayer' || f.get('name') === 'highLightLineLayer'
    },
  })[0]
  if (!highLightFeature) {
    setState((state) => {
      return {
        ...state,
        selectedData: [],
      }
    })
  }
  // 点击时是否有高亮图层
  // if(highLightFeature) {
  //   const type = highLightFeature.getGeometry()?.getType()
  //   if(type === 'Point') {
  //     sourceRef.highLightPointSource.removeFeature(highLightFeature as Feature<Point>)
  //   }else {
  //     sourceRef.highLightLineSource.removeFeature(highLightFeature as Feature<LineString>)
  //   }
  // } else {
  //   const baseFeature = mapRef.map.getFeaturesAtPixel(e.pixel)[0]
  //   // 判断是否有选择的元素
  //   if(baseFeature) {
  //     const type = baseFeature.getGeometry()?.getType() === "Point" ? "Point" : "Line";
  //     const sourceType = baseFeature.get("sourceType");
  //     sourceRef[`${sourceType}${type}Source`]?.removeFeature(baseFeature)
  //     sourceRef[`highLight${type}Source`]?.addFeature(baseFeature as Feature<Point> & Feature<LineString>)
  //   }
  // }
}
