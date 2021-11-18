import React, { useState, useRef, useEffect } from 'react'
import styles from './index.less'
import { WidthProvider, Responsive } from 'react-grid-layout'
import bgSrc from '@/assets/image/index/bg.png'
import { useRequest, useSize } from 'ahooks'
import { getChartConfig } from '@/services/operation-config/cockpit'

import MapComponent from '@/pages/index/components/index-map-component'
import PersonnelLoad from '@/pages/index/components/index-personnel-load-component'
import ToDo from '@/pages/index/components/index-to-do-component'
import DeliveryManage from '@/pages/index/components/index-delivery-manage-component'
import ProjectSituation from '@/pages/index/components/index-project-situation-component'
import ProjectType from '@/pages/index/components/index-project-type-component'
import ProjectProgress from '@/pages/index/components/index-project-progress-component'
import ProjectNumber from './components/project-number-component'

import { IndexContext } from './context'
import { notification, Spin } from 'antd'
import { divide, multiply, subtract } from 'lodash'
import uuid from 'node-uuid'
import PageCommonWrap from '@/components/page-common-wrap'
import ProjectRefreshListWrapper from './components/refresh-list-wrapper/idnex'

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import HealthPolling from './components/health-polling'
import { getEnums } from '@/pages/technology-economic/utils'
import { getStopServerNotice } from '@/services/index'
import { history } from '@@/core/history'
import { message } from 'antd/es'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

const getComponentByType = (type: string, componentProps: any) => {
  switch (type) {
    case 'toDo':
      return <ToDo componentProps={componentProps} />
      break
    case 'mapComponent':
      return <MapComponent componentProps={componentProps} />
      break
    case 'deliveryManage':
      return <DeliveryManage componentProps={componentProps} />
      break
    case 'personLoad':
      return <PersonnelLoad componentProps={componentProps} />
      break
    case 'projectSchedule':
      return <ProjectSituation componentProps={componentProps} />
      break
    case 'projectType':
      return <ProjectType componentProps={componentProps} />
      break
    case 'projectProgress':
      return <ProjectProgress />
      break
    case 'projectRefreshData':
      return <ProjectRefreshListWrapper componentProps={componentProps} />
      break
    case 'projectNumber':
      return <ProjectNumber componentProps={componentProps} />
      break
    default:
      return undefined
  }
}

