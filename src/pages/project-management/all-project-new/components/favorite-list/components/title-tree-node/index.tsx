import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Button, Input } from 'antd';
import createSrc from '@/assets/icon-image/create-tree.png';
import deleteSrc from '@/assets/icon-image/delete-tree.png';
import editSrc from '@/assets/icon-image/edit-tree.png';
import { creatFavorite } from '@/services/project-management/favorite-list';

interface TitleTreeNodeProps {
  id: string;
  text: string;
  isEdit: boolean;
  onSelect: boolean;
  setIsEdit: (id: string) => void;
  createCildNode: (id: string) => void;
}

const TitleTreeNode: React.FC<TitleTreeNodeProps> = ({
  id,
  text,
  isEdit,
  onSelect,
  setIsEdit,
  createCildNode,
}) => {
  const editRef = useRef<HTMLDivElement>(null);
  const [editName, setEditName] = useState<string>('111');

  const sureAddEvent = async () => {
    await creatFavorite({ name: editName });
    setIsEdit('');
  };

  if (isEdit) {
    return (
      <>
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
        <Button onClick={() => sureAddEvent()}>确定</Button>
      </>
    );
  }

  return (
    <div style={{ display: 'inline-block' }}>
      <div style={{ display: 'inline-block' }}>{text}</div>
      {onSelect ? (
        <div style={{ display: 'inline-block', marginLeft: '40px' }}>
          <img src={createSrc} onClick={() => createCildNode(id)} />
          <img src={deleteSrc} />
          <img src={editSrc} onClick={() => setIsEdit(id)} />
        </div>
      ) : null}
    </div>
  );
};

export { TitleTreeNode as default };
