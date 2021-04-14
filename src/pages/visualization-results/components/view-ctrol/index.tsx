import React, { Fragment } from 'react';
import styles from './index.less';

const ViewCtrol: React.FC<any> = (props): JSX.Element => {
  const {changeleLeftSidbarState} = props;
  return (
    <Fragment>
      <div className={styles.mapContainer}>
        123
      </div> 
      <div className={styles.handleLeftSidbarHideButton} onClick={()=>changeleLeftSidbarState.change()}>
        { changeleLeftSidbarState.state ? "《《" : "》》" }
      </div>
    </Fragment>
  );
}

export default ViewCtrol;