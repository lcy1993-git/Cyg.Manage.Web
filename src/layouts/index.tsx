import { getTabsComponent, RouteListItem } from '@/utils/tabs-config'
import { BackwardOutlined, DownOutlined, ForwardOutlined, UpOutlined } from '@ant-design/icons'
import { ConfigProvider, Tabs } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN'
import moment from 'moment'
import 'moment/locale/zh-cn'
import React, { useEffect, useState } from 'react'
import { IRouteComponentProps } from 'umi'
import LayoutHeader from './components/layout-header'
import { LayoutProvider } from './context'
import styles from './index.less'

moment.locale('zh-cn')

const { TabPane } = Tabs

interface ElementDiv extends Element {
  style?: {
    transform?: string
  }
  offsetWidth?: number
}

// export const routeListVal = createContext();

const Layout: React.FC<IRouteComponentProps> = ({ children, location, route, history, match }) => {
  const [activeKey, setActiveKey] = useState<string>('/index')

  // const [allProjectSearchProjectId, setAllProjectSearchProjectId] = useState('')
  const [mapSelectCity, setMapSelectCity] = useState('')
  const [resourceManageFlag, setResourceManageFlag] = useState<boolean>(false)
  const [lineStressSagFlag, setLineStressSagFlag] = useState<boolean>(false)
  const [workHandoverFlag, setWorkHandoverFlag] = useState<boolean>(false)
  const [ref, setRef] = useState<any>()
  const [pointData, setPointData] = useState<any>()
  const [allProjectSearchParams, setAllProjectSearchParams] = useState({
    areaLevel: '-1',
    areaId: '',
    cityId: '',
    searchPerson: '',
    searchType: '',
  })

  const [routeList, setRouteList] = useState<RouteListItem[]>([
    {
      title: '首页',
      tabKey: '/index',
    },
  ])
  const [layoutIsFold, setLayoutIsFold] = useState(false)

  // 预设计项目 id
  const [preDesignItem, setPreDesignItem] = useState('')

  useEffect(() => {
    const historyRoutes: RouteListItem[] = JSON.parse(JSON.stringify(routeList))

    const routeIndex = historyRoutes.findIndex(
      (item) => item.tabKey === location.pathname + '' + location.search
    )
    if (routeIndex > -1) {
      setActiveKey(historyRoutes[routeIndex].tabKey!)
    } else {
      historyRoutes.push({
        ...location,
        tabKey: `${location.pathname}${location.search}`,
        title: location.pathname,
      })
      setRouteList(historyRoutes)
      setActiveKey(`${location.pathname}${location.search}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(location)])

  const routeShowElement = routeList.map((item) => {
    const tabsInfo = getTabsComponent(item.tabKey!)

    // 如果tabKey 是index,那么就不能进行关闭
    const isIndex = item.tabKey === '/index'

    return (
      <TabPane key={item.tabKey} closable={!isIndex} tab={<span>{tabsInfo.title}</span>}>
        {tabsInfo.component}
      </TabPane>
    )
  })

  const tabChangeEvent = (key: string) => {
    setActiveKey(key)
    history.push(key)
  }

  const flodTheLayout = () => {
    setLayoutIsFold(!layoutIsFold)
  }

  const editTabsEvent = (
    key: string | React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
    action: 'add' | 'remove'
  ) => {
    const copyRouteList = routeList.map((item) => item)
    const keyIndex = copyRouteList.findIndex((item) => item.tabKey === key)
    if (keyIndex !== -1 && copyRouteList[keyIndex].title.indexOf('resource-manage') !== -1) {
      setResourceManageFlag(false)
    }
    if (keyIndex !== -1 && copyRouteList[keyIndex].title.indexOf('line-stress-sag-manage') !== -1) {
      setLineStressSagFlag(false)
    }
    // 判断他当前删除的是不是当前激活的tab,如果是，则需要激活这个tab的相邻的tab,如果不是，就直接删除
    let needActiveIndex = 0
    if (activeKey === key) {
      if (copyRouteList.length > 1 && keyIndex === copyRouteList.length - 1) {
        needActiveIndex = keyIndex - 1
        setActiveKey(copyRouteList[needActiveIndex].tabKey!)
      } else if (copyRouteList.length > 1 && keyIndex === 0) {
        needActiveIndex = keyIndex + 1
        setActiveKey(copyRouteList[needActiveIndex].tabKey!)
      }
      history.push(copyRouteList[needActiveIndex].tabKey!)
    }

    if (keyIndex > -1) {
      copyRouteList.splice(keyIndex, 1)
    }
    setRouteList(copyRouteList)
  }

  const tabsTranslateLeft = () => {
    const tabContent: ElementDiv = document
      .getElementById('layoutTabs')
      ?.querySelector('.ant-tabs-nav-list')!
    if (tabContent) {
      tabContent.style!.transform = 'translate(0px, 0px)'
    }
  }

  const tabsTranslateRight = () => {
    const tabContent: ElementDiv = document
      .getElementById('layoutTabs')
      ?.querySelector('.ant-tabs-nav-list')!
    const singleTabpane: HTMLCollectionOf<ElementDiv> = document
      .getElementById('layoutTabs')
      ?.getElementsByClassName('ant-tabs-tab')!

    let widthTotal = 0
    for (let i = 0; i < singleTabpane.length; i++) {
      widthTotal += singleTabpane[i].offsetWidth ?? 0
    }

    const tabNavWrap: ElementDiv = document
      .getElementById('layoutTabs')
      ?.querySelector('.ant-tabs-nav-wrap')!
    const tabNavWrapWidth = tabNavWrap.offsetWidth ?? 0

    if (tabContent) {
      if (tabNavWrapWidth - widthTotal < 0) {
        tabContent.style!.transform = `translate(${tabNavWrapWidth - widthTotal}px, 0px)`
      }
    }
  }

  const clearAgainLogin = () => {
    editTabsEvent('/again-login', 'remove')
  }

  const OperationsSlot = {
    left: (
      <div className={styles.tabsLeftContent}>
        <BackwardOutlined onClick={() => tabsTranslateLeft()} />
      </div>
    ),
    right: (
      <div className={styles.tabsRightContent}>
        <div className={styles.layoutFoldIcon}>
          {layoutIsFold ? (
            <DownOutlined onClick={() => flodTheLayout()} />
          ) : (
            <UpOutlined onClick={() => flodTheLayout()} />
          )}
        </div>
        <div className={styles.tabsRightClickButton}>
          <ForwardOutlined onClick={() => tabsTranslateRight()} />
        </div>
      </div>
    ),
  }

  const removeTab = (route: string) => {
    editTabsEvent(route, 'remove')
  }

  //获取token
  const token = localStorage.getItem('Authorization')
  const url =
    window.location.hostname === 'localhost' ? 'srthkf2.gczhyun.com:21530' : window.location.host
  /**webSocket */
  let heart: any
  // let ws = new WebSocket(`wss://${window.location.host}/usercenter-ws/?accessToken=${token}`)
  useEffect(() => {
    if (window.WebSocket) {
      let ws = new WebSocket(`wss://${url}/usercenter-ws/?accessToken=${token}`)
      ws.onopen = () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        heart = setInterval(() => {
          ws.send('PING')
        }, 6000)
      }
      ws.onclose = () => {
        clearInterval(heart)
      }
      ws.onmessage = () => {}
      ws.onerror = () => {}

      return () => {
        // window.addEventListener('beforeunload', () => {
        //   ws.close()
        // })
        ws.close()
      }
    }
    return
  }, [])

  return (
    <ConfigProvider locale={zhCN}>
      <LayoutProvider
        value={{
          clearAgainLogin,
          allProjectSearchParams,
          mapSelectCity,
          setAllProjectSearchParams,
          setMapSelectCity,
          resourceManageFlag,
          setResourceManageFlag,
          lineStressSagFlag,
          setLineStressSagFlag,
          workHandoverFlag,
          setWorkHandoverFlag,
          removeTab,
          preDesignItem,
          setPreDesignItem,
          ref,
          setRef,
          setPointData,
          pointData,
        }}
      >
        <div className={styles.layoutContent}>
          <div className={layoutIsFold ? 'hide' : ''}>
            <LayoutHeader />
          </div>
          <div className={styles.tabsContent} id="layoutTabs">
            <Tabs
              hideAdd
              tabBarGutter={0}
              tabBarExtraContent={OperationsSlot}
              onEdit={editTabsEvent}
              type="editable-card"
              onChange={tabChangeEvent}
              activeKey={activeKey}
            >
              {routeShowElement}
            </Tabs>
          </div>
        </div>
      </LayoutProvider>
    </ConfigProvider>
  )
}

export default Layout
