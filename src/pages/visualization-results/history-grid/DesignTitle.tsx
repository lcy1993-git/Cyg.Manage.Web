import FlowLayer from './components/flow-layer'
import styles from './index.less'
import { useHistoryGridContext } from './store'

/** 预设计标题 */
const DesignTitle = () => {
  const { mode, preDesignItemData } = useHistoryGridContext()

  return (mode === 'preDesign' || mode === 'preDesigning') && preDesignItemData ? (
    <FlowLayer className="text-white left-1/2 top-0 transform -translate-x-1/2">
      <div className={`${styles.designTitle} inline-block relative px-6 py-2`}>
        <span className="relative">网架规划_{preDesignItemData.name}</span>
      </div>
    </FlowLayer>
  ) : null
}

export default DesignTitle
