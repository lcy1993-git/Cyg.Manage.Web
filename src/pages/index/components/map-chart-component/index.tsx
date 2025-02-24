import { useLayoutStore } from '@/layouts/context'
import { AreaInfo, getMapStatisticsData, MapStatisticsData } from '@/services/index'
import { exportHomeStatisticData } from '@/services/operation-config/cockpit'
import { useMount, useRequest, useSize } from 'ahooks'
import { Button, message } from 'antd'
import * as echarts from 'echarts'
import 'echarts/lib/chart/map'
import 'echarts/lib/component/tooltip'
// import ProjectNumberIcon from '@/assets/image/index/project-number.png';
import { isArray } from 'lodash'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { history } from 'umi'
import borderStylesHTML from '../../utils/borderStylesHTML'
import ChartBox from '../chart-box'
import styles from './index.less'
import { cityCodeObject } from './map-info'

interface MapChartComponentProps {
  currentAreaInfo: AreaInfo
  setCurrentAreaInfo: (areaInfo: any) => void
  isConfig?: boolean
}

let mapStatus = {
  pt: [0, 0],
  name: '',
}

const MapChartComponent: React.FC<MapChartComponentProps> = (props) => {
  const { setCurrentAreaInfo, currentAreaInfo, isConfig } = props

  const [requestExportLoading, setRequestExportLoading] = useState<boolean>(false)
  const { setMapSelectCity } = useLayoutStore()
  const divRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    //@ts-ignore
    window.setSelectCity = (city: string) => {
      setMapSelectCity?.(city)
      history.push('/visualization-results/result-page')
    }
    return () => {
      //@ts-ignore
      window.testClick = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const size = useSize(divRef)

  let myChart: any = null

  // const { run: getMapData } = useRequest(getMapRegisterData, {
  //   manual: true,
  // })

  const { run: getStatisticData, data: mapStatisticData = [] } = useRequest(getMapStatisticsData, {
    manual: true,
  })

  const projectTotalNumber = useMemo(() => {
    return mapStatisticData?.reduce((sum, item) => {
      return sum + item.projectQuantity
    }, 0)
  }, [JSON.stringify(mapStatisticData)])

  const ohterProjectTotalNumber = useMemo(() => {
    return mapStatisticData.find((item) => item.areaCode.includes('_other'))?.projectQuantity ?? 0
  }, [JSON.stringify(mapStatisticData)])

  const getMapOption = (mapName: string, getMapStatisticData: MapStatisticsData[]) => {
    const mapShowData = getMapStatisticData?.map((item) => {
      return {
        name: item.area,
        areaCode: item.areaCode,
        value: item.projectQuantity,
        selected: false,
      }
    })

    return {
      tooltip: {
        trigger: 'item',
        showDelay: 20,
        backgroundColor: 'rgba(0,0,0,0.9)',
        borderColor: '#000',
        enterable: true, // 鼠标是否可以进入浮层
        position(pt: any, params: any) {
          const nameIndex = getMapStatisticData?.findIndex((item) => item.area === params.name)
          if (params.name === mapStatus.name) {
            if (nameIndex > -1) {
              return [mapStatus.pt[0] - 150, mapStatus.pt[1] - 95]
            } else {
              return [pt[0] - 110, pt[1] - 65]
            }
          } else {
            mapStatus = {
              name: params.name,
              pt,
            }
            return [mapStatus.pt[0] - 150, mapStatus.pt[1] - 95]
            // return [pt[0] - 110, pt[1] - 65];
          }
        },
        confine: true,
        formatter(params: any) {
          const { name, data } = params
          const nameIndex = getMapStatisticData?.findIndex((item) => item.area === name)
          if (nameIndex > -1) {
            return (
              borderStylesHTML +
              `
                            <span style="color: #fff">${name}</span> <br />
                            <span style="color: #2AFE97">项目数量</span>: <span style="color: #fff">${
                              getMapStatisticData[nameIndex!].projectQuantity
                            }</span>
                            <div style="color: #2AFE97">可视化成果: <span onclick=setSelectCity("${
                              cityCodeObject[name] ?? data?.areaCode
                            }")  href='/visualization-results/result-page' style="display: inline-block;cursor: pointer; width: 48px;color: #fff;border-radius: 3px; text-align: center; height: 24px;line-height: 24px;background-color: #4DA944; margin-left: 8px;">跳转</span></div>
                            
                        `
            )
          }
          return (
            borderStylesHTML +
            `
                        <span style="color: #fff">${name}</span>  <br />
                        <span style="color: #2AFE97">项目数量:</span> <span style="color: #fff">0</span>
                    `
          )
        },
      },

      series: [
        {
          type: 'map',
          map: mapName,
          tooltip: {
            show: true,
          },
          zoom: mapName === '100000' ? 1.2 : 1,
          roam: false,
          //layoutCenter: ["50%", "50%"], //地图位置
          layoutSize: '100%',
          geoIndex: 1,
          selectedMode: false,
          itemStyle: {
            normal: {
              borderWidth: 0.8, //区域边框宽度
              borderColor: '#74AC91', //区域边框颜色
              areaColor: '#00483C', //区域颜色
              label: {
                show: false,
              },
            },
            emphasis: {
              borderWidth: 0.8,
              borderColor: '#74AC91',
              areaColor: '', //区域颜色
              label: {
                show: false,
              },
            },
            select: {
              borderWidth: 0.8,
              borderColor: '#74AC91',
              areaColor: '', //区域颜色
              label: {
                show: false,
              },
            },
          },
          data: mapShowData,
          zlevel: 100,
        },
      ],
      dataRange: {
        x: '-10000px',
        y: '-10000px',
        splitList: [
          { start: 1000, color: '#FEB12A' },
          { start: 100, end: 1000, color: '#D4FD50' },
          { start: 10, end: 100, color: '#2AFE97' },
          { start: 1, end: 10, color: '#2CFFFE' },
        ],
      },
    }
  }

  const firstMapInitChartEvent = async () => {
    // 初试化的时候做判断
    if (currentAreaInfo.areaLevel === '1') {
      const statisticData = await getStatisticData({ areaCode: '', areaType: '1' })
      if (statisticData && isArray(statisticData) && statisticData.length === 1) {
        const provinceStatisticData = await getStatisticData({
          areaCode: statisticData[0].areaCode,
          areaType: '2',
        })

        if (
          provinceStatisticData &&
          isArray(provinceStatisticData) &&
          provinceStatisticData.length === 1 &&
          !provinceStatisticData[0].areaCode.includes('othercity')
        ) {
          const areaStatisticData = await getStatisticData({
            areaCode: provinceStatisticData[0].areaCode,
            areaType: '3',
          })
          initChart(provinceStatisticData[0].areaCode, areaStatisticData, '3')
          setCurrentAreaInfo({
            areaId: provinceStatisticData[0].areaCode,
            cityId: statisticData[0].areaCode,
            areaLevel: '3',
          })
        } else {
          initChart(statisticData[0].areaCode, provinceStatisticData, '2')

          setCurrentAreaInfo({
            areaId: statisticData[0].areaCode,
            cityId: statisticData[0].areaCode,
            areaLevel: '2',
          })
        }
      } else {
        initChart('100000', statisticData, '1')
      }
    } else {
      const provinceStatisticData = await getStatisticData({
        areaCode: currentAreaInfo.areaId,
        areaType: currentAreaInfo.areaLevel,
      })

      initChart(currentAreaInfo.areaId!, provinceStatisticData, currentAreaInfo.areaLevel!)
    }
  }

  const initChart = async (
    currentAreaId: string,
    getMapStatisticData: MapStatisticsData[],
    currentAreaLevel: string
  ) => {
    const option = getMapOption(currentAreaId, getMapStatisticData)

    const resData = await require(`@/assets/json/${currentAreaId}.json`)

    if (divRef && divRef.current) {
      echarts.registerMap(currentAreaId, resData)
      myChart = echarts.init(divRef.current as HTMLDivElement)
      // @ts-ignore
      myChart.setOption(option)
      myChart.off('click')
      myChart.off('mouseover')
      myChart.on('click', async (params: any) => {
        const { name } = params
        if (cityCodeObject[name]) {
          // 新增需求，有项目数量的时候才可以下钻
          const chooseAreaDataIndex = getMapStatisticData.findIndex((item) => item.area === name)
          if (chooseAreaDataIndex === -1) {
            return
          }
          if (!getMapStatisticData[chooseAreaDataIndex].projectQuantity) {
            return
          }
          const statisticData = await getStatisticData({
            areaCode: cityCodeObject[name],
            areaType: String(parseFloat(currentAreaLevel) + 1),
          })
          if (parseFloat(currentAreaLevel) + 1 === 2) {
            setCurrentAreaInfo({
              areaId: cityCodeObject[name],
              cityId: cityCodeObject[name],
              areaLevel: String(parseFloat(currentAreaLevel!) + 1),
            })
          } else {
            setCurrentAreaInfo({
              areaId: cityCodeObject[name],
              cityId: currentAreaId,
              areaLevel: String(parseFloat(currentAreaLevel!) + 1),
            })
          }
          initChart(cityCodeObject[name], statisticData, String(parseFloat(currentAreaLevel) + 1))
        }
      })

      myChart.on('mouseover', function () {
        myChart.dispatchAction({
          type: 'downplay',
        })
      })
    }
  }

  const resize = () => {
    if (myChart) {
      setTimeout(() => {
        myChart.resize()
      }, 100)
    }
  }

  const provinceClickEvent = async () => {
    const statisticData = await getStatisticData({ areaCode: '', areaType: '1' })
    initChart('100000', statisticData, '1')

    setCurrentAreaInfo({
      areaId: '',
      cityId: '',
      areaLevel: '1',
    })
  }

  const cityClickEvent = async () => {
    if (currentAreaInfo.areaLevel === '1') {
      return
    }
    const statisticData = await getStatisticData({
      areaCode: currentAreaInfo.cityId,
      areaType: '2',
    })
    initChart(currentAreaInfo.cityId!, statisticData, '2')

    setCurrentAreaInfo({
      areaId: currentAreaInfo.cityId,
      cityId: currentAreaInfo.cityId,
      areaLevel: '2',
    })
  }

  const areaClickEvent = async () => {
    if (currentAreaInfo.areaLevel !== '3') {
      return
    }
    const statisticData = await getStatisticData({
      areaCode: currentAreaInfo.areaId,
      areaType: '3',
    })
    initChart(currentAreaInfo.areaId!, statisticData, '2')

    setCurrentAreaInfo({
      areaId: currentAreaInfo.areaId,
      cityId: currentAreaInfo.cityId,
      areaLevel: '3',
    })
  }

  // 导出配置数据
  const exportHomeStatisticEvent = async () => {
    try {
      setRequestExportLoading(true)
      const res = await exportHomeStatisticData({
        areaCode: currentAreaInfo.areaId!,
        areaType: currentAreaInfo.areaLevel!,
        ganttChartLimit: 100,
      })
      let blob = new Blob([res], {
        type: 'application/vnd.ms-excel;charset=utf-8',
      })
      let finalyFileName = `首页统计图表.xlsx`
      // for IE
      //@ts-ignore
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        //@ts-ignore
        window.navigator.msSaveOrOpenBlob(blob, finalyFileName)
      } else {
        // for Non-IE
        let objectUrl = URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.href = objectUrl
        link.setAttribute('download', finalyFileName)
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(link.href)
      }
      message.success('导出成功')
    } catch (msg) {
      console.error(msg)
    } finally {
      setRequestExportLoading(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (!divRef.current) {
        // 如果切换到其他页面，这里获取不到对象，删除监听。否则会报错
        window.removeEventListener('resize', resize)
        return
      } else {
        resize()
      }
    })

    return () => {
      window.removeEventListener('resize', resize)
    }
  })

  useEffect(() => {
    if (size.width || size.height) {
      const myEvent = new Event('resize')
      window.dispatchEvent(myEvent)
    }
  }, [JSON.stringify(size)])

  useMount(() => {
    firstMapInitChartEvent()
  })

  const handlerOtherClick = () => {
    const id = mapStatisticData.find((item) => item.areaCode.includes('_other'))?.areaCode ?? ''
    setMapSelectCity?.(id)
    history.push('/visualization-results/result-page')
  }

  return (
    <div className={styles.mapChartComponent}>
      <div className={styles.mapChartComponentTipInfo}>
        <div className={styles.mapChartComponentProjectNumber}>
          <ChartBox tltleWidthLevel="big" title="" titleAlign="left">
            <div className={styles.projectNumberWrap}>
              <div className={styles.project1}>
                <div className={styles.number}>
                  <span>当前区域项目数量</span>
                  <span>{projectTotalNumber}个</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    loading={requestExportLoading}
                    onClick={exportHomeStatisticEvent}
                    className={styles.exportButton}
                  >
                    导出统计数据
                  </Button>
                </div>
              </div>

              <div className={styles.project1}>
                <div className={styles.titleNumberFlex}>
                  <div className={styles.titleTips}>包含未选择行政级别区域的项目</div>
                  <div>
                    <div style={{ textAlign: 'right' }}>{ohterProjectTotalNumber}个</div>
                    <div>
                      <span onClick={handlerOtherClick} className={styles.toVisualBtn}>
                        跳转在建网架
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ChartBox>
        </div>
        <div className="flex1"></div>
        <div
          className={`${styles.mapChartComponentProjectAreaTab} ${isConfig ? styles.isConfig : ''}`}
        >
          <span className={`${styles.areaSpan} ${styles.hasChoose}`} onClick={provinceClickEvent}>
            省
          </span>
          <span
            className={`${styles.splineIcon} ${
              currentAreaInfo.areaLevel === '2' || currentAreaInfo.areaLevel === '3'
                ? styles.hasChoose
                : ''
            }`}
          >
            &gt;
          </span>
          <span
            className={`${styles.areaSpan} ${
              currentAreaInfo.areaLevel === '2' || currentAreaInfo.areaLevel === '3'
                ? styles.hasChoose
                : ''
            }`}
            onClick={cityClickEvent}
          >
            市
          </span>
          <span
            className={`${styles.splineIcon} ${
              currentAreaInfo.areaLevel === '3' ? styles.hasChoose : ''
            }`}
          >
            &gt;
          </span>
          <span
            className={`${styles.areaSpan} ${
              currentAreaInfo.areaLevel === '3' ? styles.hasChoose : ''
            }`}
            onClick={areaClickEvent}
          >
            县
          </span>
        </div>
      </div>

      <div className={styles.colorWrapInfo}>
        <div className="flex1"></div>
        <div className={styles.dataSplitMenu}>
          <div className={styles.dataSplitMenuItem}>
            <span className={`${styles.dataSplitMenuItemIcon} ${styles.orange}`}></span>
            <span className={styles.dataSplitMenuItemContent}>1000+</span>
          </div>
          <div className={styles.dataSplitMenuItem}>
            <span className={`${styles.dataSplitMenuItemIcon} ${styles.lightGreen}`}></span>
            <span className={styles.dataSplitMenuItemContent}>100+</span>
          </div>
          <div className={styles.dataSplitMenuItem}>
            <span className={`${styles.dataSplitMenuItemIcon} ${styles.green}`}></span>
            <span className={styles.dataSplitMenuItemContent}>10+</span>
          </div>
          <div className={styles.dataSplitMenuItem}>
            <span className={`${styles.dataSplitMenuItemIcon} ${styles.blue}`}></span>
            <span className={styles.dataSplitMenuItemContent}>1+</span>
          </div>
        </div>
      </div>

      <div className={styles.mapStatisticContent}>
        <div className={styles.mapConent} ref={divRef} />
      </div>
    </div>
  )
}

export default MapChartComponent
