import { getProjectInfo } from '@/services/project-management/all-project'
import { useKeyPress } from 'ahooks'
import { Button, Modal, Tooltip, Popover } from 'antd'
import { CSSProperties, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import Iconfont from './components/iconfont'
import { clearData } from './service/fetcher'
import { HistoryState, INITIAL_DATA_SOURCE, useHistoryGridContext } from './store'

/** 左上方操作 */
const OperationPane: FC = ({ children }) => {
  const [canDraw, setCanDraw] = useState(false)
  const {
    mode,
    UIStatus,
    dispatch,
    geometryType,
    preDesignItemData,
    preDesignDataSource,
  } = useHistoryGridContext()

  const changeMode = useCallback(
    (changedMode: HistoryState['mode']) => {
      dispatch({ type: 'changeMode', payload: changedMode })
    },
    [dispatch]
  )
  useKeyPress('D', () => {
    if (mode === 'recordEdit' && geometryType !== 'Point') {
      dispatch({ type: 'changeGeometryType', payload: 'Point' })
    } else {
      dispatch({ type: 'changeGeometryType', payload: '' })
    }
  })
  useKeyPress('x', () => {
    if (mode === 'recordEdit' && geometryType !== 'LIneString') {
      dispatch({ type: 'changeGeometryType', payload: 'LIneString' })
    } else {
      dispatch({ type: 'changeGeometryType', payload: '' })
    }
  })
  useKeyPress('esc', () => {
    if (mode === 'recordEdit' && geometryType !== '') {
      dispatch({ type: 'changeGeometryType', payload: '' })
    }
  })
  useEffect(() => {
    if (mode === 'preDesign' || mode === 'preDesigning') {
      if (preDesignItemData) {
        getProjectInfo(preDesignItemData.id).then((res) => {
          if (res.identitys.some((s: any) => s.value! === 4)) {
            setCanDraw(true)
          } else {
            setCanDraw(false)
          }
        })
      }
    } else {
      setCanDraw(true)
    }
    if (mode === 'recordEdit') {
      dispatch({ type: 'changeGeometryType', payload: '' })
    }
  }, [mode, preDesignItemData, setCanDraw])

  /** 是否处于绘制状态 */
  const drawing = mode === 'preDesigning' || mode === 'recordEdit'

  const changeModeBtnText = mode === 'preDesign' ? '规划' : mode === 'record' ? '绘制' : ''

  const clearAllData = async () => {
    await clearData(preDesignDataSource.id!)
    dispatch({
      type: 'changePreDesignDataSource',
      payload: { ...INITIAL_DATA_SOURCE, id: preDesignDataSource.id },
    })
    dispatch({
      type: 'changeSelectedData',
      payload: [],
    })
  }
  const drawingBtnList = useMemo(() => {
    const list: OperateBtnProps[] = [
      // {
      //   text: '保存',
      //   icon: 'icon-baocun',
      //   onClick: () => {
      //     dispatch({
      //       type: 'changeUIStatus',
      //       payload: { ...UIStatus, recordVersion: 'save' },
      //     })
      //   },
      // },
      {
        text: '记录版本',
        icon: 'icon-jilubanben',
        visible: (mode: HistoryState['mode']) => mode === 'recordEdit',
        onClick: () => {
          dispatch({
            type: 'changeUIStatus',
            payload: { ...UIStatus, recordVersion: 'record' },
          })
        },
      },
      {
        text: '导入',
        icon: 'icon-daoru',
        before: mode === 'recordEdit' ? <span>|</span> : null,
        onClick: () => {
          dispatch({ type: 'changeUIStatus', payload: { ...UIStatus, importModalVisible: true } })
        },
      },
      {
        before: <span>|</span>,
        hoverText: '快捷键: D',
        text: '电气设备',
        icon: 'icon-dianqishebei',
        value: 'Point',
        onClick: () => {
          if (geometryType !== 'Point') {
            dispatch({ type: 'changeGeometryType', payload: 'Point' })
          } else {
            dispatch({ type: 'changeGeometryType', payload: '' })
          }
        },
      },
      {
        text: '线路',
        type: 'route',
        hoverText: '快捷键: X',
        value: 'LIneString',
        icon: 'icon-xianlu',
        onClick: () => {
          if (geometryType !== 'LIneString') {
            dispatch({ type: 'changeGeometryType', payload: 'LIneString' })
          } else {
            dispatch({ type: 'changeGeometryType', payload: '' })
          }
        },
      },
      {
        text: '清屏',
        icon: 'icon-qingping',
        before: <span>|</span>,
        visible: (mode: HistoryState['mode']) => mode === 'preDesigning',
        onClick: () => {
          Modal.confirm({
            title: '提示',
            okText: '确认',
            cancelText: '取消',
            content: '此操作会清除当前项目所有规划数据,确认清屏？',
            onOk: () => clearAllData(),
          })
        },
      },
    ]

    return list.filter(({ visible }) => !visible || visible(mode))
  }, [UIStatus, dispatch, mode, geometryType])

  const buttonClickEvent = () => {
    changeMode(mode === 'preDesign' ? 'preDesigning' : 'recordEdit')
    dispatch({ type: 'changeUIStatus', payload: { ...UIStatus, drawing: true } })
  }

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center space-x-4">
      {drawing && (
        <OperateBtn
          icon="icon-fanhui"
          onClick={() => {
            dispatch({
              type: 'changeUIStatus',
              payload: { ...UIStatus, drawing: false },
            })
            changeMode(mode === 'recordEdit' ? 'record' : 'preDesign')
            dispatch({ type: 'changeGeometryType', payload: '' })
          }}
          type="back"
        />
      )}

      {children}

      {!drawing && (
        <>
          {!canDraw && (
            <Tooltip title="当前项目身份非 [执行]，不可执行该操作">
              <Button type="primary" disabled={!canDraw} onClick={() => buttonClickEvent()}>
                网架{changeModeBtnText}
              </Button>
            </Tooltip>
          )}
          {canDraw && (
            <Button type="primary" disabled={!canDraw} onClick={() => buttonClickEvent()}>
              网架{changeModeBtnText}
            </Button>
          )}
        </>
      )}

      {drawing && (
        <>
          {drawingBtnList.map((props) => (
            <OperateBtn {...props} key={props.text} geometryType={geometryType} />
          ))}
        </>
      )}
    </div>
  )
}

