import { Input } from 'antd';
import React, { useState } from 'react';

interface treeNodeParams {
  isEdit: boolean;
}

const TreeNodeInput: React.FC = (props) => {
  const [editName, setEditName] = useState<string>();

  const sureAddEvent = () => {
    console.log(editName);
  };
  return (
    <div>
      <Input onBlur={sureAddEvent} onChange={(e: any) => setEditName(e.target.value)} />
    </div>
  );
};

export default TreeNodeInput;
