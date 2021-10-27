import React from 'react';
import styles from './index.less';
interface PageCommonWrapProps {
  noPadding?: boolean;
  noColor?: boolean;
  className?: string;
}

const PageCommonWrap: React.FC<PageCommonWrapProps> = (props) => {
  const { noPadding = false, className, noColor = false } = props;

  const noPaddingClass = noPadding ? styles.noPadding : '';
  const noColorClass = noColor ? styles.noColor : '';

  return (
    <div className={`${styles.pageCommonWrap} ${className}`}>
      <div className={`${styles.pageCommonWrapContent} ${noPaddingClass} ${noColorClass}`}>
        {props.children}
      </div>
      <div className={styles.explainContent}>
        <span className={styles.explainContentImportant}>工程智慧云平台</span>
        <span className={styles.explainContentCopyTip}>版权所有</span>
        {/* <span className={styles.explainHref} onClick={() => toExplain()}> */}
        <span
          className={styles.explainHref}
          onClick={() =>
            window.open(`/instructionsManage?token=${window.localStorage.getItem('Authorization')}`)
          }
        >
          《工程智慧云管理端使用说明书》
        </span>
        {/* <div className={styles.explainContentCopyTip}>
          ©2018- 四川长园工程勘察设计有限公司 版权所有 蜀ICP备18013772号
        </div> */}
      </div>
    </div>
  );
};

export default PageCommonWrap;