interface OperateBtnProps {
  text?: string
  icon: string
  before?: ReactNode
  after?: ReactNode
  onClick: () => void
  [key: string]: any
}

const OperateBtn = ({
  text,
  icon,
  onClick,
  before,
  after,
  hoverText,
  value,
  geometryType,
}: OperateBtnProps) => {
  const iconStyle = { verticalAlign: '-0.25rem', marginRight: '2px' } as CSSProperties
  const iconClass = 'w-5 h-5'
  return (
    <>
      {before}
      {hoverText ? (
        <Popover placement="bottom" content={hoverText} trigger={'hover'}>
          <div className="cursor-pointer" onClick={onClick}>
            <Iconfont
              style={{
                ...iconStyle,
                color: geometryType === value ? '#0E7B3B' : '#1F1F1F',
                fontWeight: geometryType === value ? 600 : 400,
              }}
              className={iconClass}
              symbol={icon}
            />
            {text && (
              <span
                style={{
                  color: geometryType === value ? '#0E7B3B' : '#1F1F1F',
                  fontWeight: geometryType === value ? 600 : 400,
                  userSelect: 'none',
                }}
              >
                {text}
              </span>
            )}
          </div>
        </Popover>
      ) : (
        <div className="cursor-pointer" onClick={onClick}>
          <Iconfont style={iconStyle} className={iconClass} symbol={icon} />
          {text && (
            <span
              style={{
                userSelect: 'none',
              }}
            >
              {text}
            </span>
          )}
        </div>
      )}
      {after}
    </>
  )
}

export default OperationPane
