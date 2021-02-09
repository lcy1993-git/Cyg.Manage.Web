import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface ContentProps {
  info: any;
}

const Content: React.FC<ContentProps> = (props) => {
  const { info } = props;
  return (
    <div>
      <ReadonlyItem label="内容">{info.message}</ReadonlyItem>
    </div>
  );
};

export default Content;
