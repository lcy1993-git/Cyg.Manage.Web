import { Button } from 'antd'
import { CSSProperties, FC, ReactNode, useCallback, useMemo } from 'react'
import Iconfont from './components/iconfont'
import { HistoryState, useHistoryGridContext } from './store'

/** 左上方操作 */
const OperationPane: FC = ({ children }) => {
  const { mode, dispatch } = useHistoryGridContext()

  const changeMode = useCallback(
    (changedMode: HistoryState['mode']) => {
      dispatch({ type: 'changeMode', payload: changedMode })
    },
    [dispatch]
  )

  /** 是否处于绘制状态 */
  const drawing = mode === 'preDesigning' || mode === 'recordEdit'

  const changeModeBtnText = mode === 'preDesign' ? '预设' : mode === 'record' ? '绘制' : ''

  const drawingBtnList = useMemo(() => {
    const list: OperateBtnProps[] = [
      {
        text: '保存',
        icon: 'icon-baocun',
        onClick: () => {},
      },
      {
        text: '记录版本',
        icon: 'icon-jilubanben',
        visible: (mode: HistoryState['mode']) => mode === 'recordEdit',
        onClick: () => {},
      },
      {
        text: '导入',
        icon: 'icon-daoru',
        before: <span>|</span>,
        after: <span>|</span>,
        onClick: () => {},
      },
      {
        text: '电气设备',
        icon: 'icon-dianqishebei',
        onClick: () => {},
      },
      {
        text: '线路',
        type: 'route',
        icon: 'icon-xianlu',
        onClick: () => {},
      },
      {
        text: '清屏',
        icon: 'icon-qingping',
        visible: (mode: HistoryState['mode']) => mode === 'preDesigning',
        onClick: () => {},
      },
    ]

    return list.filter(({ visible }) => !visible || visible(mode))
  }, [mode])

  return (
    <div className="bg-white px-4 py-2 flex justify-between items-center space-x-4">
      {drawing && (
        <OperateBtn
          icon="icon-fanhui"
          onClick={() => {
            changeMode(mode === 'recordEdit' ? 'record' : 'preDesign')
          }}
          type="back"
        />
      )}

      {children}

      {!drawing && (
        <Button
          type="primary"
          onClick={() => changeMode(mode === 'preDesign' ? 'preDesigning' : 'recordEdit')}
        >
          网架{changeModeBtnText}
        </Button>
      )}

      {drawing && (
        <>
          {drawingBtnList.map((props) => (
            <OperateBtn {...props} key={props.type} />
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
