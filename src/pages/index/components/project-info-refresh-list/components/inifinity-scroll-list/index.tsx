import React, { FC, useEffect, useRef } from 'react'
export interface InifinityScrollListProps {
  height: number
  isScroll?: boolean
}

const InifinityScrollList: FC<InifinityScrollListProps> = ({
  children,
  height,
  isScroll = false,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const style =
      '\
      @keyframes mymove {\
        0% {\
            -webkit-transform: translate3d(0, 0, 0);\
            transform: translate3d(0, 0, 0);\
        }\
        100% {\
            -webkit-transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
            transform: translate3d(0, A_DYNAMIC_VALUE, 0);\
        }\
      }\
  '
    const tt = document.styleSheets[0]
    if (height) {
      tt.insertRule(style.replace(/A_DYNAMIC_VALUE/g, `${height}`))
    }

    if (ref.current) {
      ref.current.style.animation = 'mymove 25s infinite linear'
    }
  }, [height])

  if (isScroll) {
    return <div ref={ref}>{children}</div>
  } else {
    return <div>{children}</div>
  }
}

export default InifinityScrollList
