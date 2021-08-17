import React from 'react';
import emptyImageSrc from '@/assets/image/empty.png';
import handFinishSrc from '@/assets/image/hand-finish.png';
import { Empty } from 'antd';

interface EmptyTipProps {
  imgSrc?: 'empty' | 'finish';
  description?: string | React.ReactNode;
  className?: string;
}

const EmptyTip: React.FC<EmptyTipProps> = (props) => {
  const { description = '没有找到匹配的记录', className, imgSrc = 'empty' } = props;
  return (
    <Empty
      image={imgSrc === 'finish' ? handFinishSrc : emptyImageSrc}
      description={description}
      className={className}
    >
      {props.children}
    </Empty>
  );
};

export default EmptyTip;
