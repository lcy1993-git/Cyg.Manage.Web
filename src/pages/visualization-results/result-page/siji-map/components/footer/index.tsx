import { MenuUnfoldOutlined } from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useContainer } from '../../../mobx-store'
import styles from './index.less'
interface Props {
  onlocationClick: () => void
}

const Divider = () => {
  return <span className={styles.divider}> | </span>
}

const Footer = observer((props: Props) => {
  const { onlocationClick } = props
  const store = useContainer()
  const { vState } = store
  const { visibleLeftSidebar } = vState
  return (
    <div className={`${styles.footerContainer} flex`}>
      <div className={styles.icon} onClick={() => store.setVisibleLeftSidebar()}>
        {visibleLeftSidebar ? null : <MenuUnfoldOutlined style={{ fontSize: 16 }} />}
      </div>
      <div className={'flex1'}></div>
      <div className={styles.mapInfo}>
        <span>
          经度:
          <span id={'currentPositionX'}></span>
          纬度:
          <span id={'currentPositionY'}></span>
        </span>
      </div>
    </div>
  )
})

export default Footer
