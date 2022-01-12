import { useClickAway } from 'ahooks'
import { useRef } from 'react'
import styles from './index.less'

interface DragBoxModalProps {
  position: number[]
  onSelectClick: (type: 'LineString' | 'Point') => void
  onCancelClick: () => void
}

const DragBoxModal: React.FC<DragBoxModalProps> = ({ position, onSelectClick, onCancelClick }) => {
  const onDragClick = (e: React.MouseEvent) => {
    const type = (e.target as HTMLDivElement).dataset?.type as 'LineString' | 'Point' | undefined
    type ? onSelectClick(type) : onCancelClick()
  }
  const ref = useRef()
  useClickAway(onCancelClick, ref)

  return (
    <div
      className={styles.modal}
      onClick={onDragClick}
      style={{ left: position[0], top: position[1] }}
    >
      <div data-type="Point" className={styles.row}>
        框选电气设备
      </div>
      <div data-type="LineString" className={styles.row}>
        框选线路
      </div>
    </div>
  )
}

export default DragBoxModal
