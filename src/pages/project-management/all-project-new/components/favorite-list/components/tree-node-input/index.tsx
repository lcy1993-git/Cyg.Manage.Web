import { Input } from 'antd';
import React, { useState } from 'react';

interface treeNodeParams {
  isEdit: boolean;
  treeData: any[];
}

const TreeNodeInput: React.FC = (props) => {
  //   const { isEdit } = props;
  const [editName, setEditName] = useState<string>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const sureAddEvent = () => {
    console.log(editName);
    setIsEdit(false);
  };
  return (
    <div>
      {}
      <Input onBlur={sureAddEvent} onChange={(e: any) => setEditName(e.target.value)} />
    </div>
  );
};

export default TreeNodeInput;
