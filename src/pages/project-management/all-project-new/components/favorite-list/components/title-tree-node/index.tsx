import React, { useEffect, useRef, useState } from 'react';
import { Button, Input, message, Popconfirm, Tooltip } from 'antd';
import createSrc from '@/assets/icon-image/create-tree.png';
import deleteSrc from '@/assets/icon-image/delete-tree.png';
import editSrc from '@/assets/icon-image/edit-tree.png';
import {
  creatFavorite,
  deleteFavorite,
  modifyFavoriteName,
} from '@/services/project-management/favorite-list';
import styles from './index.less';
import { useUpdateEffect } from 'ahooks';

interface TitleTreeNodeProps {
  id: string;
  text: string;
  isEdit: boolean;
  refresh?: () => void;
  onSelect?: boolean;
  setIsEdit?: (id: string) => void;
  createChildNode?: (id: string) => void;
}

const TitleTreeNode: React.FC<TitleTreeNodeProps> = ({
  id,
  text,
  isEdit,
  refresh,
  onSelect,
  setIsEdit,
  createChildNode,
}) => {
  const editRef = useRef<HTMLInputElement>(null);
  const [editName, setEditName] = useState<string>(text);
  const [editFlag, setEditFlag] = useState<boolean>(false);

  const addOrModifyEvent = () => {
    console.log(editFlag);
    if (editFlag) {
      modifyFavoriteName({ id: id, name: editName });
      setIsEdit('');
      setEditFlag(false);
      message.success('修改成功');
      refresh?.();
      return;
    }
    creatFavorite({ name: editName })
      .then((res) => {
        console.log(res);

        setIsEdit('');
        message.success('创建成功');
        refresh?.();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useUpdateEffect(() => {
    refresh?.();
  }, [isEdit]);

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
            id="editInput"
            onFocus={() => {
              document.getElementById('editInput')?.select();
            }}
            value={editName}
            ref={(input) => {
              //@ts-ignore
              editRef.current = input?.focus();
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
          <Tooltip title="添加子级">
            <img
              src={createSrc}
              className={styles.iconItem}
              onClick={() => createChildNode?.(id)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="您确定要删除当前收藏夹?"
              onConfirm={deleteEvent}
              okText="确认"
              cancelText="取消"
            >
              <img src={deleteSrc} className={styles.iconItem} />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="重命名">
            <img
              src={editSrc}
              className={styles.iconItem}
              onClick={() => {
                setIsEdit(id);
                setEditFlag(true);
                editRef.current?.focus();
              }}
            />
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

export { TitleTreeNode as default };
