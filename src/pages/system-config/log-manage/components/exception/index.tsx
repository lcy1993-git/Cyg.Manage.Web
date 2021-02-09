import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface ExceptionProps {
  info: any;
}

const Exception: React.FC<ExceptionProps> = (props) => {
  const { info } = props;
  return (
    <div>
      <ReadonlyItem label="异常">{info.exception}</ReadonlyItem>
    </div>
  );
};

export default Exception;
