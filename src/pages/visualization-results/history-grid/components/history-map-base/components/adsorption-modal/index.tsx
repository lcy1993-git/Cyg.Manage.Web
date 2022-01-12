import { useMount } from 'ahooks'
import { Popconfirm } from 'antd'
import React, { useRef } from 'react'

interface AdsorptionProps {
  needAdsorption: (flag: boolean) => void
  position: number[]
}

const Adsorption: React.FC<AdsorptionProps> = ({ position, needAdsorption }) => {
  const ref = useRef<HTMLDivElement>(null)
  useMount(() => ref.current!.click())
  // 判断弹框关闭时，是否点击了是按钮
  const onModalCloseState = useRef(false)
  const onVisibleChange = (visible: boolean) =>
    visible || setTimeout(() => needAdsorption(onModalCloseState.current), 0)
  return (
    <Popconfirm
      title="是否关联该线段？&emsp;"
      onConfirm={() => (onModalCloseState.current = true)}
      onCancel={() => (onModalCloseState.current = false)}
      okText="&emsp;是&emsp;"
      cancelText="&emsp;否&emsp;"
      onVisibleChange={onVisibleChange}
    >
      <div
        ref={ref}
        className="absolute w-0 h-0"
        style={{ left: position[0], top: position[1] }}
      ></div>
    </Popconfirm>
  )
}

export default Adsorption
