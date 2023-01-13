import { initIpLocation, loadEnums } from '@/services/visualization-results/visualization-results'
import { useMount, useSize, useUpdateEffect } from 'ahooks'
import { observer } from 'mobx-react-lite'
import LayerGroup from 'ol/layer/Group'
import Map from 'ol/Map'
import { transform } from 'ol/proj'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useContainer } from '../../result-page/mobx-store'
import { bd09Towgs84 } from '../../utils'
import { BaseMapProps } from '../../utils/init'
import { mapClick, mapMoveend, mapPointermove } from '../../utils/mapClick'
import {
  changeLayerType,
  checkZoom,
  clearHighlightLayer,
  clearTrackLayers,
  drawBox,
  getLayerByName,
  getLayerGroupByName,
  loadMediaSign,
  loadMediaSignData,
  loadTrackLayers,
  refreshMap,
  relocateMap,
  setDrawBox,
} from '../../utils/methods'
import CheckSource from '../check-source'
import Footer from '../footer'
import MapDisplay from '../map-display'
import SideMenuTree from '../side-menu-tree'
import { TableDataType } from '../side-popup'
import SurveyModal from '../survey-modal/'
import SurveyTrack from '../survey-track'
import styles from './index.less'

const BaseMap = observer((props: BaseMapProps) => {
  const [map, setMap] = useState<Map | null>(null)
  const mapElement = useRef(null)
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

  const { startDate, endDate } = rangeDate

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
    const initialMap = new Map({
      target: mapElement.current!,
      layers: [...layers],
      view,
      controls: [],
    })

    // 初始化勘察图层、方案图层、设计图层、删除图层、
    layerGroups.forEach((item: LayerGroup) => {
      initialMap.addLayer(item)
    })

    // 初始化勘察轨迹图层、交底轨迹图层
    trackLayers.forEach((item: LayerGroup) => {
      initialMap.addLayer(item)
    })
    drawBox(initialMap, layerGroups)

    const ops = { layers, layerGroups, view, setView, setLayerGroups, map: initialMap, kvLevel }

    document.addEventListener('keydown', async (e) => {
      if (e.keyCode === 16) {
        setDrawBox(true)
      }

      if (e.keyCode === 17) {
        // Ctrl开启点选
        initialMap.set('isCtrl', true)
      }

      if (e.keyCode === 27) {
        // esc清空迁移数据
        // Ctrl开启点选
        clearHighlightLayer(initialMap)
      }
    })

    document.addEventListener('keyup', async (e) => {
      if (e.keyCode === 16) {
        setDrawBox(false)
      }

      if (e.keyCode === 17) {
        initialMap.set('isCtrl', false)
      }
    })

    // 地图点击事件
    initialMap.on('click', (e: Event) =>
      mapClick(e, initialMap, {
        setRightSidebarVisiviabel,
        setRightSidebarData,
        setSurveyModalVisible,
        setSurveyModalData,
        addMediaData,
      })
    )
    initialMap.on('pointermove', (e: Event) => mapPointermove(e, initialMap))
    initialMap.on('moveend', (e: Event) => {
      refreshMap(ops, null)
      mapMoveend(e, initialMap)
    })

    initialMap.getView().on('change:resolution', (e: Event) => {
      checkZoom(e, initialMap)
    })
    refreshMap(ops, projects!)
    setMap(initialMap)
    store.setMapRef(initialMap)

    // 注册 点击事件
  })

  // 动态刷新refreshMap
  useEffect(() => {
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    map && refreshMap(ops, projects!)
    loadMediaSignData()
  }, [JSON.stringify(projects)])

  // 动态刷新图层
  // useEffect(() => {
  //   const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
  //   map && refreshMap(ops, projects!, true, startDate, endDate)
  // }, [JSON.stringify(projects), startDate, endDate])

  useEffect(() => {
    // 加载勘察轨迹
    if (observeTrack) map && loadTrackLayers(map, trackLayers)
    else clearTrackLayers(trackLayers)
  }, [observeTrack, JSON.stringify(projects)])

  useEffect(() => {
    // 加载多媒体标记
    if (map) {
      loadMediaSign(map, layerGroups, mediaSign)
    }
  }, [mediaSign])

  // 地图定位
  useEffect(() => {
    map && relocateMap(map)
  }, [JSON.stringify(positionMap)])

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
        getLayerGroupByName('surveyLayer', layerGroups).setOpacity(0.5)
      } else {
        getLayerGroupByName('surveyLayer', layerGroups).setOpacity(1)
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
    getLayerGroupByName('preDesignLayer', layerGroups).setVisible(preDesignVisible)
  }, [preDesignVisible])

  // 当勘察图层切换时
  useEffect(() => {
    highlight(1, layersState)
    changeLayerType(1, surveyLayerVisible)
    getLayerGroupByName('surveyLayer', layerGroups).setVisible(surveyLayerVisible)
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    map && refreshMap(ops, projects!)
  }, [surveyLayerVisible])
  // 当方案图层点击时
  useEffect(() => {
    highlight(2, layersState)
    changeLayerType(2, planLayerVisible)
    getLayerGroupByName('planLayer', layerGroups).setVisible(planLayerVisible)
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    map && refreshMap(ops, projects!)
  }, [planLayerVisible])
  // 当设计图层点击时
  useEffect(() => {
    highlight(3, layersState)
    changeLayerType(4, designLayerVisible)
    getLayerGroupByName('designLayer', layerGroups).setVisible(designLayerVisible)
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    map && refreshMap(ops, projects!)
  }, [designLayerVisible])
  // 当拆除图层点击时
  useEffect(() => {
    highlight(4, layersState)
    changeLayerType(8, dismantleLayerVisible)
    getLayerGroupByName('dismantleLayer', layerGroups).setVisible(dismantleLayerVisible)
    const ops = { layers, layerGroups, view, setView, setLayerGroups, map, kvLevel }
    map && refreshMap(ops, projects!)
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
    getLayerByName('imgLayer', layers)?.setVisible(true)
    getLayerByName('vecLayer', layers)?.setVisible(false)
  }

  const onStreetMapClick = () => {
    // 街道图点击时
    getLayerByName('imgLayer', layers)?.setVisible(false)
    getLayerByName('vecLayer', layers)?.setVisible(true)
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

      <div className={`${styles.surveytrack} ${!sideMenuVisibel ? styles.surveytrackCloese : ''}`}>
        <SurveyTrack />
      </div>
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
