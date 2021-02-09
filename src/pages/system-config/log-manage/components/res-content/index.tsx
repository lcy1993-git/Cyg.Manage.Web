import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface ResContentProps {
  info: any;
}

const ResContent: React.FC<ResContentProps> = (props) => {
  const { info } = props;
  return (
    <div>
      <ReadonlyItem label="响应内容">{info.resContent}</ReadonlyItem>
    </div>
  );
};

export default ResContent;
