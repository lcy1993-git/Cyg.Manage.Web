import { getFavorites } from '@/services/project-management/favorite-list';
import useRequest from '@ahooksjs/use-request';
import { PlusOutlined, UpOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Dispatch, SetStateAction } from '@umijs/renderer-react/node_modules/@types/react';
import { Button, Tree } from 'antd';
import React from 'react';
import styles from './index.less';

interface FavoriteListParams {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const FavoriteList: React.FC<FavoriteListParams> = (props) => {
  const { setVisible, visible } = props;

  const { data: treeData } = useRequest(() => getFavorites());
  console.log(treeData);

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
      <div className={styles.favContent}>
        <Tree treeData={treeData} height={233} defaultExpandAll />
      </div>
      <div className={styles.favFooter}>
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setVisible?.(false);
          }}
        >
          <MenuFoldOutlined />
          &nbsp; 收起
        </span>
      </div>
    </div>
  );
};

export default FavoriteList;
