import { getProjectInfo } from '@/services/project-management/all-project'
import { Button, message } from 'antd'
import { CSSProperties, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import Iconfont from './components/iconfont'
import { HistoryState, INITIAL_DATA_SOURCE, useHistoryGridContext } from './store'

/** 左上方操作 */
const OperationPane: FC = ({ children }) => {
  const [canDraw, setCanDraw] = useState(false)
  const { mode, UIStatus, dispatch, preDesignItemData } = useHistoryGridContext()

  const changeMode = useCallback(
    (changedMode: HistoryState['mode']) => {
      dispatch({ type: 'changeMode', payload: changedMode })
    },
    [dispatch]
  )

  useEffect(() => {
    if (mode === 'preDesign' || mode === 'preDesigning') {
      if (preDesignItemData) {
        getProjectInfo(preDesignItemData.id).then((res) => {
          if (res.identitys.some((s: any) => s.value! === 4)) {
            setCanDraw(true)
          }
        })
      }
    } else {
      setCanDraw(true)
    }
  }, [mode, preDesignItemData, setCanDraw])

  /** 是否处于绘制状态 */
  const drawing = mode === 'preDesigning' || mode === 'recordEdit'

  const changeModeBtnText = mode === 'preDesign' ? '预设' : mode === 'record' ? '绘制' : ''

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
        before: <span>|</span>,
        after: <span>|</span>,
        onClick: () => {
          dispatch({ type: 'changeUIStatus', payload: { ...UIStatus, importModalVisible: true } })
        },
      },
      // {
      //   text: '电气设备',
      //   icon: 'icon-dianqishebei',
      //   onClick: () => {},
      // },
      // {
      //   text: '线路',
      //   type: 'route',
      //   icon: 'icon-xianlu',
      //   onClick: () => {},
      // },
      {
        text: '清屏',
        icon: 'icon-qingping',
        visible: (mode: HistoryState['mode']) => mode === 'preDesigning',
        onClick: () => {
          dispatch({ type: 'changePreDesignDataSource', payload: INITIAL_DATA_SOURCE })
          dispatch({ type: 'changeHistoryDataSource', payload: INITIAL_DATA_SOURCE })
        },
      },
    ]

    return list.filter(({ visible }) => !visible || visible(mode))
  }, [UIStatus, dispatch, mode])

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center space-x-4">
      {drawing && (
        <OperateBtn
          icon="icon-fanhui"
          onClick={() => {
            dispatch({
              type: 'changeUIStatus',
              payload: { ...UIStatus, recordVersion: 'save', drawing: false },
            })
            changeMode(mode === 'recordEdit' ? 'record' : 'preDesign')
          }}
          type="back"
        />
      )}

      {children}

      {!drawing && (
        <Button
          type="primary"
          disabled={!canDraw}
          onClick={() => {
            if (canDraw) {
              changeMode(mode === 'preDesign' ? 'preDesigning' : 'recordEdit')
              dispatch({ type: 'changeUIStatus', payload: { ...UIStatus, drawing: true } })
            } else {
              message.error('当前项目身份非 [执行]，不可执行该操作')
            }
          }}
        >
          网架{changeModeBtnText}
        </Button>
      )}

      {drawing && (
        <>
          {drawingBtnList.map((props) => (
            <OperateBtn {...props} key={props.text} />
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

const OperateBtn = ({ text, icon, onClick, before, after }: OperateBtnProps) => {
  const iconStyle = { verticalAlign: '-0.25rem', marginRight: '2px' } as CSSProperties
  const iconClass = 'w-5 h-5'

  return (
    <>
      {before}
      <div className="cursor-pointer" onClick={onClick}>
        <Iconfont style={iconStyle} className={iconClass} symbol={icon} />
        {text && <span>{text}</span>}
      </div>
      {after}
    </>
  )
}

export default OperationPane
