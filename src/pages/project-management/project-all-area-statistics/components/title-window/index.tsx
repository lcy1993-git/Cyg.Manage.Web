import React from 'react';
import styles from './index.less';

interface TitleWindowProps {
  title: string | (() => JSX.Element);
}

const TitleWindow: React.FC<TitleWindowProps> = (props) => {
  const { title } = props;
  return (
    <div className={styles.titleWindow}>
      <div className={styles.titleWindowHeader}>
        {typeof title === 'function' ? title() : title}
      </div>
      <div className={styles.titleWindowContent}>{props.children}</div>
    </div>
  );
};

export default TitleWindow;
