import EmptyTip from '@/components/empty-tip';
import { getFavorites } from '@/services/project-management/favorite-list';
import { PlusOutlined, MenuFoldOutlined, PoweroffOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Button, Tree } from 'antd';
import uuid from 'node-uuid';
import React, { Dispatch, SetStateAction, useMemo, useState } from 'react';
import arrowImg from '@/assets/image/project-management/arrow.png';
import styles from './index.less';
import TitleTreeNode from './components/title-tree-node';
import findCurrentNode from './utils';
import { mixinDeps } from './utils';
import ImageIcon from '@/components/image-icon';
interface FavoriteListParams {
  visible?: boolean;
  setVisible?: Dispatch<SetStateAction<boolean>>;
  getFavId?: Dispatch<SetStateAction<string>>;
  getFavName?: Dispatch<SetStateAction<string>>;
  setStatisticalTitle?: Dispatch<SetStateAction<string>>;
  finishEvent: () => void;
}

interface treeDataItems {
  id: string;
  text: string;
  children: treeDataItems[];
}

const { DirectoryTree } = Tree;

const FavoriteList: React.FC<FavoriteListParams> = (props) => {
  const { setVisible, visible, getFavId, finishEvent, getFavName, setStatisticalTitle } = props;
  const [treeData, setTreeData] = useState<treeDataItems[]>([]);
  const [parentId, setParentId] = useState<string>('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [allExpand, setAllExpand] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<string>('');
  const [selectkey, setSelectkey] = useState<string>('');
  const { data, run } = useRequest(() => getFavorites(), {
    onSuccess: () => {
      setTreeData(mixinDeps(data, 0));
    },
  });

  const createChildNode = (id: string) => {
    const cloneData = JSON.parse(JSON.stringify(treeData));
    let currentNode = findCurrentNode(cloneData, id);
    const newChildNode = {
      id: uuid.v1(),
      text: '收藏夹1',
      children: [],
    };
    setParentId(id);
    setIsEdit(newChildNode.id);
    setSelectkey(newChildNode.id);
    currentNode?.children.push(newChildNode);
    setTreeData(cloneData);
  };

  const mapTreeData = (data: any) => {
    return {
      title: (
        <TitleTreeNode
          id={data.id}
          text={data.text}
          onSelect={data.id === selectkey}
          isEdit={data.id === isEdit}
          parentId={parentId}
          setParentId={setParentId}
          setIsEdit={setIsEdit}
          refresh={run}
          deep={data.deps}
          createChildNode={createChildNode}
        />
      ),
      key: data.id,
      children: data.children?.map(mapTreeData),
      icon: <ImageIcon width={18} height={14} imgUrl="icon-file.png" />,
    };
  };

  const handleData = useMemo(() => {
    return treeData?.map(mapTreeData);
  }, [JSON.stringify(treeData), selectkey, isEdit]);

  const createEvent = () => {
    const newTreeNode = {
      id: uuid.v1(),
      text: '收藏夹1',
      children: [],
    };
    setIsEdit(newTreeNode.id);
    setSelectkey(newTreeNode.id);
    setTreeData([...JSON.parse(JSON.stringify(treeData ? treeData : '')), newTreeNode]);
  };

  const selectEvent = (e: any, g: any, m: any) => {
    if (e[0] !== selectkey) {
      setSelectkey(e[0]);
      setIsEdit('');
    }
    getFavId?.(e[0]);
    getFavName?.(g.node.title.props.text);
  };

  const openCLoseEvent = () => {
    setAllExpand(!allExpand);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  console.log(allExpand);
  return (
    <div className={styles.engineerList}>
      <div className={styles.favHeader}>
        <div className={styles.favTitle}>收藏夹</div>
        <div className={styles.headBtn}>
          <Button className="mr7" onClick={createEvent}>
            <PlusOutlined />
            新建
          </Button>
          <Button
            onClick={() => {
              setVisible?.(false);
              setIsEdit('');
              setSelectkey('');
              setAllExpand(true);
              getFavId?.('');
              getFavName?.('');
              setStatisticalTitle?.('-1');
              finishEvent?.();
            }}
          >
            <PoweroffOutlined />
            退出
          </Button>
        </div>
      </div>

      {!treeData ? (
        <div className={styles.favEmpty}>
          <div className={styles.createTips}>
            <span>点击此处新建文件夹</span>
            <img src={arrowImg} style={{ verticalAlign: 'baseline' }} />
          </div>
          <EmptyTip description="暂无内容" />
        </div>
      ) : (
        treeData.length > 0 && (
          <div className={styles.favTree}>
            <DirectoryTree
              key={JSON.stringify(allExpand)}
              treeData={handleData}
              height={650}
              defaultExpandAll={allExpand}
              onSelect={selectEvent}
              onExpand={onExpand}
              selectedKeys={[selectkey]}
              expandAction="doubleClick"
            />
          </div>
        )
      )}
      <div className={styles.favFooter}>
        <span style={{ cursor: 'pointer' }} onClick={() => openCLoseEvent()}>
          <MenuFoldOutlined />
          &nbsp; {allExpand ? '全部收起' : '全部展开'}
        </span>
      </div>
    </div>
  );
};

export default FavoriteList;
