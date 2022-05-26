import DrawGridToolbar from './DrawGridToolbar'
import styles from './index.less'
import PowerSupplyTree from './PowerSupplyTree'
import SubstationTree from './SubstationTree'
const LeftMenu = (props: any) => {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <div className="w-full flex-none" style={{ height: '50px' }}>
        <DrawGridToolbar />
      </div>
      <div className={`w-full flex-1 flex flex-col overflow-y-auto ${styles.customScroll}`}>
        <div className={`w-full flex-none`}>
          <SubstationTree />
        </div>
        <div className={`w-full flex-1`}>
          <PowerSupplyTree />
        </div>
      </div>
    </div>
  )
}
export default LeftMenu
