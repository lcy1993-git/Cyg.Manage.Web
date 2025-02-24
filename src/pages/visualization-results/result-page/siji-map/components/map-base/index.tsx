import SideMenuTree from '@/pages/visualization-results/components/side-menu-tree'
import { bd09Towgs84 } from '@/pages/visualization-results/utils'
import { changeLayerType, clearHighlightLayer } from '@/pages/visualization-results/utils/methods'
import { initIpLocation, loadEnums } from '@/services/visualization-results/visualization-results'
import { handleDecrypto } from '@/utils/utils'
import { useMount, useSize } from 'ahooks'
import { observer } from 'mobx-react-lite'
// import LayerGroup from 'ol/layer/Group'
import Map from 'ol/Map'
import { transform } from 'ol/proj'
import { useEffect, useRef, useState } from 'react'
import Footer from '../../../../components/footer'
import { useContainer } from '../../../mobx-store'
import { changerLayer, initMap, refreshMap } from '../../utils/map'
import MapDisplay from '../map-display'
import { TableDataType } from '../side-popup'
import styles from './index.less'

const SjBaseMap = observer((props: any) => {
  const [map] = useState<Map | null>(null)
  const mapElement = useRef(null)
  const [checkedLayers, setCheckedLayers] = useState<number[]>([1])
  const { view, setView } = props

  // 图层控制层数据
  const [preDesignVisible, setPreDesignVisible] = useState<boolean>(false)
  // const [surveyLayerVisible, setSurveyLayerVisible] = useState<boolean>(true)
  // const [planLayerVisible, setPlanLayerVisible] = useState<boolean>(false)
  // const [designLayerVisible, setDesignLayerVisible] = useState<boolean>(false)
  // const [dismantleLayerVisible, setDismantleLayerVisible] = useState<boolean>(false)
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
    visibleLeftSidebar,
    surveyLayerVisible,
    planLayerVisible,
    designLayerVisible,
    dismantleLayerVisible,
  } = vState

  const boxSize = useSize(mapElement)

  // 图层切换模态框类型
  const [, setSourceType] = useState<string | number>('')

  // 右侧边栏状态
  const [rightSidebarVisiviabel, setRightSidebarVisiviabelMap] = useState(false)
  const setRightSidebarVisiviabel = (state: boolean) => {
    ;(map && state) || clearHighlightLayer(map)
    setRightSidebarVisiviabelMap(state)
  }
  const [rightSidebarData, setRightSidebarData] = useState<TableDataType[]>([])

  // 勘察轨迹
  const [, setSurveyModalVisible] = useState(false)
  const [, setSurveyModalData] = useState(null)
  // 挂载
  useMount(() => {
    loadEnums().then((data) => {
      const decryData = handleDecrypto(data)
      localStorage.setItem('loadEnumsData', JSON.stringify(decryData.content))
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

  // 左侧菜单伸缩时刷新地图尺寸
  useEffect(() => {
    map?.updateSize()
  }, [visibleLeftSidebar])

  useEffect(() => {
    map?.updateSize()
  }, [JSON.stringify(boxSize)])

  // 处理高亮图层
  // const highlight = useCallback(
  //   (t: number, state) => {
  //     const highlightLayer: any = map
  //       ?.getLayers()
  //       .getArray()
  //       .find((layer: any) => {
  //         return layer.get('name') === 'highlightLayer'
  //       })
  //     const highlightLayers = highlightLayer?.getSource().getFeatures()
  //     const hightType = highlightLayers && highlightLayers[0]?.getProperties().layerType
  //     hightType === t && highlightLayer?.setVisible(false)
  //     if (state[1] || state[2] || state[3]) {
  //       // getLayerGroupByName('surveyLayer', layerGroups).setOpacity(0.5)
  //     } else {
  //       // getLayerGroupByName('surveyLayer', layerGroups).setOpacity(1)
  //     }
  //   },
  //   [map]
  // )

  // const layersState = useMemo(() => {
  //   return [surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible]
  // }, [surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible])
  // // 当预设图层切换时
  // useUpdateEffect(() => {
  //   // 处理预设 // ! TODO
  //   // getLayerGroupByName('preDesignLayer', layerGroups).setVisible(preDesignVisible)
  // }, [preDesignVisible])

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

  const onlocationClick = () => {
    // 当点击定位按钮时
    let promise = initIpLocation()
    promise.then((data: any) => {
      if (data.ipLoc.status === 'success' && data.rgc) {
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
    // setSurveyLayerVisible: setSurveyLayerVisible,
    // setPlanLayerVisible: setPlanLayerVisible,
    // setDesignLayerVisible: setDesignLayerVisible,
    // setDismantleLayerVisible: setDismantleLayerVisible,
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

      <div className={styles.footer}>
        <Footer onlocationClick={onlocationClick} />
      </div>
      {/* <div className={styles.surveyModal}>
        {<SurveyModal resData={surveyModalData} hidden={() => setSurveyModalVisible(false)} /> }
      </div> */}
      {/* {surveyModalVisible && (
        <SurveyModal resData={surveyModalData!} hidden={() => setSurveyModalVisible(false)} />
      )} */}
    </>
  )
})

export default SjBaseMap
