import { bd09Towgs84 } from '@/pages/visualization-results/utils'
import { BaseMapProps } from '@/pages/visualization-results/utils/init'
import {
  changeLayerType,
  clearHighlightLayer,
  getLayerGroupByName,
} from '@/pages/visualization-results/utils/methods'
import { initIpLocation, loadEnums } from '@/services/visualization-results/visualization-results'
import { useMount, useSize, useUpdateEffect } from 'ahooks'
import { observer } from 'mobx-react-lite'
// import LayerGroup from 'ol/layer/Group'
import Map from 'ol/Map'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContainer } from '../../mobx-store'
import { changerLayer, initMap } from '../../utils/map'

import CheckSource from '../check-source'
import Footer from '../footer'
import MapDisplay from '../map-display'
import SideMenuTree from '../side-menu-tree'
import { TableDataType } from '../side-popup'
import SurveyModal from '../survey-modal/'
import SurveyTrack from '../survey-track'
import styles from './index.less'
import { refreshMap } from '@/pages/visualization-results/siji-map/utils/map'

const BaseMap = observer((props: BaseMapProps) => {
  const [map, setMap] = useState<Map | null>(null)
  const mapElement = useRef(null)
  const [checkedLayers, setCheckedLayers] = useState<number[]>([1])
  const { layers, layerGroups, trackLayers, view, setView, setLayerGroups } = props

  // 图层控制层数据
  const [preDesignVisible, setPreDesignVisible] = useState<boolean>(false)
  const [surveyLayerVisible, setSurveyLayerVisible] = useState<boolean>(true)
  const [planLayerVisible, setPlanLayerVisible] = useState<boolean>(false)
  const [designLayerVisible, setDesignLayerVisible] = useState<boolean>(false)
  const [dismantleLayerVisible, setDismantleLayerVisible] = useState<boolean>(false)
  const [sideMenuVisibel, setSideMenuVisibel] = useState(true)
  // 从Vstate获取外部传入的数据
  const store = useContainer()

  // 添加多媒体方法
  const addMediaData = (listData: any) => {
    store.setMediaListVisibel(true)
    store.setMediaListData(listData)
  }

  const { vState } = store
  const {
    checkedProjectIdList: projects,
    filterCondition,
    visibleLeftSidebar,
    positionMap,
    observeTrack,
    mediaSign, // 多媒体标记开关
    rangeDate,
  } = vState

  const { kvLevel } = filterCondition

  const boxSize = useSize(mapElement)

  // 图层切换模态框类型
  const [sourceType, setSourceType] = useState<string | number>('')

  // 右侧边栏状态
  const [rightSidebarVisiviabel, setRightSidebarVisiviabelMap] = useState(false)
  const setRightSidebarVisiviabel = (state: boolean) => {
    ;(map && state) || clearHighlightLayer(map)
    setRightSidebarVisiviabelMap(state)
  }
  const [rightSidebarData, setRightSidebarData] = useState<TableDataType[]>([])

  // 勘察轨迹
  const [surveyModalVisible, setSurveyModalVisible] = useState(false)
  const [surveyModalData, setSurveyModalData] = useState(null)
  // 挂载
  useMount(() => {
    loadEnums().then((data) => {
      localStorage.setItem('loadEnumsData', JSON.stringify(data.content))
    })

    initMap(mapElement.current!, {
      setRightSidebarVisiviabel,
      setRightSidebarData,
      setSurveyModalVisible,
      setSurveyModalData,
      addMediaData,
    })
    // setMap(initialMap)
    // store.setMapRef(initialMap)
    // 注册 点击事件
  })

  // 动态刷新refreshMap
  useEffect(() => {
    // const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    refreshMap(projects, checkedLayers)
  }, [JSON.stringify(projects)])

  // 动态刷新图层
  // useEffect(() => {
  //   const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
  //   map && refreshMap(ops, projects!, true, startDate, endDate)
  // }, [JSON.stringify(projects), startDate, endDate])

  useEffect(() => {
    // 加载勘察轨迹
  }, [observeTrack, JSON.stringify(projects)])

  useEffect(() => {
    // 加载多媒体标记
  }, [mediaSign])

  // 地图定位
  useEffect(() => {}, [JSON.stringify(positionMap)])

  // 左侧菜单伸缩时刷新地图尺寸
  useEffect(() => {
    map?.updateSize()
  }, [visibleLeftSidebar])

  useEffect(() => {
    map?.updateSize()
  }, [JSON.stringify(boxSize)])

  // 处理高亮图层
  const highlight = useCallback(
    (t: number, state) => {
      const highlightLayer: any = map
        ?.getLayers()
        .getArray()
        .find((layer: any) => {
          return layer.get('name') === 'highlightLayer'
        })
      const highlightLayers = highlightLayer?.getSource().getFeatures()
      const hightType = highlightLayers && highlightLayers[0]?.getProperties().layerType
      hightType === t && highlightLayer?.setVisible(false)
      if (state[1] || state[2] || state[3]) {
        // getLayerGroupByName('surveyLayer', layerGroups).setOpacity(0.5)
      } else {
        // getLayerGroupByName('surveyLayer', layerGroups).setOpacity(1)
      }
    },
    [map]
  )

  const layersState = useMemo(() => {
    return [surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible]
  }, [surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible])
  // 当预设图层切换时
  useUpdateEffect(() => {
    // 处理预设 // ! TODO
    // getLayerGroupByName('preDesignLayer', layerGroups).setVisible(preDesignVisible)
  }, [preDesignVisible])

  // 当勘察图层切换时
  useEffect(() => {
    // highlight(1, layersState)
    const layers = changeLayerType(1, surveyLayerVisible)
    setCheckedLayers(layers)
    // getLayerGroupByName('surveyLayer', layerGroups).setVisible(surveyLayerVisible)
    // const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    refreshMap(projects!, layers)
  }, [surveyLayerVisible])
  // 当方案图层点击时
  useEffect(() => {
    // highlight(2, layersState)
    const layers = changeLayerType(2, planLayerVisible)
    // getLayerGroupByName('planLayer', layerGroups).setVisible(planLayerVisible)
    // const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    setCheckedLayers(layers)
    refreshMap(projects!, layers)
  }, [planLayerVisible])
  // 当设计图层点击时
  useEffect(() => {
    // highlight(3, layersState)

    const layers = changeLayerType(4, designLayerVisible)
    // const layers = getLayerGroupByName('designLayer', layerGroups)
    setCheckedLayers(layers)
    // const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    refreshMap(projects!, layers)
  }, [designLayerVisible])
  // 当拆除图层点击时
  useEffect(() => {
    // highlight(4, layersState)
    const layers = changeLayerType(8, dismantleLayerVisible)
    // getLayerGroupByName('dismantleLayer', layerGroups).setVisible(dismantleLayerVisible)
    setCheckedLayers(layers)
    // const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    refreshMap(projects!, layers)
  }, [dismantleLayerVisible])

  const [street, setStreet] = useState(0)
  const [satellite, setSatellite] = useState(0)

  const prop = { street, setStreet, satellite, setSatellite }

  const onlocationClick = () => {
    // 当点击定位按钮时
    let promise = initIpLocation()
    promise.then((data: any) => {
      if (data.ipLoc.status == 'success' && data.rgc) {
        let lon = data.rgc.result.location.lng
        let lat = data.rgc.result.location.lat
        let lont = bd09Towgs84(lon, lat)
        let center = transform(lont, 'EPSG:4326', 'EPSG:3857')
        let duration = 5000

        view.animate(
          {
            center: center,
            zoom: 18,
            duration: duration,
          },
          () => {}
        )
        setView(view)
      }
    })
  }

  const onSatelliteMapClick = () => {
    // 卫星图点击时
    changerLayer(2)
    // getLayerByName('imgLayer', layers)?.setVisible(true)
    // getLayerByName('vecLayer', layers)?.setVisible(false)
  }

  const onStreetMapClick = () => {
    // 街道图点击时
    changerLayer(1)
    // getLayerByName('imgLayer', layers)?.setVisible(false)
    // getLayerByName('vecLayer', layers)?.setVisible(true)
  }
  const controlLayersProps = {
    surveyLayerVisible: surveyLayerVisible,
    planLayerVisible: planLayerVisible,
    designLayerVisible: designLayerVisible,
    dismantleLayerVisible: dismantleLayerVisible,
    preDesignVisible,
    setPreDesignVisible,
    setSurveyLayerVisible: setSurveyLayerVisible,
    setPlanLayerVisible: setPlanLayerVisible,
    setDesignLayerVisible: setDesignLayerVisible,
    setDismantleLayerVisible: setDismantleLayerVisible,
  }

  const sidePopupProps = {
    rightSidebarVisible: rightSidebarVisiviabel,
    data: rightSidebarData,
    setRightSidebarVisiviabel,
  }

  return (
    <>
      <div ref={mapElement} className={styles.mapBox}></div>

      <div className={`${styles.sideMenuTree} ${sideMenuVisibel ? styles.open : styles.close}`}>
        <SideMenuTree
          onChange={() => setSideMenuVisibel(!sideMenuVisibel)}
          sideMenuVisibel={sideMenuVisibel}
          controlLayersProps={controlLayersProps}
          sidePopupProps={sidePopupProps}
        />
      </div>

      {/* <div className={`${styles.surveytrack} ${!sideMenuVisibel ? styles.surveytrackCloese : ''}`}>
        <SurveyTrack />
      </div> */}
      <div className={`${styles.mapDisplay} ${!sideMenuVisibel ? styles.mapDisplayCloese : ''}`}>
        <MapDisplay
          onSatelliteMapClick={onSatelliteMapClick}
          onStreetMapClick={onStreetMapClick}
          setSourceType={setSourceType}
        />
      </div>
      <CheckSource
        type={sourceType}
        map={map!}
        setSourceType={setSourceType}
        {...prop}
      ></CheckSource>
      <div className={styles.footer}>
        <Footer onlocationClick={onlocationClick} />
      </div>
      {/* <div className={styles.surveyModal}>
        {<SurveyModal resData={surveyModalData} hidden={() => setSurveyModalVisible(false)} /> }
      </div> */}
      {surveyModalVisible && (
        <SurveyModal resData={surveyModalData!} hidden={() => setSurveyModalVisible(false)} />
      )}
    </>
  )
})

export default BaseMap
