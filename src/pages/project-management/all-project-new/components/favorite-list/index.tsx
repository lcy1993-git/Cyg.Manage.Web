import { getFavorites } from '@/services/project-management/favorite-list';
import { PlusOutlined, UpOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Tree } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useState } from 'react';
import TreeNodeInput from './components/tree-node-input';

import styles from './index.less';

interface FavoriteListParams {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

interface treeDataItems {
  id: string;
  text: string;
  children: treeDataItems[];
}

const { DirectoryTree } = Tree;

const FavoriteList: React.FC<FavoriteListParams> = (props) => {
  const { setVisible, visible } = props;
  const [treeData, setTreeData] = useState<treeDataItems[]>([]);

  const { data } = useRequest(getFavorites, {
    manual: true,
    ready: visible,
    onSuccess: () => {
      setTreeData(data);
    },
  });

  console.log(treeData, '222');

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
    const newTreeNode = {
      key: uuid.v1(),
      title: '收藏夹1',
      children: [],
    };
    console.log(newTreeNode);
    const copyList = JSON.parse(JSON.stringify(treeData));
    console.log(copyList, '333');
    copyList?.push(newTreeNode);
    setTreeData(copyList);
  };

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
        <TreeNodeInput treeData={treeData} />
        <DirectoryTree treeData={treeData} height={535} defaultExpandAll />
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
