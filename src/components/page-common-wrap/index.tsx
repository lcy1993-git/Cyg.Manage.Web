import React from 'react';
import styles from './index.less';
import { explainUrl } from '../../../public/config/request';

interface PageCommonWrapProps {
  noPadding?: boolean;
  className?: string;
}

const PageCommonWrap: React.FC<PageCommonWrapProps> = (props) => {
  const { noPadding = false, className } = props;

  const noPaddingClass = noPadding ? styles.noPadding : '';

  const toExplain = () => {
    window.open(explainUrl);
  };
  return (
    <div className={`${styles.pageCommonWrap} ${className}`}>
      <div className={`${styles.pageCommonWrapContent} ${noPaddingClass}`}>{props.children}</div>
      <div className={styles.explainContent}>
        <span className={styles.explainContentImportant}>工程设计平台</span>
        <span className={styles.explainContentCopyTip}>版权所有</span>
        <span className={styles.explainHref} onClick={() => toExplain()}>
          《工程云设计平台管理端使用说明书》
        </span>
        <div className={styles.explainContentCopyTip}>
          ©2018- 四川长园工程勘察设计有限公司 版权所有 蜀ICP备18013772号
        </div>
      </div>
    </div>
  );
};

export default PageCommonWrap;
