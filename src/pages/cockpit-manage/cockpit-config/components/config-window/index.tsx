import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import React from 'react'

import styles from './index.less'

interface ConfigWindowProps {
  editEvent?: (record: any) => void
  deleteEvent?: (record: any) => void
  record?: any
  isEdit?: boolean
}

const ConfigWindow: React.FC<ConfigWindowProps> = (props) => {
  const { record, deleteEvent, editEvent, isEdit = true, ...rest } = props

  const clickDeleteEvent = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, record: any) => {
    deleteEvent?.(record)

    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
  }

  return (
    <div className={styles.configWindow} {...rest}>
      {isEdit && (
        <span
          className={`${styles.configWindowEditButton} noDraggable`}
          onClick={() => editEvent?.(record)}
        >
          <EditOutlined />
        </span>
      )}
      <span
        className={`${styles.configWindowDeleteButton} noDraggable`}
        onClick={(e) => clickDeleteEvent?.(e, record)}
      >
        <DeleteOutlined />
      </span>
      {props.children}
    </div>
  )
}

export default ConfigWindow
