import React from 'react';
import { Button, Input } from 'antd';

interface TitleTreeNodeProps {
  id: string;
  text: string;
  isEdit: boolean;
  onSelect: boolean;
  setIsEdit: (id: string) => void;
  createCildNode: (id: string) => void
}

const TitleTreeNode: React.FC<TitleTreeNodeProps> = ({
  id,
  text,
  isEdit,
  onSelect,
  setIsEdit,
  createCildNode
}) => {
  if (isEdit) {
    return (
      <>
      <div><Input /></div><Button>添加</Button>
      </>
    )
  } 
    return (
      <div>
        <div>{text}</div>
        {
          onSelect ? <div>
            <span></span>
            <span onClick={() => setIsEdit(id)}>编辑</span>
            <span onClick={() => createCildNode(id)}>添加子集</span>
          </div> : null
        }
      </div>
    )

  
}

export { TitleTreeNode as default };