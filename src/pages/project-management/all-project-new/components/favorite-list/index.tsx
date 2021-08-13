import { PlusOutlined, UpOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import styles from './index.less';

interface FavoriteListParams {}

const FavoriteList: React.FC<FavoriteListParams> = (props) => {
  return (
    <div className={styles.engineerList}>
      <div className={styles.favHeader}>
        <div className={styles.favTitle}>收藏夹一栏</div>
        <div className={styles.headBtn}>
          <Button className="mr7">
            <PlusOutlined />
            新建
          </Button>
          <Button>
            <UpOutlined />
            收起
          </Button>
        </div>
      </div>
      <div className={styles.favContent}></div>
      <div className={styles.favFooter}>
        <span style={{ cursor: 'pointer' }} onClick={() => {}}>
          <MenuFoldOutlined />
          &nbsp; 收起
        </span>
      </div>
    </div>
  );
};

export default FavoriteList;
