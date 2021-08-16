import { getFavorites } from '@/services/project-management/favorite-list';
import { PlusOutlined, UpOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Dispatch, SetStateAction } from '@umijs/renderer-react/node_modules/@types/react';
import { useRequest } from 'ahooks';
import { Button, Tree } from 'antd';
import React from 'react';

import styles from './index.less';

interface FavoriteListParams {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const { DirectoryTree } = Tree;

const FavoriteList: React.FC<FavoriteListParams> = (props) => {
  const { setVisible, visible } = props;

  const { data: treeData = [] } = useRequest(getFavorites, {
    ready: visible,
  });

  // function dig(path = '0', level = 3) {
  //   const list = [];
  //   for (let i = 0; i < 10; i += 1) {
  //     const key = `${path}-${i}`;
  //     const treeNode = {
  //       title: key,
  //       key,
  //     };

  //     if (level > 0) {
  //       treeNode.children = dig(key, level - 1);
  //     }

  //     list.push(treeNode);
  //   }
  //   return list;
  // }

  // const treeData = dig();
  //新建一级收藏夹
  const createEvent = () => {
    // const newTreeNode = {
    //   name: '收藏夹1',
    //   parentId: null,
    // };
    // treeData.push(newTreeNode);
  };

  console.log(treeData);

  return (
    <div className={styles.engineerList}>
      <div className={styles.favHeader}>
        <div className={styles.favTitle}>收藏夹一栏</div>
        <div className={styles.headBtn}>
          <Button className="mr7" onClick={createEvent}>
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
        <DirectoryTree treeData={treeData} height={233} defaultExpandAll />
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
