import { CloseOutlined } from '@ant-design/icons'
import { FC, useEffect, useState } from 'react'

interface FlowLayerProps {
  left: number
  top: number
  showClose?: boolean
  className?: string
  title?: string
  visible?: boolean
  onClose?: () => void
}

const FlowLayer: FC<FlowLayerProps> = ({
  children,
  visible = true,
  title,
  className,
  showClose,
  onClose,
  ...style
}) => {
  const [_visible, setVisible] = useState(visible)

  useEffect(() => {
    setVisible(visible)
  }, [visible])

  return (
    <div
      style={{ ...style, visibility: _visible ? 'visible' : 'hidden' }}
      className={`absolute bg-white ${className || ''}`}
    >
      {title && (
        <div className="p-2 border-0 border-b border-gray-300 border-solid flex items-center justify-between">
          <div className="text-base">{title}</div>
          {showClose && (
            <CloseOutlined
              className="text-gray-500 cursor-pointer"
              onClick={() => (typeof onClose === 'function' ? onClose() : setVisible((v) => !v))}
            />
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default FlowLayer
