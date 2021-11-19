import FlowLayer from './components/flow-layer'
import styles from './index.less'
import { useHistoryGridContext } from './store'

/** 预设计标题 */
const DesignTitle = () => {
  const { mode, currentData } = useHistoryGridContext()

  return mode === 'preDesign' || mode === 'preDesigning' ? (
    <FlowLayer className="text-white left-1/2 top-0 transform -translate-x-1/2">
      <div className={`${styles.designTitle} inline-block relative px-6 py-2`}>
        <span className="relative">预设计_{currentData?.title}</span>
      </div>
    </FlowLayer>
  ) : null
}

export default DesignTitle