const Index: React.FC = () => {
  const [currentAreaInfo, setCurrentAreaInfo] = useState({
    areaId: '',
    areaLevel: '1',
  })

  const [configArray, setConfigArray] = useState<any[]>([])
  const [reloadLoading, setReloadLoading] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)
  const { height } = useSize(divRef)

  const { data, loading } = useRequest(() => getChartConfig(), {
    onSuccess: () => {
      initPage()
    },
  })
  useRequest(
    () =>
      getStopServerNotice({
        serverCode: localStorage.getItem('serverCode') as string,
        kickOutSeconds: 60,
      }),
    {
      pollingInterval: 5000,
      onSuccess: (val) => {
        if (val) {
          sessionStorage.setItem('stopServerInfo', JSON.stringify(val))
          let is600 = val?.countdownSeconds <= 602 && val.countdownSeconds >= 598
          let is300 = val?.countdownSeconds <= 302 && val.countdownSeconds >= 298
          let is60 = val?.countdownSeconds <= 62 && val.countdownSeconds >= 58
          if (is60 || is300 || is600) {
            notification.open({
              message: '停服通知',
              description: `您好！工程智慧云平台将在${is600 ? '10' : ''}${is300 ? '5' : ''}${
                is60 ? '1' : ''
              }分钟后进行停机维护，
          维护期间将无法使用平台，
          给您带来的不变我们深表歉意，
          维护结束后我们将在第一时间告知大家；`,
              bottom: 40,
              placement: 'bottomRight',
              duration: null,
              onClick: () => {
                console.log('Notification Clicked!')
              },
            })
          }
          if (val.stage === 3) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || '')
            if (!userInfo?.isTestUser) {
              // 测试人员账号
              message.warning('正在停服发版中,请稍等...')
              setTimeout(() => {
                // 非测试账号直接退出登录
                history.push('/login')
                localStorage.setItem('Authorization', '')
              })
            }
          }
        }
      },
    }
  )
  const initPage = () => {
    const windowHeight = window.innerHeight - 115 > 828 ? window.innerHeight - 115 : 828
    if (data) {
      const hasSaveConfig = JSON.parse(data)
      if (hasSaveConfig.config && hasSaveConfig.config.length > 0) {
        const windowPercent = divide(windowHeight, hasSaveConfig.configWindowHeight)
        const thisConfigArray = hasSaveConfig.config.map((item: any) => {
          const actualHeight = windowPercent
            ? Math.floor(multiply(item.h, windowPercent) * 100) / 100
            : item.h
          const actualY = windowPercent ? multiply(item.y, windowPercent) : item.y
          return {
            ...item,
            y: actualY,
            h: actualHeight,
          }
        })
        setConfigArray(thisConfigArray)
      }
    } else {
      const thisBoxHeight = windowHeight - 75
      const totalHeight = divide(thisBoxHeight, 18)
      setConfigArray([
        { name: 'toDo', x: 0, y: 0, w: 3, h: 11, key: uuid.v1() },
        {
          name: 'mapComponent',
          x: 3,
          y: 0,
          w: 6,
          h: subtract(totalHeight, divide(totalHeight - 11, 2)),
          key: uuid.v1(),
        },
        { name: 'projectType', x: 9, y: 0, w: 3, h: 11, key: uuid.v1() },
        {
          name: 'projectRefreshData',
          x: 0,
          y: 11,
          w: 3,
          h: divide(totalHeight - 11, 2),
          key: uuid.v1(),
        },
        { name: 'personLoad', x: 9, y: 11, w: 3, h: divide(totalHeight - 11, 2), key: uuid.v1() },
        {
          name: 'deliveryManage',
          x: 0,
          y: divide(totalHeight - 11, 2) + 11,
          w: 6,
          h: divide(totalHeight - 11, 2),
          key: uuid.v1(),
        },
        {
          name: 'projectProgress',
          x: 6,
          y: divide(totalHeight - 11, 2) + 11,
          w: 6,
          h: divide(totalHeight - 11, 2),
          key: uuid.v1(),
        },
      ])
    }
  }

  const configComponentElement = configArray?.map((item: any) => {
    return (
      <div key={item.key} data-grid={{ x: item.x, y: item.y, w: item.w, h: item.h, static: true }}>
        {getComponentByType(item.name, item.componentProps)}
      </div>
    )
  })

  useEffect(() => {
    setReloadLoading(true)
    initPage()
    setTimeout(() => {
      setReloadLoading(false)
    }, 0)
  }, [height])
  // useMount(()=>{
  //   getEnums('EngineeringTemplateType')
  // })
  return (
    <PageCommonWrap noPadding={true} className={styles.indexWrap}>
      <IndexContext.Provider
        value={{
          currentAreaInfo,
          setCurrentAreaInfo,
        }}
      >
        <div className={styles.indexPage} style={{ backgroundImage: `url(${bgSrc})` }} ref={divRef}>
          {!loading && !reloadLoading && (
            <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
              <ResponsiveReactGridLayout
                style={{ position: 'relative' }}
                breakpoints={{ lg: 120 }}
                cols={{ lg: 12 }}
                rowHeight={9}
              >
                {configComponentElement}
              </ResponsiveReactGridLayout>
            </div>
          )}
        </div>
        {loading && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Spin spinning={loading} tip="正在载入中..."></Spin>
          </div>
        )}
        {!loading && reloadLoading && (
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <Spin spinning={loading} tip="正在重绘中..."></Spin>
          </div>
        )}
        <div style={{ display: 'none' }}>
          <HealthPolling />
        </div>
      </IndexContext.Provider>
    </PageCommonWrap>
  )
}

export default Index
