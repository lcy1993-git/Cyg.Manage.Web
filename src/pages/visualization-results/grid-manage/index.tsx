import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useState } from 'react'
import ChangMapUrl from './ChangeMapUrl'
import { MyContextType, MyWorkProvider } from './Context'
import DrawToolbar from './DrawToolbar'
import ExcelImportData from './ExcelImportData'
import Footer from './Footer'
import GridMap from './GridMap'
import { MapRef, useCurrentRef } from './hooks'
import styles from './index.less'
import LeftMenu from './LeftMenu'
const LEFTMENUWIDTH = 260

const GradManage: React.FC = () => {
  /** 网架绘制 手动绘制工具栏状态 **/
  const [drawToolbarVisible, setdrawToolbarVisible] = useState<boolean>(true)
  /** 网架绘制 Excel数据导入模态框状态 **/
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false)
  /** 当前选择的城市 **/
  const [selectCity, setselectCity] = useState<MyContextType['selectCity']>(
    {} as MyContextType['selectCity']
  )
  // 地图实例
  const mapRef = useCurrentRef<MapRef>({ map: {} })

  return (
    <MyWorkProvider
      value={{
        drawToolbarVisible,
        setdrawToolbarVisible,
        selectCity,
        setselectCity,
        importModalVisible,
        setImportModalVisible,
        mapRef,
      }}
    >
      <GradManageWrap />
    </MyWorkProvider>
  )
}

const GradManageWrap: React.FC = () => {
  // 左侧菜单 显示、隐藏
  const [leftMenuVisible, setLeftMenuVisible] = useState<boolean>(true)

  return (
    <div className="h-full w-full gridManageWrap">
      {/* 内容区 */}
      <div
        className="w-full relative overflow-hidden"
        style={{ height: 'calc(100% - 40px)', padding: '0px 10px 0 10px' }}
      >
        {/* 左侧菜单 */}
        <div
          className="absolute h-full z-10"
          style={{
            width: `${LEFTMENUWIDTH}px`,
            transition: 'all 0.5s',
            transform: leftMenuVisible ? `translateX(0px)` : `translateX(-${LEFTMENUWIDTH + 10}px)`,
          }}
        >
          <LeftMenu />
        </div>
        {/* 控制左侧菜单是否显示按钮 */}
        <div
          className={`${styles.controlLeftMenuStyle}`}
          style={{
            left: leftMenuVisible ? `${LEFTMENUWIDTH + 10}px` : 10,
          }}
          onClick={() => {
            setLeftMenuVisible(!leftMenuVisible)
          }}
        >
          {leftMenuVisible ? (
            <LeftOutlined style={{ fontSize: 10 }} />
          ) : (
            <RightOutlined style={{ fontSize: 10 }} />
          )}
        </div>
        <div className="w-full h-full relative">
          {/* 地图组件 */}
          <GridMap />
          {/* 工具栏 */}
          <DrawToolbar />

          <ChangMapUrl />
          <ExcelImportData />
        </div>
      </div>
      {/* 底部 */}
      <Footer />
    </div>
  )
}

export default GradManage
