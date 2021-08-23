import React, { useRef, useState } from 'react';
import { Button, Input, message, Popconfirm } from 'antd';
import createSrc from '@/assets/icon-image/create-tree.png';
import deleteSrc from '@/assets/icon-image/delete-tree.png';
import editSrc from '@/assets/icon-image/edit-tree.png';
import {
  creatFavorite,
  deleteFavorite,
  modifyFavoriteName,
} from '@/services/project-management/favorite-list';
import styles from './index.less';

interface TitleTreeNodeProps {
  id: string;
  text: string;
  isEdit: boolean;
  refresh?: () => void;
  onSelect: boolean;
  setIsEdit: (id: string) => void;
  createCildNode: (id: string) => void;
}

const TitleTreeNode: React.FC<TitleTreeNodeProps> = ({
  id,
  text,
  isEdit,
  refresh,
  onSelect,
  setIsEdit,
  createCildNode,
}) => {
  const editRef = useRef<HTMLDivElement>(null);
  const [editName, setEditName] = useState<string>(text ? text : '收藏夹1');

  const addOrModifyEvent = async () => {
    if (!text) {
      await creatFavorite({ name: editName });
      setIsEdit('');
      refresh?.();
      return;
    }
    await modifyFavoriteName({ id: id, name: editName });
    setIsEdit('');
    refresh?.();
  };

  const deleteEvent = async () => {
    await deleteFavorite(id);
    message.success('已删除');
    refresh?.();
  };

  if (isEdit) {
    return (
      <div className={styles.inputItem}>
        <div style={{ display: 'inline-block' }}>
          <Input
            value={editName}
            ref={(input) => {
              console.log(input);
              // input;
            }}
            style={{ height: '25px', width: '10vw' }}
            onChange={(e: any) => setEditName(e.target.value)}
          />
        </div>
        <Button onClick={() => addOrModifyEvent()} style={{ height: '30px', marginTop: '9px' }}>
          确定
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.treeItem}>
      <div>{text}</div>
      {onSelect ? (
        <div>
          <img src={createSrc} className={styles.iconItem} onClick={() => createCildNode(id)} />
          <Popconfirm
            title="您确定要删除当前收藏夹?"
            onConfirm={deleteEvent}
            okText="确认"
            cancelText="取消"
          >
            <img src={deleteSrc} className={styles.iconItem} />
          </Popconfirm>

          <img src={editSrc} className={styles.iconItem} onClick={() => setIsEdit(id)} />
        </div>
      ) : null}
    </div>
  );
};

export { TitleTreeNode as default };
