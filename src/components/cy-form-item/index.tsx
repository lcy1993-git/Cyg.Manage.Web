import { Form } from 'antd'
import React from 'react'
import styles from './index.less'

interface CyFormItemProps {
  label?: string | React.ReactNode
  labelSlot?: () => React.ReactNode
  required?: boolean
  className?: string
  align?: 'left' | 'right'
  labelWidth?: number
  overflow?: boolean
}

const withCyFormItemProps = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & CyFormItemProps & { children?: React.ReactNode }
) => {
  const {
    className = '',
    labelWidth = 90,
    overflow = false,
    label = '',
    align = 'left',
    required,
    labelSlot,
    ...rest
  } = props

  const isRequiredClassName = required ? styles.required : ''
  const lableAlign = align === 'right' ? styles.right : ''

  return (
    <div className={`${styles.cyFormItem} ${className}`}>
      <div
        className={`${styles.cyFormItemLabel} ${lableAlign}`}
        style={{ width: `${labelWidth}px` }}
      >
        <span className={`${styles.cyFormItemLabelWord} ${isRequiredClassName}`}>
          {label}
          {labelSlot?.()}
        </span>
      </div>
      <div
        className={styles.cyFormItemContent}
        style={{
          overflow: overflow ? 'visible' : 'hidden',
        }}
      >
        <WrapperComponent {...(rest as P)}>{props.children}</WrapperComponent>
      </div>
    </div>
  )
}

export default withCyFormItemProps(Form.Item)
