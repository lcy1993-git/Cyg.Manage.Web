import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { useState } from 'react'
import ChangMapUrl from './ChangeMapUrl'
import { MyContextType, MyWorkProvider, useMyContext } from './Context'
import DrawToolbar from './DrawToolbar'
import Footer from './Footer'
import GridMap from './GridMap'
import styles from './index.less'
import LeftMenu from './LeftMenu'
const LEFTMENUWIDTH = 260

const GradManageWrap: React.FC = () => {
  // 左侧菜单 显示、隐藏
  const [leftMenuVisible, setLeftMenuVisible] = useState<boolean>(true)
  const { drawToolbarVisible } = useMyContext()

  return (
    <div className="h-full w-full">
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
        <div className="w-full h-full">
          {/* 地图组件 */}
          <GridMap />
          {/* 工具栏 */}
          <DrawToolbar
            style={{
              width: leftMenuVisible
                ? `calc(100% - ${LEFTMENUWIDTH + 40}px)`
                : `calc(100% - ${40}px)`,
              transition: 'all 0.5s',
              display: drawToolbarVisible ? 'block' : 'none',
            }}
          />
          <ChangMapUrl />
        </div>
      </div>
      {/* 底部 */}

      <Footer />
    </div>
  )
}

const GradManage: React.FC = () => {
  const [drawToolbarVisible, setdrawToolbarVisible] = useState<boolean>(false)
  const [selectCity, setselectCity] = useState<MyContextType['selectCity']>(
    {} as MyContextType['selectCity']
  )
  return (
    <MyWorkProvider
      value={{
        drawToolbarVisible,
        setdrawToolbarVisible,
        selectCity,
        setselectCity,
      }}
    >
      <GradManageWrap />
    </MyWorkProvider>
  )
}

export default GradManage
