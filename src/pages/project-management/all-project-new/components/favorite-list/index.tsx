import EmptyTip from '@/components/empty-tip';
import { getFavorites } from '@/services/project-management/favorite-list';
import { PlusOutlined, UpOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Input, Tree } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import arrowImg from '@/assets/image/project-management/arrow.png';
import TreeNodeInput from './components/tree-node-input';
import { creatFavorite } from '@/services/project-management/favorite-list';
import styles from './index.less';
import { stubArray } from 'lodash';
import TitleTreeNode from './components/title-tree-node';
import ImageIcon from '@/components/image-icon';
import findCurrentNode from './utils'

import { json } from 'express';

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
  const [editName, setEditName] = useState<string>('一级收藏夹目录');

  console.log({treeData});
  

  const [isEdit, setIsEdit] = useState<string>("");
  const [selectkey, setSelectkey] = useState<string>("")
  const { data, run } = useRequest(() => getFavorites(), {
    onSuccess: () => {
      setTreeData(data);
    },
  });

  console.log(treeData, '222');

  const createCildNode = (id) => {
    const cloneData = JSON.parse(JSON.stringify(treeData))
    let currentNode = findCurrentNode(cloneData, id)
    console.log(currentNode);
    currentNode.children.push({
      id: uuid.v1(),
      text: 'xxxx',
      children: [],
    })
    
    setTreeData(cloneData)
  }

  const mapTreeData = (data: any) => {
    console.log(data.key, isEdit);
    
    return {
      title: <TitleTreeNode id={data.id} text={data.text} onSelect={data.id === selectkey} isEdit={data.id === isEdit} setIsEdit={setIsEdit} createCildNode={createCildNode}/> ,
      key: data.id,
      children: data.children?.map(mapTreeData),
      isEdit: false,
    };
  };

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData);
  }, [JSON.stringify(treeData), selectkey, isEdit]);

  // console.log(handleData);

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
  // 新建一级收藏夹
  const sureAddEvent = async () => {
    await creatFavorite({ name: editName });
    // setIsEdit(false);
  };

  const createEvent1 = () => {
    const newTreeNode = {
      key: uuid.v1(),
      text: '收藏夹1',
      children: [],
      // icon: <ImageIcon width={18} height={14} marginRight={10} imgUrl="icon-file.png" />,
    };
    // console.log(newTreeNode);
    setIsEdit(newTreeNode.key)
    setTreeData({...JSON.parse(JSON.stringify(treeData)), newTreeNode})
    // const copyList = JSON.parse(JSON.stringify(handleData));
    // console.log(copyList, '333');
    // copyList?.push(newTreeNode);
    // copyList.map((item: any) => {
    //   if (item.isEdit) {
    //     item.title = (
    //       <div style={{ display: 'inline-block' }}>
    //         <Input
    //           value={editName}
    //           style={{ height: '25px', width: '10vw' }}
    //           onBlur={() => sureAddEvent()}
    //           onChange={(e: any) => setEditName(e.target.value)}
    //         />
    //         <div style={{ display: 'inline-block', marginLeft: '40px' }}>
    //           <ImageIcon width={15} height={15} marginRight={5} imgUrl="create-tree.png" />
    //           <ImageIcon width={15} height={15} marginRight={5} imgUrl="delete-tree.png" />
    //           <ImageIcon width={15} height={15} imgUrl="edit-tree.png" />
    //         </div>
    //       </div>
    //     );
    //   } else {
    //     item.title = (
    //       <>
    //         <div>{item.title}</div>
    //         <div style={{ display: 'inline-block', marginLeft: '40px' }}>
    //           <ImageIcon width={15} height={15} marginRight={5} imgUrl="create-tree.png" />
    //           <ImageIcon width={15} height={15} marginRight={5} imgUrl="delete-tree.png" />
    //           <ImageIcon width={15} height={15} imgUrl="edit-tree.png" />
    //         </div>
    //       </>
    //     );
    //   }
    // });
    // setTreeData(copyList);
  };




  const createEvent = () => {
    const newTreeNode = {
      id: uuid.v1(),
      text: '收藏夹1',
      children: [],
    };
    setIsEdit(newTreeNode.id)
    setSelectkey(newTreeNode.id)
    setTreeData([...JSON.parse(JSON.stringify(treeData)), newTreeNode])

  }

  const selectEvent = (e,g,m) => {
    
    if(e[0] !== selectkey) {
      setSelectkey(e[0])
      setIsEdit("")
    }

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

      {treeData?.length === 0 ? (
        <div className={styles.favEmpty}>
          <div className={styles.createTips}>
            <span>点击此处新建文件夹</span>
            <img src={arrowImg} style={{ verticalAlign: 'baseline' }} />
          </div>
          <EmptyTip description="暂无内容" />
        </div>
      ) : (
        <div className={styles.favTree}>
          <DirectoryTree
            treeData={handleData}
            height={535}
            defaultExpandAll
            onSelect={selectEvent}
            selectedKeys={[selectkey]}
          />
        </div>
      )}
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
