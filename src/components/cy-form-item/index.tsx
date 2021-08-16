import React from 'react';
import styles from './index.less';
import { Form } from 'antd';

interface CyFormItemProps {
  label?: string | React.ReactNode;
  required?: boolean;
  className?: string;
  align?: 'left' | 'right';
  labelWidth?: number;
}

const withCyFormItemProps = <P extends {}>(WrapperComponent: React.ComponentType<P>) => (
  props: P & CyFormItemProps & { children?: React.ReactNode },
) => {
  const { className = '', labelWidth = 90, label = '', align = 'left', required, ...rest } = props;

  const isRequiredClassName = required ? styles.required : '';
  const lableAlign = align === 'right' ? styles.right : '';

  return (
    <div className={`${styles.cyFormItem} ${className}`}>
      <div
        className={`${styles.cyFormItemLabel} ${lableAlign}`}
        style={{ width: `${labelWidth}px` }}
      >
        <span className={`${styles.cyFormItemLabelWord} ${isRequiredClassName}`}>{label}</span>
      </div>
      <div className={styles.cyFormItemContent}>
        <WrapperComponent {...(rest as P)}>{props.children}</WrapperComponent>
      </div>
    </div>
  );
};

export default withCyFormItemProps(Form.Item);
