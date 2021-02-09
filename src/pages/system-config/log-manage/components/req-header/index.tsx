import ReadonlyItem from '@/components/readonly-item';
import React from 'react';

interface ReqHeaderProps {
  info: any;
}

const ReqHeader: React.FC<ReqHeaderProps> = (props) => {
  const { info } = props;
  return (
    <div>
      <ReadonlyItem label="请求头">{info.reqHeader}</ReadonlyItem>
    </div>
  );
};

export default ReqHeader;
