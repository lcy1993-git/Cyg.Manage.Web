import { useMount, useUnmount } from 'ahooks'
import { Popconfirm } from 'antd'
import React, { useRef } from 'react'

interface AdsorptionProps {
  visible: boolean
  needAdsorption: (flag: boolean) => void
  position: {
    x: number
    y: number
  }
}

const Adsorption: React.FC<AdsorptionProps> = ({
  visible,
  position = { x: 100, y: 100 },
  needAdsorption,
}) => {
  const ref = useRef<HTMLDivElement>(null)

  // 判断是否因为点击按钮关闭的对话框
  const hasButtonClicked = useRef(false)

  const needAdsorptionClick = (flag: boolean) => {
    needAdsorption(flag)
    hasButtonClicked.current = true
  }

  useMount(() => {
    ref.current?.click()
  })

  useUnmount(() => {
    if (!hasButtonClicked.current) {
      needAdsorption(false)
    }
  })

  return true ? (
    <Popconfirm
      title="是否关联该线段&emsp;"
      onConfirm={() => needAdsorptionClick(true)}
      onCancel={() => needAdsorption(false)}
      okText="&emsp;是&emsp;"
      cancelText="&emsp;否&emsp;"
    >
      <div
        ref={ref}
        className="absolute w-0 h-0"
        style={{ left: position.x, top: position.y }}
      ></div>
    </Popconfirm>
  ) : null
}

export default Adsorption
