import PageCommonWrap from '@/components/page-common-wrap';
import React from 'react';
import styles from "./index.less";

const AllProject:React.FC = () => {
    return (
        <PageCommonWrap noPadding={true}>
            <div className={styles.allProjectPage}>
                <div className={styles.allProjectStatistics}>
                    
                </div>
                <div className={styles.allProjectTableContent}>

                </div>
            </div>
        </PageCommonWrap>
    )
}

export default AllProject