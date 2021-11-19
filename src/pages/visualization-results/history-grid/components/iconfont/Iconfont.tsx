import { CSSProperties, memo, MouseEventHandler } from 'react'
import '../../assets/iconfont/admin-icon'
import '../../assets/iconfont/history-gird-icon'

interface IconfontProps {
  symbol: string
  className?: string
  style?: CSSProperties
  onClick?: MouseEventHandler<SVGSVGElement>
}

const Iconfont = memo(({ symbol, style, className, onClick }: IconfontProps) => {
  return (
    <svg
      style={{ verticalAlign: '-0.15em', ...style }}
      className={`w-4 h-4 fill-current overflow-hidden ${className || ''}`}
      onClick={onClick}
    >
      <use href={`#${symbol}`}></use>
    </svg>
  )
})

export default Iconfont
